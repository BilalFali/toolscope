import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPage, { categoryMetadata } from '@/components/pages/category-page';
import { isLocale, type CategoryKey } from '@/config/site';

const categoryKey: CategoryKey = 'developer-tools';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return categoryMetadata(categoryKey, lang);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <CategoryPage categoryKey={categoryKey} locale={lang} />;
}
