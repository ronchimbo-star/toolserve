import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      // Try to find by slug first, fall back to id
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true);

      // Check if slug looks like a UUID (for backward compatibility)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || '');

      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      setPost(data);

      if (data) {
        await supabase
          .from('blog_posts')
          .update({ view_count: data.view_count + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.excerpt || '';

    if (!platform && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Share cancelled');
      }
      return;
    }

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-slate-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Post Not Found</h1>
          <p className="text-slate-600 mb-6">This blog post doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {post && (
        <>
          <SEO
            title={`${post.title} | ToolServe`}
            description={post.excerpt?.substring(0, 155) || post.content?.substring(0, 155) || 'Read more on ToolServe blog'}
            canonical={`https://toolserve.co.uk/blog/${slug}`}
          />
          <StructuredData
            type="BlogPost"
            title={post.title}
            datePublished={post.created_at}
            slug={slug || ''}
          />
          <StructuredData type="Breadcrumb" items={[
            { name: 'Home', url: 'https://toolserve.co.uk/' },
            { name: 'Blog', url: 'https://toolserve.co.uk/blog' },
            { name: post.title, url: `https://toolserve.co.uk/blog/${slug}` }
          ]} />
        </>
      )}
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post?.title || 'Post' }
      ]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/blog"
          className="flex items-center text-orange-600 hover:text-orange-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-96 object-cover"
              loading="lazy"
              width="800"
              height="384"
            />
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.published_at)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-strong:font-semibold prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-slate-700 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-slate-800 prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-img:rounded-lg prose-img:shadow-md">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Need Tool Repair or Servicing?</h3>
                <p className="text-slate-600 mb-6">
                  Don't let broken equipment slow you down. Our expert technicians are ready to help restore your tools to peak performance. Check out our <Link to="/services" className="text-orange-600 hover:text-orange-700 underline">services</Link> or view our <Link to="/faq" className="text-orange-600 hover:text-orange-700 underline">frequently asked questions</Link>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/repair-request">
                    <Button size="lg">Get a Free Quote</Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline">Contact Us</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Share this article</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </button>
                  {navigator.share && (
                    <button
                      onClick={() => handleShare()}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  {post.view_count} views
                </div>
                <Link to="/repair-request">
                  <Button>Get a Free Quote</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
