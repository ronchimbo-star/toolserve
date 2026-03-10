import { Helmet } from 'react-helmet-async';

interface LocalBusinessProps {
  type: 'LocalBusiness';
}

interface ServiceProps {
  type: 'Service';
}

interface FAQProps {
  type: 'FAQ';
  faqs: Array<{ question: string; answer: string }>;
}

interface BlogPostProps {
  type: 'BlogPost';
  title: string;
  datePublished: string;
  slug: string;
}

interface BreadcrumbProps {
  type: 'Breadcrumb';
  items: Array<{ name: string; url: string }>;
}

type StructuredDataProps = LocalBusinessProps | ServiceProps | FAQProps | BlogPostProps | BreadcrumbProps;

export function StructuredData(props: StructuredDataProps) {
  let structuredData: any;

  switch (props.type) {
    case 'LocalBusiness':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'ToolServe',
        description: 'Professional tool and appliance repair services across the UK.',
        url: 'https://toolserve.co.uk',
        telephone: '+441322879713',
        email: 'info@toolserve.co.uk',
        image: 'https://toolserve.co.uk/og-image.jpg',
        priceRange: '££',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '56 Craydene Road',
          addressLocality: 'Erith',
          addressRegion: 'Kent',
          postalCode: 'DA8 2HA',
          addressCountry: 'GB'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 51.4816,
          longitude: 0.1730
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00'
          }
        ]
      };
      break;

    case 'Service':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Tool Repair',
        provider: { '@type': 'LocalBusiness', name: 'ToolServe' },
        areaServed: { '@type': 'Country', name: 'United Kingdom' },
        description: 'Professional repair for power tools, garden equipment, hand tools, tradesperson equipment, small appliances, and industrial equipment.'
      };
      break;

    case 'FAQ':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };
      break;

    case 'BlogPost':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: props.title,
        datePublished: props.datePublished,
        author: { '@type': 'Organization', name: 'ToolServe' },
        publisher: { '@type': 'Organization', name: 'ToolServe' },
        mainEntityOfPage: `https://toolserve.co.uk/blog/${props.slug}`
      };
      break;

    case 'Breadcrumb':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };
      break;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
