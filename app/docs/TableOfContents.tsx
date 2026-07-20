'use client';

import { useEffect, useState } from 'react';
import type { RenderedMarkdown } from './markdown';

type TableOfContentsProps = {
  headings: RenderedMarkdown['headings'];
  noHeadingsLabel: string;
};

export function TableOfContents({ headings, noHeadingsLabel }: TableOfContentsProps) {
  const visibleHeadings = headings.slice(0, 12);
  const [activeId, setActiveId] = useState(visibleHeadings[0]?.id ?? '');

  useEffect(() => {
    if (!visibleHeadings.length) {
      return;
    }

    const headingElements = visibleHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headingElements.length) {
      return;
    }

    const scrollRoot = document.querySelector<HTMLElement>('.docs-content-layout');

    const updateActiveHeading = () => {
      const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0;
      const currentHeading =
        [...headingElements].reverse().find((heading) => heading.getBoundingClientRect().top <= rootTop + 80) ??
        headingElements[0];

      setActiveId(currentHeading.id);
    };

    const observer = new IntersectionObserver(updateActiveHeading, {
      root: scrollRoot,
      rootMargin: '-80px 0px -68% 0px',
      threshold: [0, 1],
    });

    headingElements.forEach((heading) => observer.observe(heading));
    updateActiveHeading();
    scrollRoot?.addEventListener('scroll', updateActiveHeading, { passive: true });

    return () => {
      observer.disconnect();
      scrollRoot?.removeEventListener('scroll', updateActiveHeading);
    };
  }, [visibleHeadings]);

  if (!visibleHeadings.length) {
    return <p>{noHeadingsLabel}</p>;
  }

  return (
    <nav className="toc-table">
      {visibleHeadings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={['toc-link', `level-${heading.level}`, activeId === heading.id ? 'active' : ''].join(' ')}
          aria-current={activeId === heading.id ? 'true' : undefined}
          onClick={() => setActiveId(heading.id)}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
