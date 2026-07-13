'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { NavigationItem } from '../routes';
import type { Language } from './data';

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

export function SidebarNavigation({ items, activeHref, language, onNavigate }: SidebarNavigationProps) {
  const tree = useMemo(() => buildTree(items), [items]);
  const [expandedIds, setExpandedIds] = useState(() => {
    const activeIds = getActiveExpandedIds(tree, activeHref);
    return activeIds.size ? activeIds : collectExpandableIds(tree);
  });

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

        if (current.has(node.id)) {
          return new Set(ancestorIds);
        }

        return new Set([...ancestorIds, node.id]);
      });
    });
  };

  const selectNode = (node: SidebarNode, origin: HTMLElement) => {
    preserveSidebarPosition(origin, () => {
      setExpandedIds(new Set(getAncestorIds(tree, node.id)));
    });
    onNavigate?.();
  };

  const renderNodes = (nodes: SidebarNode[]) =>
    nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isExpanded = expandedIds.has(node.id);
      const isActive = node.href === activeHref;
      const linkHref = node.href ? getLocalizedHref(node.href, language) : undefined;
      const depthClass = `depth-${Math.min(node.depth, 3)}`;
      const content = (
        <>
          <span className="sidebar-link-label">{node.label}</span>
          {statusLabel(node.status)}
        </>
      );

      return (
        <div key={node.id} className="sidebar-node" data-sidebar-node-id={node.id}>
          <div className={['sidebar-row', depthClass].join(' ')}>
            {hasChildren ? (
              <button
                type="button"
                className="sidebar-toggle"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.label}`}
                onClick={(event) => toggle(node, event.currentTarget)}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M7.5 4.5 13 10l-5.5 5.5" />
                </svg>
              </button>
            ) : (
              <span className="sidebar-toggle-placeholder" aria-hidden="true" />
            )}

            {linkHref ? (
              <Link
                href={linkHref}
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

  return <nav>{renderNodes(tree)}</nav>;
}
