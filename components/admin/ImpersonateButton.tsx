"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function ImpersonateButton({ sellerId }: { sellerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleImpersonate() {
    setLoading(true);
    const res = await fetch("/api/admin/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/painel?impersonate=${data.token}`);
    }
    setLoading(false);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
      onClick={handleImpersonate}
      disabled={loading}
    >
      <Eye className="size-3 mr-1" />
      {loading ? "..." : "Acessar"}
    </Button>
  );
}
