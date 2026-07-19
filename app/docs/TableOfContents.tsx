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

    const updateActiveHeading = () => {
      const currentHeading =
        [...headingElements].reverse().find((heading) => heading.getBoundingClientRect().top <= 120) ??
        headingElements[0];

      setActiveId(currentHeading.id);
    };

    const observer = new IntersectionObserver(updateActiveHeading, {
      rootMargin: '-96px 0px -68% 0px',
      threshold: [0, 1],
    });

    headingElements.forEach((heading) => observer.observe(heading));
    updateActiveHeading();
    window.addEventListener('scroll', updateActiveHeading, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveHeading);
    };
  }, [visibleHeadings]);

  if (!visibleHeadings.length) {
    return <p>{noHeadingsLabel}</p>;
  }

  return (
    <nav>
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
