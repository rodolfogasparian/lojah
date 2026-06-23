import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TicketResolveButton } from "@/components/admin/TicketResolveButton";

export default async function AdminSuportePage() {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");

  const tickets = await db.supportTicket.findMany({
    where: { company_id: session.user.companyId },
    include: { seller: { select: { name: true, slug: true } } },
    orderBy: { created_at: "desc" },
  });

  const abertos = tickets.filter(t => t.status === "OPEN");
  const resolvidos = tickets.filter(t => t.status === "RESOLVED");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Suporte</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {abertos.length} aberto(s) · {resolvidos.length} resolvido(s)
        </p>
      </div>

      {abertos.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wide">⚠️ Abertos</h2>
          {abertos.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-amber-200 p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ticket.seller.name} · {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <TicketResolveButton ticketId={ticket.id} />
              </div>
              <p className="text-sm text-muted-foreground">{ticket.message}</p>
            </div>
          ))}
        </div>
      )}

      {resolvidos.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-green-600 uppercase tracking-wide">✅ Resolvidos</h2>
          {resolvidos.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-green-100 p-4 flex flex-col gap-2 opacity-70">
              <p className="text-sm font-bold">{ticket.subject}</p>
              <p className="text-xs text-muted-foreground">
                {ticket.seller.name} · {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">{ticket.message}</p>
            </div>
          ))}
        </div>
      )}

      {tickets.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-xl border">
          Nenhum chamado de suporte ainda.
        </div>
      )}
    </div>
  );
}
