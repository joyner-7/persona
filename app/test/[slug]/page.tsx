import { notFound } from "next/navigation";
import { getTest, getAllTests } from "@/tests/_registry";
import { TestController } from "@/components/test/TestController";
import { ui } from "@/lib/ui";
import { cn } from "@/lib/utils";

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
    <div className={cn(ui.page, "flex flex-col")}>
      <header className={cn(ui.container, "border-b border-divider py-6")}>
        <h1 className={cn(ui.h3, "text-center sm:text-left")}>{test.name}</h1>
      </header>
      <TestController slug={slug} />
    </div>
  );
}
