import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArchivePage, { archiveMetadata } from '@/components/pages/archive-page';
import { isLocale, type ContentType } from '@/config/site';

const type: ContentType = 'alternatives';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return archiveMetadata(type, lang);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ArchivePage type={type} locale={lang} />;
}
