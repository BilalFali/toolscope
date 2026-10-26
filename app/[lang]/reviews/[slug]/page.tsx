import type { Metadata } from 'next';
import { articleStaticParams, articleMetadataFor, renderArticle } from '@/lib/article-route';
import type { ContentType } from '@/config/site';

const type: ContentType = 'reviews';

export async function generateStaticParams() {
  return articleStaticParams(type);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  return articleMetadataFor(type, lang, slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return renderArticle(type, lang, slug);
}
