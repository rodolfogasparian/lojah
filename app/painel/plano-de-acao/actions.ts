"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionItemCategory, ActionItemStatus } from "@prisma/client";

async function getSellerProfile() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado");
  const profile = await db.sellerProfile.findUnique({
    where: { user_id: session.user.id },
    select: { id: true, company_id: true },
  });
  if (!profile) throw new Error("Perfil não encontrado");
  return profile;
}

// Parse YYYY-MM-DD to UTC midnight Date to avoid timezone off-by-one
function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

async function ensurePlan(sellerId: string, companyId: string, weekStartIso: string) {
  const weekStart = parseDate(weekStartIso);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  const monthRef = `${weekStart.getUTCFullYear()}-${String(weekStart.getUTCMonth() + 1).padStart(2, "0")}`;

  return db.actionPlan.upsert({
    where: { seller_id_week_start: { seller_id: sellerId, week_start: weekStart } },
    create: {
      seller_id: sellerId,
      company_id: companyId,
      week_start: weekStart,
      week_end: weekEnd,
      month_reference: monthRef,
    },
    update: {},
    select: { id: true, seller_id: true },
  });
}

export async function saveItem(data: {
  id?: string;
  weekStart: string;
  category: ActionItemCategory;
  action_text: string;
  desired_result?: string;
  actual_result?: string;
  status: ActionItemStatus;
}): Promise<{ id: string }> {
  const profile = await getSellerProfile();

  if (data.id) {
    const existing = await db.actionPlanItem.findUnique({
      where: { id: data.id },
      include: { plan: { select: { seller_id: true } } },
    });
    if (!existing || existing.plan.seller_id !== profile.id) throw new Error("Acesso negado");

    await db.actionPlanItem.update({
      where: { id: data.id },
      data: {
        category: data.category,
        action_text: data.action_text,
        desired_result: data.desired_result ?? null,
        actual_result: data.actual_result ?? null,
        status: data.status,
      },
    });
    revalidatePath("/painel/plano-de-acao/meu");
    return { id: data.id };
  }

  const plan = await ensurePlan(profile.id, profile.company_id, data.weekStart);
  const count = await db.actionPlanItem.count({ where: { plan_id: plan.id } });

  const item = await db.actionPlanItem.create({
    data: {
      plan_id: plan.id,
      category: data.category,
      action_text: data.action_text,
      desired_result: data.desired_result ?? null,
      actual_result: data.actual_result ?? null,
      status: data.status,
      sort_order: count,
    },
    select: { id: true },
  });

  revalidatePath("/painel/plano-de-acao/meu");
  return { id: item.id };
}

export async function deleteItem(itemId: string): Promise<void> {
  const profile = await getSellerProfile();

  const item = await db.actionPlanItem.findUnique({
    where: { id: itemId },
    include: { plan: { select: { seller_id: true } } },
  });
  if (!item || item.plan.seller_id !== profile.id) throw new Error("Acesso negado");

  await db.actionPlanItem.delete({ where: { id: itemId } });
  revalidatePath("/painel/plano-de-acao/meu");
}

export async function saveGoal(data: {
  id?: string;
  weekStart: string;
  label: string;
  target_value: string;
  actual_value?: string;
}): Promise<{ id: string }> {
  const profile = await getSellerProfile();

  if (data.id) {
    const existing = await db.actionPlanGoal.findUnique({
      where: { id: data.id },
      include: { plan: { select: { seller_id: true } } },
    });
    if (!existing || existing.plan.seller_id !== profile.id) throw new Error("Acesso negado");

    await db.actionPlanGoal.update({
      where: { id: data.id },
      data: {
        label: data.label,
        target_value: data.target_value,
        actual_value: data.actual_value ?? null,
      },
    });
    revalidatePath("/painel/plano-de-acao/meu");
    return { id: data.id };
  }

  const plan = await ensurePlan(profile.id, profile.company_id, data.weekStart);
  const count = await db.actionPlanGoal.count({ where: { plan_id: plan.id } });

  const goal = await db.actionPlanGoal.create({
    data: {
      plan_id: plan.id,
      label: data.label,
      target_value: data.target_value,
      actual_value: data.actual_value ?? null,
      sort_order: count,
    },
    select: { id: true },
  });

  revalidatePath("/painel/plano-de-acao/meu");
  return { id: goal.id };
}

export async function deleteGoal(goalId: string): Promise<void> {
  const profile = await getSellerProfile();

  const goal = await db.actionPlanGoal.findUnique({
    where: { id: goalId },
    include: { plan: { select: { seller_id: true } } },
  });
  if (!goal || goal.plan.seller_id !== profile.id) throw new Error("Acesso negado");

  await db.actionPlanGoal.delete({ where: { id: goalId } });
  revalidatePath("/painel/plano-de-acao/meu");
}

export async function submitPlan(planId: string): Promise<void> {
  const profile = await getSellerProfile();

  const plan = await db.actionPlan.findUnique({
    where: { id: planId },
    select: { seller_id: true, status: true },
  });
  if (!plan || plan.seller_id !== profile.id) throw new Error("Acesso negado");
  if (plan.status === "SUBMITTED") return;

  await db.actionPlan.update({
    where: { id: planId },
    data: { status: "SUBMITTED", submitted_at: new Date() },
  });

  revalidatePath("/painel/plano-de-acao/meu");
}

// ─── Mentoria ───────────────────────────────────────────────────────────────

export async function acceptInvite(mentorSlug: string): Promise<void> {
  const profile = await getSellerProfile();

  const mentor = await db.sellerProfile.findFirst({
    where: { slug: mentorSlug, company_id: profile.company_id, active: true },
    select: { id: true },
  });
  if (!mentor) throw new Error("Orientador não encontrado");
  if (mentor.id === profile.id) throw new Error("Você não pode ser seu próprio orientado");

  const existing = await db.mentorship.findUnique({
    where: { mentor_id_mentee_id: { mentor_id: mentor.id, mentee_id: profile.id } },
  });

  if (existing?.status === "ACTIVE") {
    // já vinculado — só redireciona
  } else if (existing) {
    await db.mentorship.update({
      where: { id: existing.id },
      data: { status: "ACTIVE" },
    });
  } else {
    await db.mentorship.create({
      data: { mentor_id: mentor.id, mentee_id: profile.id, company_id: profile.company_id },
    });
  }

  revalidatePath("/painel/plano-de-acao/orientados");
  revalidatePath("/painel/plano-de-acao/convite");
  redirect("/painel/plano-de-acao/meu");
}

// ─── ShareLink ──────────────────────────────────────────────────────────────

export async function createShareLink(
  weekStart: string
): Promise<{ id: string; token: string }> {
  const profile = await getSellerProfile();
  const plan = await ensurePlan(profile.id, profile.company_id, weekStart);

  const now = new Date();
  const existing = await db.shareLink.findFirst({
    where: {
      plan_id: plan.id,
      revoked: false,
      OR: [{ expires_at: null }, { expires_at: { gt: now } }],
    },
    select: { id: true, token: true },
  });
  if (existing) return existing;

  const token = randomUUID().replace(/-/g, "");
  const link = await db.shareLink.create({
    data: { plan_id: plan.id, token },
    select: { id: true, token: true },
  });
  return link;
}

export async function revokeShareLink(linkId: string): Promise<void> {
  const profile = await getSellerProfile();

  const link = await db.shareLink.findUnique({
    where: { id: linkId },
    include: { plan: { select: { seller_id: true } } },
  });
  if (!link || link.plan.seller_id !== profile.id) throw new Error("Acesso negado");

  await db.shareLink.update({ where: { id: linkId }, data: { revoked: true } });
  revalidatePath("/painel/plano-de-acao/meu");
}

export async function removeMentorship(mentorshipId: string): Promise<void> {
  const profile = await getSellerProfile();

  const ms = await db.mentorship.findUnique({ where: { id: mentorshipId } });
  if (!ms || ms.status === "REMOVED") return;
  if (ms.mentor_id !== profile.id && ms.mentee_id !== profile.id) {
    throw new Error("Acesso negado");
  }

  await db.mentorship.update({
    where: { id: mentorshipId },
    data: { status: "REMOVED" },
  });

  revalidatePath("/painel/plano-de-acao/orientados");
  revalidatePath("/painel/plano-de-acao/convite");
}
