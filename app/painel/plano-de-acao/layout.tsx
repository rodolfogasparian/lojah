import { PlanoDeAcaoNav } from "@/components/action-plan/PlanoDeAcaoNav";

export default function PlanoDeAcaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PlanoDeAcaoNav />
      {children}
    </div>
  );
}
