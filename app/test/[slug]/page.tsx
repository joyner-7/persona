import { notFound } from "next/navigation";
import { getTest, getAllTests } from "@/tests/_registry";
import { TestController } from "@/components/test/TestController";

export function generateStaticParams() {
  return getAllTests().map((t) => ({ slug: t.slug }));
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) return notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">{test.name}</h1>
        </div>
      </header>
      <TestController slug={slug} />
    </div>
  );
}
