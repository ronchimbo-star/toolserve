import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm overflow-x-auto">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-slate-400 mx-2 flex-shrink-0" />
              )}
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-slate-600 hover:text-orange-600 transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-slate-800 font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
