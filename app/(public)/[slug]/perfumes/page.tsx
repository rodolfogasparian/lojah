import { redirect } from "next/navigation";

export default async function PerfumesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}?categoria=PERFUMES_AGRUPADOS`);
}
