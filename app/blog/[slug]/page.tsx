import { Metadata } from 'next';
import { BlogPostContent } from './BlogPostContent';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${BACKEND_URL}/api/v1/community/blog/${params.slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'Post Not Found | Guestly',
      };
    }

    const post = await response.json();

    return {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      keywords: post.seo_keywords?.join(', '),
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        images: post.cover_image ? [post.cover_image] : [],
        type: 'article',
        publishedTime: post.published_at,
        authors: [post.author_name],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        images: post.cover_image ? [post.cover_image] : [],
      },
      alternates: {
        canonical: post.canonical_url || `https://guestly.com/blog/${params.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Blog | Guestly',
    };
  }
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostContent slug={params.slug} />;
}
