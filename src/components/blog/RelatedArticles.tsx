import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  reading_time?: number;
}

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <div className="my-12 py-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Related Articles</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <Link
            key={article.id}
            to={`/blog/${article.slug}`}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            {article.featured_image && (
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-bold text-slate-800 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                {article.reading_time && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{article.reading_time} min read</span>
                  </div>
                )}
                <span className="flex items-center gap-1 text-yellow-600 font-semibold group-hover:gap-2 transition-all">
                  Read more <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
