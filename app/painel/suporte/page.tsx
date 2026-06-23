import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportTicketForm } from "@/components/seller/SupportTicketForm";

export default async function SuporteVendedorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true, company_id: true },
  });

  if (!profile) redirect("/painel/perfil");

  const tickets = await db.supportTicket.findMany({
    where: { seller_id: profile.id },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Suporte</h1>
        <p className="text-sm text-muted-foreground">Abra um chamado e nossa equipe te responde em breve.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo chamado</CardTitle>
        </CardHeader>
        <CardContent>
          <SupportTicketForm sellerId={profile.id} companyId={profile.company_id} />
        </CardContent>
      </Card>

      {tickets.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Seus chamados</h2>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{ticket.subject}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  ticket.status === "OPEN" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                }`}>
                  {ticket.status === "OPEN" ? "Aberto" : "Resolvido"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{ticket.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
