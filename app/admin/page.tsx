import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Users, CheckCircle, Clock, XCircle, Tag, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user?.companyId) redirect("/login");

  const companyId = session.user.companyId;

  const [
    totalVendedores,
    ativos,
    pendentes,
    suspensos,
    cuponsDisponiveis,
    cuponsUsados,
    assinaturasAtivas,
  ] = await Promise.all([
    db.sellerProfile.count({ where: { company_id: companyId } }),
    db.sellerProfile.count({ where: { company_id: companyId, status: "ACTIVE" } }),
    db.sellerProfile.count({ where: { company_id: companyId, status: "PENDING" } }),
    db.sellerProfile.count({ where: { company_id: companyId, status: "SUSPENDED" } }),
    db.coupon.count({ where: { pack: { company_id: companyId }, used_by: null } }),
    db.coupon.count({ where: { pack: { company_id: companyId }, used_by: { not: null } } }),
    db.subscription.count({
      where: { seller: { company_id: companyId }, status: "ACTIVE" },
    }),
  ]);

  const stats = [
    {
      title: "Total de Vendedores",
      value: totalVendedores,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      sub: `${ativos} ativos`,
    },
    {
      title: "Pendentes de Ativação",
      value: pendentes,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      sub: "aguardando aprovação",
    },
    {
      title: "Contas Suspensas",
      value: suspensos,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      sub: "inativas",
    },
    {
      title: "Cupons Disponíveis",
      value: cuponsDisponiveis,
      icon: Tag,
      color: "text-green-600",
      bg: "bg-green-50",
      sub: `${cuponsUsados} utilizados`,
    },
    {
      title: "Assinaturas Ativas",
      value: assinaturasAtivas,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
      sub: "em dia",
    },
    {
      title: "Ativações Realizadas",
      value: cuponsUsados,
      icon: CheckCircle,
      color: "text-teal-600",
      bg: "bg-teal-50",
      sub: "cupons resgatados",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral da sua empresa na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ title, value, icon: Icon, color, bg, sub }) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {title}
                </CardTitle>
                <div className={`p-1.5 rounded-lg ${bg}`}>
                  <Icon className={`size-4 ${color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
