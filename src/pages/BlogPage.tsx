import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { StructuredData } from '../components/StructuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Sustainability', 'Case Studies', 'DIY Tips', 'News'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="Blog | Tool Repair Tips & Sustainability | ToolServe"
        description="Tool repair tips, maintenance guides and sustainability insights from ToolServe. Learn how to extend tool life and reduce waste."
        canonical="https://toolserve.co.uk/blog"
      />
      <StructuredData type="Breadcrumb" items={[
        { name: 'Home', url: 'https://toolserve.co.uk/' },
        { name: 'Blog', url: 'https://toolserve.co.uk/blog' }
      ]} />
      <Breadcrumb items={[
        { name: 'Home', path: '/' },
        { name: 'Blog' }
      ]} />
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Blog & Resources</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Sustainability insights, repair tips, case studies, and news from ToolServe
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-slate-600">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-xl text-slate-600 mb-6">
                No blog posts available yet. Check back soon for sustainability tips, case studies, and more!
              </p>
              <Link to="/">
                <Button>Return Home</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featured_image_url && (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      width="400"
                      height="192"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Published: {formatDate(post.published_at)}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1" />
                        By ToolServe Team
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="text-emerald-600 font-medium flex items-center hover:text-emerald-700 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
