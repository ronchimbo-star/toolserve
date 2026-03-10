import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import BlogArticleTemplate from '../components/blog/BlogArticleTemplate';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
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

        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);

        setRelatedPosts(related || []);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
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

  const parseFAQs = (content: string) => {
    const faqPattern = /Q:\s*(.+?)\s*A:\s*(.+?)(?=Q:|$)/gs;
    const matches = [...content.matchAll(faqPattern)];
    return matches.map(match => ({
      question: match[1].trim(),
      answer: match[2].trim()
    }));
  };

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

      <BlogArticleTemplate
        article={{
          title: post.title,
          excerpt: post.excerpt || undefined,
          content: post.content || '',
          featured_image: post.featured_image_url || undefined,
          category: post.category || undefined,
          published_at: post.published_at || post.created_at,
          reading_time: post.reading_time || undefined,
          author: post.author || 'ToolServe Team',
          faqs: parseFAQs(post.faqs),
          related_articles: relatedPosts
        }}
        onShare={handleShare}
      />
    </div>
  );
}
