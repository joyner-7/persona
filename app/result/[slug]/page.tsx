import { notFound } from "next/navigation";
import { getTest, getAllTests } from "@/tests/_registry";
import ResultPageClient from "./ResultPageClient";

export function generateStaticParams() {
  return getAllTests().map((t) => ({ slug: t.slug }));
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return notFound();

  return <ResultPageClient slug={slug} />;
}
