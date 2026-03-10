import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

export function SEO({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = 'https://toolserve.co.uk/og-image.jpg',
  ogType = 'website',
  schema
}: SEOProps) {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGAId() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('google_analytics_id')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data?.google_analytics_id) {
          setGaId(data.google_analytics_id);
        }
      } catch (error) {
        console.error('Error fetching GA ID:', error);
      }
    }

    fetchGAId();
  }, []);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content="ToolServe" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {gaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </script>
        </>
      )}

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
}
