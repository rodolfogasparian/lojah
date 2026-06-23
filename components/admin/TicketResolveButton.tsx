"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function TicketResolveButton({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleResolve() {
    setLoading(true);
    await fetch(`/api/suporte/${ticketId}`, { method: "PATCH" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50 shrink-0"
      onClick={handleResolve}
      disabled={loading}
    >
      <CheckCircle className="size-3 mr-1" />
      {loading ? "..." : "Resolver"}
    </Button>
  );
}
