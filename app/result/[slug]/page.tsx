import { notFound } from "next/navigation";
import { getTest, getAllTests } from "@/tests/_registry";
import { AuthGuard } from "@/components/auth/AuthGuard";
import ResultPageClient from "./ResultPageClient";

export function generateStaticParams() {
  return getAllTests().map((t) => ({ slug: t.slug }));
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return notFound();

  return (
    <AuthGuard>
      <ResultPageClient slug={slug} />
    </AuthGuard>
  );
}
