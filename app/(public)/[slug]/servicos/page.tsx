import { redirect } from "next/navigation";

export default async function ServicosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/${slug}?categoria=ATL+Services`);
}
