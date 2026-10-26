import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StaticPageView, { staticPageMetadata } from '@/components/pages/static-page';
import { isLocale } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return staticPageMetadata('privacy-policy', lang);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <StaticPageView slug='privacy-policy' locale={lang} />;
}
