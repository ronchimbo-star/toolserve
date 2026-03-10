import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';
import ReadingProgress from './ReadingProgress';
import TableOfContents from './TableOfContents';
import InfoBox from './InfoBox';
import FAQAccordion from './FAQAccordion';
import CTABlock from './CTABlock';
import AdSlot from './AdSlot';
import RelatedArticles from './RelatedArticles';
import NewsletterSignup from './NewsletterSignup';

interface BlogArticle {
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category?: string;
  published_at: string;
  reading_time?: number;
  author?: string;
  author_image?: string;
  faqs?: Array<{ question: string; answer: string }>;
  related_articles?: any[];
}

interface BlogArticleTemplateProps {
  article: BlogArticle;
  onShare?: (platform?: string) => void;
}

const BlogArticleTemplate: React.FC<BlogArticleTemplateProps> = ({ article, onShare }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const contentElement = document.getElementById('blog-content');
    if (!contentElement) return;

    const headingElements = contentElement.querySelectorAll('h2, h3');
    const tocItems = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });

    setHeadings(tocItems);
  }, [article.content]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const parseContent = (content: string) => {
    const sections = content.split('\n\n');
    const totalSections = sections.length;
    const adPosition1 = Math.floor(totalSections * 0.33);
    const adPosition2 = Math.floor(totalSections * 0.66);

    return sections.map((section, index) => {
      let element = (
        <div key={index} className="mb-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {section}
        </div>
      );

      if (index === adPosition1) {
        return (
          <React.Fragment key={index}>
            {element}
            <AdSlot position="middle" />
            {index === Math.floor(totalSections * 0.4) && <CTABlock variant="inline" />}
          </React.Fragment>
        );
      }

      if (index === adPosition2) {
        return (
          <React.Fragment key={index}>
            {element}
            <AdSlot position="bottom" />
          </React.Fragment>
        );
      }

      return element;
    });
  };

  const shareButtons = [
    { platform: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { platform: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
    { platform: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
    { platform: 'email', label: 'Email', icon: Mail, color: 'bg-slate-600 hover:bg-slate-700' }
  ];

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen bg-gray-50">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {article.featured_image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <TableOfContents headings={headings} isMobile={false} />
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="lg:hidden mb-6">
                <TableOfContents headings={headings} isMobile={true} />
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  {article.category && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      {article.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDate(article.published_at)}
                  </span>
                  {article.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {article.reading_time} min read
                    </span>
                  )}
                  {article.author && (
                    <span className="flex items-center gap-2">
                      {article.author_image ? (
                        <img
                          src={article.author_image}
                          alt={article.author}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User size={16} />
                      )}
                      By {article.author}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-yellow-500 pl-6 italic">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
                  {shareButtons.map(({ platform, label, icon: Icon, color }) => (
                    <button
                      key={platform}
                      onClick={() => onShare?.(platform)}
                      className={`flex items-center gap-2 px-4 py-2 ${color} text-white rounded-lg transition-colors text-sm font-medium`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                  {navigator.share && (
                    <button
                      onClick={() => onShare?.()}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  )}
                </div>

                <div id="blog-content" className="prose prose-lg max-w-none">
                  {parseContent(article.content)}
                </div>

                {article.faqs && article.faqs.length > 0 && (
                  <FAQAccordion faqs={article.faqs} allowMultiple={false} />
                )}

                <CTABlock variant="primary" />

                <NewsletterSignup />

                {article.related_articles && article.related_articles.length > 0 && (
                  <RelatedArticles articles={article.related_articles} />
                )}

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Share this article</h3>
                  <div className="flex flex-wrap gap-3">
                    {shareButtons.map(({ platform, label, icon: Icon, color }) => (
                      <button
                        key={platform}
                        onClick={() => onShare?.(platform)}
                        className={`flex items-center gap-2 px-4 py-2 ${color} text-white rounded-lg transition-colors`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogArticleTemplate;
