'use client';

import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import type { NavigationItem } from '../routes';
import type { Language } from './data';
import { translateUi } from './i18n';

type SidebarNavigationProps = {
  items: NavigationItem[];
  activeHref: string;
  language: Language;
  onNavigate?: () => void;
};

type SidebarNode = NavigationItem & {
  href?: string;
  id: string;
  depth: number;
  children?: SidebarNode[];
};

type FilterGroup = {
  key: string;
  labels: string[];
  nodes: SidebarNode[];
};

type StoredSidebarPosition = {
  activeHref?: string;
  anchorTop?: number;
  scrollTop: number;
};

const filterStorageKey = 'angular-docs-sidebar-filter';
const filterStorageEvent = 'angular-docs-sidebar-filter-change';
const sidebarPositionStoragePrefix = 'angular-docs-sidebar-position';
const sidebarLabelMaxLength = 195;

const isExternal = (value?: string) => Boolean(value?.startsWith('http'));

const normalizePath = (value?: string) => {
  if (!value || isExternal(value)) {
    return value ?? '';
  }

  return value.startsWith('/') ? value : `/${value}`;
};

const getLocalizedHref = (href: string, language: Language) => {
  if (isExternal(href) || language === 'en') {
    return href;
  }

  return `${href}?lang=${language}`;
};

const statusLabel = (status?: string) => {
  if (!status) {
    return null;
  }

  return <span className="nav-status">{status}</span>;
};

const getStoredFilter = () =>
  typeof window === 'undefined' ? '' : (window.sessionStorage.getItem(filterStorageKey) ?? '');

const getServerFilterSnapshot = () => '';

const subscribeToStoredFilter = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(filterStorageEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(filterStorageEvent, onStoreChange);
  };
};

const setStoredFilter = (value: string) => {
  window.sessionStorage.setItem(filterStorageKey, value);
  window.dispatchEvent(new Event(filterStorageEvent));
};

const getSidebarPositionStorageKey = (tree: SidebarNode[], language: Language) =>
  `${sidebarPositionStoragePrefix}:${language}:${tree.map((node) => node.label).join('|')}`;

const getEscapedSelectorValue = (value: string) => window.CSS?.escape(value) ?? value.replaceAll('"', '\\"');

const getStoredSidebarPosition = (storageKey: string): StoredSidebarPosition | undefined => {
  try {
    const stored = window.sessionStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as StoredSidebarPosition) : undefined;
  } catch {
    return undefined;
  }
};

const setStoredSidebarPosition = (storageKey: string, position: StoredSidebarPosition) => {
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(position));
  } catch {
    // Ignore storage failures; navigation should keep working even in restricted browsing modes.
  }
};

const saveSidebarPosition = (storageKey: string, sidebar: HTMLElement, anchor?: HTMLElement, activeHref?: string) => {
  const sidebarTop = sidebar.getBoundingClientRect().top;
  const anchorTop = anchor ? anchor.getBoundingClientRect().top - sidebarTop : undefined;

  setStoredSidebarPosition(storageKey, {
    activeHref,
    anchorTop,
    scrollTop: sidebar.scrollTop,
  });
};

const truncateLabel = (label: string) => {
  const characters = Array.from(label);

  if (characters.length <= sidebarLabelMaxLength) {
    return label;
  }

  return `${characters.slice(0, sidebarLabelMaxLength).join('')}...`;
};

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .toLocaleLowerCase();

const getFilterTerms = (value: string) =>
  normalizeSearchValue(value)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

const getNormalizedCharacter = (value: string) => normalizeSearchValue(value);
const arabicWordCharacterPattern = /[\p{Script=Arabic}\u200c]/u;

const isArabicWordCharacter = (value: string) => arabicWordCharacterPattern.test(value);
const zeroWidthJoiner = '\u200d';

const preserveArabicJoining = (value: string, start: number, end: number) => {
  const selected = value.slice(start, end);

  if (!Array.from(selected).some(isArabicWordCharacter)) {
    return selected;
  }

  const prefix = start > 0 && isArabicWordCharacter(value[start - 1]) ? zeroWidthJoiner : '';
  const suffix = end < value.length && isArabicWordCharacter(value[end]) ? zeroWidthJoiner : '';

  return `${prefix}${selected}${suffix}`;
};

const getHighlightRanges = (value: string, terms: string[]) => {
  const normalizedCharacters = Array.from(value).map((character, index) => ({
    index,
    value: getNormalizedCharacter(character),
  }));
  const normalizedValue = normalizedCharacters.map((character) => character.value).join('');
  const ranges: { start: number; end: number }[] = [];

  terms.forEach((term) => {
    let searchFrom = 0;

    while (searchFrom < normalizedValue.length) {
      const matchIndex = normalizedValue.indexOf(term, searchFrom);

      if (matchIndex === -1) {
        break;
      }

      const matchEndIndex = matchIndex + term.length - 1;
      const start = normalizedCharacters[matchIndex]?.index;
      const end = (normalizedCharacters[matchEndIndex]?.index ?? start) + 1;

      if (start !== undefined) {
        ranges.push({ start, end });
      }

      searchFrom = matchIndex + Math.max(term.length, 1);
    }
  });

  return ranges
    .sort((first, second) => first.start - second.start || second.end - first.end)
    .reduce<{ start: number; end: number }[]>((merged, range) => {
      const previous = merged.at(-1);

      if (!previous || range.start > previous.end) {
        merged.push(range);
        return merged;
      }

      previous.end = Math.max(previous.end, range.end);
      return merged;
    }, []);
};

const highlightSearchTerms = (value: string, terms: string[]) => {
  const ranges = getHighlightRanges(value, terms);

  if (!ranges.length) {
    return value;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, index) => {
    if (range.start > cursor) {
      parts.push(value.slice(cursor, range.start));
    }

    parts.push(
      <mark key={`${range.start}-${range.end}-${index}`} className="sidebar-search-highlight">
        {preserveArabicJoining(value, range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });

  if (cursor < value.length) {
    parts.push(value.slice(cursor));
  }

  return parts;
};

const buildTree = (items: NavigationItem[], depth = 0, parentId = 'root'): SidebarNode[] =>
  items.map((item, index) => {
    const id = `${parentId}-${index}-${item.label}`;
    const href = item.path ? normalizePath(item.path) : undefined;

    return {
      ...item,
      href,
      id,
      depth,
      children: item.children ? buildTree(item.children, depth + 1, id) : undefined,
    };
  });

const collectExpandableIds = (items: SidebarNode[]) => {
  const ids = new Set<string>();

  const walk = (nodes: SidebarNode[]) => {
    nodes.forEach((node) => {
      if (node.children?.length) {
        ids.add(node.id);
        walk(node.children);
      }
    });
  };

  walk(items);
  return ids;
};

const getAncestorIds = (items: SidebarNode[], targetId: string, ancestors: string[] = []): string[] => {
  for (const item of items) {
    if (item.id === targetId) {
      return ancestors;
    }

    if (item.children?.length) {
      const found = getAncestorIds(item.children, targetId, [...ancestors, item.id]);

      if (found.length || item.children.some((child) => child.id === targetId)) {
        return found;
      }
    }
  }

  return [];
};

const findNode = (items: SidebarNode[], predicate: (node: SidebarNode) => boolean): SidebarNode | undefined => {
  for (const item of items) {
    if (predicate(item)) {
      return item;
    }

    const child = item.children ? findNode(item.children, predicate) : undefined;

    if (child) {
      return child;
    }
  }

  return undefined;
};

const getActiveExpandedIds = (items: SidebarNode[], activeHref: string) => {
  const activeNode = findNode(items, (node) => node.href === activeHref);
  return new Set(activeNode ? getAncestorIds(items, activeNode.id) : []);
};

const getFilterGroups = (items: SidebarNode[], filter: string): FilterGroup[] => {
  const terms = getFilterTerms(filter);

  if (!terms.length) {
    return [];
  }

  const groups = new Map<string, FilterGroup>();

  const addResult = (node: SidebarNode, trail: SidebarNode[]) => {
    const key = trail.map((item) => item.id).join('/');
    const existing = groups.get(key);

    if (existing) {
      existing.nodes.push(node);
      return;
    }

    groups.set(key, {
      key,
      labels: trail.map((item) => item.label),
      nodes: [node],
    });
  };

  const walk = (nodes: SidebarNode[], trail: SidebarNode[]) => {
    nodes.forEach((node) => {
      const searchableValue = normalizeSearchValue(node.label);
      const nodeMatched = terms.every((term) => searchableValue.includes(term));

      if (node.href && nodeMatched) {
        addResult(node, trail);
      }

      if (node.children?.length) {
        walk(node.children, [...trail, node]);
      }
    });
  };

  walk(items, []);
  return [...groups.values()];
};

export function SidebarNavigation({ items, activeHref, language, onNavigate }: SidebarNavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const tree = useMemo(() => buildTree(items), [items]);
  const sidebarPositionStorageKey = useMemo(() => getSidebarPositionStorageKey(tree, language), [tree, language]);
  const filter = useSyncExternalStore(subscribeToStoredFilter, getStoredFilter, getServerFilterSnapshot);
  const deferredFilter = useDeferredValue(filter);
  const trimmedFilter = deferredFilter.trim();
  const filterTerms = useMemo(() => getFilterTerms(deferredFilter), [deferredFilter]);
  const filterGroups = useMemo(() => getFilterGroups(tree, deferredFilter), [tree, deferredFilter]);
  const isFiltering = Boolean(trimmedFilter);
  const [expandedIds, setExpandedIds] = useState(() => {
    const activeIds = getActiveExpandedIds(tree, activeHref);
    return activeIds.size ? activeIds : collectExpandableIds(tree);
  });

  useEffect(() => {
    const sidebar = navRef.current?.closest<HTMLElement>('.sidebar');

    if (!sidebar) {
      return;
    }

    const handleScroll = () => {
      const current = getStoredSidebarPosition(sidebarPositionStorageKey);
      setStoredSidebarPosition(sidebarPositionStorageKey, {
        ...current,
        scrollTop: sidebar.scrollTop,
      });
    };

    sidebar.addEventListener('scroll', handleScroll, { passive: true });
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, [sidebarPositionStorageKey]);

  useLayoutEffect(() => {
    const sidebar = navRef.current?.closest<HTMLElement>('.sidebar');

    if (!sidebar) {
      return;
    }

    const restorePosition = () => {
      const stored = getStoredSidebarPosition(sidebarPositionStorageKey);

      if (!stored) {
        return;
      }

      const targetSelector = `[data-sidebar-href="${getEscapedSelectorValue(activeHref)}"]`;
      const target = sidebar.querySelector<HTMLElement>(targetSelector);

      if (target && stored.activeHref === activeHref && typeof stored.anchorTop === 'number') {
        const sidebarTop = sidebar.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top - sidebarTop;
        sidebar.scrollTop += targetTop - stored.anchorTop;
        return;
      }

      sidebar.scrollTop = stored.scrollTop;
    };

    restorePosition();
    const frame = window.requestAnimationFrame(restorePosition);

    return () => window.cancelAnimationFrame(frame);
  }, [activeHref, isFiltering, sidebarPositionStorageKey]);

  const preserveSidebarPosition = (origin: HTMLElement, update: () => void) => {
    const sidebar = origin.closest<HTMLElement>('.sidebar');
    const anchor = origin.closest<HTMLElement>('.sidebar-node') ?? origin;
    const anchorTop = anchor.getBoundingClientRect().top;

    update();

    window.requestAnimationFrame(() => {
      if (!sidebar) {
        return;
      }

      const nodeId = anchor.dataset.sidebarNodeId ?? '';
      const escapedNodeId = window.CSS?.escape(nodeId) ?? nodeId.replaceAll('"', '\\"');
      const updatedAnchor = anchor.isConnected
        ? anchor
        : sidebar.querySelector<HTMLElement>(`[data-sidebar-node-id="${escapedNodeId}"]`);
      const updatedTop = updatedAnchor?.getBoundingClientRect().top ?? anchorTop;

      sidebar.scrollTop += updatedTop - anchorTop;
    });
  };

  const toggle = (node: SidebarNode, origin: HTMLElement) => {
    preserveSidebarPosition(origin, () => {
      setExpandedIds((current) => {
        const ancestorIds = getAncestorIds(tree, node.id);
        const next = new Set([...current, ...ancestorIds]);

        if (current.has(node.id)) {
          next.delete(node.id);
          return next;
        }

        next.add(node.id);
        return next;
      });
    });
  };

  const selectNode = (node: SidebarNode, origin: HTMLElement) => {
    const sidebar = origin.closest<HTMLElement>('.sidebar');
    const anchor = origin.closest<HTMLElement>('.sidebar-node') ?? origin;

    if (sidebar) {
      saveSidebarPosition(sidebarPositionStorageKey, sidebar, anchor, node.href);
    }

    preserveSidebarPosition(origin, () => {
      setExpandedIds((current) => new Set([...current, ...getAncestorIds(tree, node.id)]));
    });
    onNavigate?.();
  };

  const renderLinkContent = (node: SidebarNode, highlightTerms: string[] = []) => {
    const label = truncateLabel(node.label);
    const hasTruncatedLabel = label !== node.label;

    return (
      <>
        <span className="sidebar-link-label" title={hasTruncatedLabel ? node.label : undefined}>
          {highlightSearchTerms(label, highlightTerms)}
        </span>
        {statusLabel(node.status)}
      </>
    );
  };

  const renderResultNode = (node: SidebarNode) => {
    const isActive = node.href === activeHref;
    const linkHref = node.href ? getLocalizedHref(node.href, language) : undefined;

    if (!linkHref) {
      return null;
    }

    return (
      <div
        key={node.id}
        className="sidebar-node sidebar-filter-result"
        data-sidebar-node-id={node.id}
        data-sidebar-href={node.href}
      >
        <div className="sidebar-row depth-1">
          <span className={['sidebar-toggle-placeholder', isActive ? 'active' : ''].join(' ')} aria-hidden="true" />
          <Link
            href={linkHref}
            scroll={false}
            className={['sidebar-link', isActive ? 'active' : ''].join(' ')}
            target={isExternal(linkHref) ? '_blank' : undefined}
            rel={isExternal(linkHref) ? 'noreferrer' : undefined}
            onClick={(event) => selectNode(node, event.currentTarget)}
          >
            {renderLinkContent(node, filterTerms)}
          </Link>
        </div>
      </div>
    );
  };

  const renderFilterResults = () => {
    if (!filterGroups.length) {
      return <p className="sidebar-filter-empty">{translateUi('noFilterResults', language)}</p>;
    }

    return filterGroups.map((group) => (
      <div key={group.key || 'root'} className="sidebar-filter-group">
        {group.labels.length ? <div className="sidebar-filter-breadcrumb">{group.labels.join(' / ')}</div> : null}
        <div className="sidebar-filter-results">{group.nodes.map(renderResultNode)}</div>
      </div>
    ));
  };

  const renderNodes = (nodes: SidebarNode[]) =>
    nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isExpanded = expandedIds.has(node.id);
      const isActive = node.href === activeHref;
      const linkHref = node.href ? getLocalizedHref(node.href, language) : undefined;
      const depthClass = `depth-${Math.min(node.depth, 3)}`;
      const content = renderLinkContent(node);

      return (
        <div key={node.id} className="sidebar-node" data-sidebar-node-id={node.id} data-sidebar-href={node.href}>
          <div className={['sidebar-row', depthClass].join(' ')}>
            {hasChildren ? (
              <button
                type="button"
                className="sidebar-toggle"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? translateUi('collapse', language) : translateUi('expand', language)} ${
                  node.label
                }`}
                onClick={(event) => toggle(node, event.currentTarget)}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M7.5 4.5 13 10l-5.5 5.5" />
                </svg>
              </button>
            ) : (
              <span className={['sidebar-toggle-placeholder', isActive ? 'active' : ''].join(' ')} aria-hidden="true" />
            )}

            {linkHref ? (
              <Link
                href={linkHref}
                scroll={false}
                className={['sidebar-link', isActive ? 'active' : ''].join(' ')}
                target={isExternal(linkHref) ? '_blank' : undefined}
                rel={isExternal(linkHref) ? 'noreferrer' : undefined}
                onClick={(event) => selectNode(node, event.currentTarget)}
              >
                {content}
              </Link>
            ) : (
              <button
                type="button"
                className="sidebar-link sidebar-group"
                aria-expanded={hasChildren ? isExpanded : undefined}
                onClick={hasChildren ? (event) => toggle(node, event.currentTarget) : undefined}
              >
                {content}
              </button>
            )}
          </div>

          {hasChildren && isExpanded ? <div className="sidebar-children">{renderNodes(node.children ?? [])}</div> : null}
        </div>
      );
    });

  return (
    <nav ref={navRef} className="sidebar-navigation">
      <div className="sidebar-filter">
        <div className="sidebar-filter-input-wrap">
          <input
            type="search"
            className="sidebar-filter-input"
            value={filter}
            placeholder={translateUi('filterNavigation', language)}
            aria-label={translateUi('filterNavigation', language)}
            onChange={(event) => setStoredFilter(event.target.value)}
          />
          {filter ? (
            <button
              type="button"
              className="sidebar-filter-clear"
              aria-label={translateUi('clearFilter', language)}
              title={translateUi('clearFilter', language)}
              onClick={() => setStoredFilter('')}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m6 6 8 8M14 6l-8 8" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {isFiltering ? <div className="sidebar-filter-panel">{renderFilterResults()}</div> : renderNodes(tree)}
    </nav>
  );
}
