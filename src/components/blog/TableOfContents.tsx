import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
  isMobile?: boolean;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, isMobile = false }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${isMobile ? 'mb-8' : 'sticky top-24'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full px-4 py-3 flex items-center justify-between font-semibold text-slate-800 hover:bg-gray-50 ${isMobile ? '' : 'lg:cursor-default'}`}
      >
        <div className="flex items-center gap-2">
          <List size={20} className="text-yellow-500" />
          <span>Table of Contents</span>
        </div>
        {isMobile && (
          <span className="text-gray-400">{isCollapsed ? '+' : '−'}</span>
        )}
      </button>

      <nav
        className={`${
          isCollapsed && isMobile ? 'hidden' : 'block'
        } border-t border-gray-200 px-4 py-3 max-h-[calc(100vh-200px)] overflow-y-auto`}
      >
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
              <button
                onClick={() => scrollToSection(heading.id)}
                className={`text-left w-full py-1 px-2 rounded text-sm transition-colors hover:bg-gray-100 ${
                  activeId === heading.id
                    ? 'text-yellow-600 font-semibold bg-yellow-50'
                    : 'text-gray-600'
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TableOfContents;
