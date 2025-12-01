// =============================================================
// FILE: src/pages/admin/support/[slug].tsx
// Ensotek – Admin Support Ticket Detail Page
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { SupportForm, type SupportFormValues } from "@/components/admin/support/SupportForm";

import {
  useGetSupportTicketAdminQuery,
  useUpdateSupportTicketAdminMutation,
  useDeleteSupportTicketAdminMutation,
  useToggleSupportTicketAdminMutation,
  useListTicketRepliesAdminQuery,
  useCreateTicketReplyAdminMutation,
  useDeleteTicketReplyAdminMutation,
} from "@/integrations/rtk/endpoints/admin/support_admin.endpoints";

import { useCreateSupportTicketMutation } from "@/integrations/rtk/endpoints/support.endpoints";

import type {
  AdminSupportTicketDto,
  TicketReplyDto,
  SupportTicketCreatePayload,
  SupportTicketUpdatePayload,
} from "@/integrations/types/support.types";

const AdminSupportDetailPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const ticketId = useMemo(
    () => (typeof slug === "string" ? slug : undefined),
    [slug],
  );
  const isCreate = ticketId === "new";

  // CREATE mutation (public endpoint)
  const [createTicket, { isLoading: isCreating }] =
    useCreateSupportTicketMutation();

  // ADMIN ticket fetch/update/delete/toggle
  const {
    data: ticket,
    isLoading: isLoadingTicket,
    isFetching: isFetchingTicket,
    refetch: refetchTicket,
  } = useGetSupportTicketAdminQuery(
    { id: ticketId as string },
    { skip: !ticketId || isCreate },
  );

  const [updateTicket, { isLoading: isUpdating }] =
    useUpdateSupportTicketAdminMutation();
  const [deleteTicket, { isLoading: isDeleting }] =
    useDeleteSupportTicketAdminMutation();
  const [toggleTicketStatus, { isLoading: isToggling }] =
    useToggleSupportTicketAdminMutation();

  // Replies (admin endpoints)
  const {
    data: replies,
    isLoading: isLoadingReplies,
    isFetching: isFetchingReplies,
    refetch: refetchReplies,
  } = useListTicketRepliesAdminQuery(
    { ticketId: ticketId as string },
    { skip: !ticketId || isCreate },
  );

  const [createReply, { isLoading: isCreatingReply }] =
    useCreateTicketReplyAdminMutation();
  const [deleteReply, { isLoading: isDeletingReply }] =
    useDeleteTicketReplyAdminMutation();

  const [replyText, setReplyText] = useState("");

  const loadingTicket = isLoadingTicket || isFetchingTicket;
  const loadingReplies = isLoadingReplies || isFetchingReplies;
  const busy =
    loadingTicket ||
    isUpdating ||
    isDeleting ||
    isToggling ||
    isCreating ||
    isCreatingReply ||
    isDeletingReply;

  useEffect(() => {
    if (!router.isReady) return;
    if (!ticketId) return;
  }, [router.isReady, ticketId]);

  const handleSubmit = async (values: SupportFormValues) => {
    try {
      if (isCreate) {
        const payload: SupportTicketCreatePayload = {
          user_id: values.user_id,
          subject: values.subject,
          message: values.message,
          priority: values.priority,
        };
        const created = await createTicket(payload).unwrap();
        toast.success("Destek talebi oluşturuldu.");
        router.replace(`/admin/support/${encodeURIComponent(created.id)}`);
        return;
      }

      if (!ticketId) return;

      const patch: SupportTicketUpdatePayload = {
        subject: values.subject,
        message: values.message,
        status: values.status,
        priority: values.priority,
      };

      await updateTicket({ id: ticketId, patch }).unwrap();
      toast.success("Değişiklikler kaydedildi.");
      await refetchTicket();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Kayıt işlemi sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!ticketId || isCreate) return;
    if (!confirm("Bu destek talebini silmek istediğine emin misin?")) {
      return;
    }
    try {
      await deleteTicket({ id: ticketId }).unwrap();
      toast.success("Destek talebi silindi.");
      router.push("/admin/support");
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Talep silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleToggleStatus = async () => {
    if (!ticket || !ticketId) return;
    try {
      const action = ticket.status === "closed" ? "reopen" : "close";
      await toggleTicketStatus({ id: ticketId, action }).unwrap();
      toast.success(
        action === "close" ? "Talep kapatıldı." : "Talep tekrar açıldı.",
      );
      await refetchTicket();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Durum güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !replyText.trim()) return;
    try {
      await createReply({
        ticket_id: ticketId,
        user_id: ticket?.user_id ?? null,
        message: replyText.trim(),
      }).unwrap();
      setReplyText("");
      toast.success("Yanıt oluşturuldu.");
      await Promise.all([refetchReplies(), refetchTicket()]);
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yanıt oluşturulurken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDeleteReply = async (reply: TicketReplyDto) => {
    if (!confirm("Bu yanıtı silmek istediğine emin misin?")) {
      return;
    }
    try {
      await deleteReply({ id: reply.id }).unwrap();
      toast.success("Yanıt silindi.");
      await refetchReplies();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Yanıt silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const initialData: AdminSupportTicketDto | undefined = isCreate
    ? undefined
    : (ticket as AdminSupportTicketDto | undefined);

  const repliesList: TicketReplyDto[] = replies ?? [];

  return (
    <div className="container-fluid py-3">
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-link btn-sm px-0"
          onClick={() => router.push("/admin/support")}
        >
          ← Destek listesine dön
        </button>
      </div>

      <SupportForm
        mode={isCreate ? "create" : "edit"}
        initialData={initialData}
        loading={loadingTicket}
        saving={busy}
        onSubmit={handleSubmit}
        onDelete={isCreate ? undefined : handleDelete}
        onToggleStatus={isCreate ? undefined : handleToggleStatus}
      />

      {/* Replies */}
      {!isCreate && (
        <div className="row mt-3">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header py-2 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="mb-0 small fw-semibold">
                    Yanıtlar (Admin / Kullanıcı Mesajları)
                  </h6>
                  <div className="text-muted small">
                    Bu ticket için tüm mesaj geçmişi.
                  </div>
                </div>
              </div>
              <div className="card-body">
                {loadingReplies && (
                  <div className="text-muted small mb-2">
                    Yükleniyor...
                  </div>
                )}

                {!loadingReplies && repliesList.length === 0 && (
                  <div className="text-muted small mb-2">
                    Henüz yanıt yok.
                  </div>
                )}

                <div className="vstack gap-3 mb-3">
                  {repliesList.map((r) => (
                    <div
                      key={r.id}
                      className="border rounded-2 p-2 small d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <div className="mb-1">
                          {r.is_admin ? (
                            <span className="badge bg-primary-subtle text-primary me-1">
                              Admin
                            </span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-muted me-1">
                              Kullanıcı
                            </span>
                          )}
                          <span className="text-muted">
                            {r.created_at
                              ? new Date(
                                  r.created_at,
                                ).toLocaleString("tr-TR")
                              : "-"}
                          </span>
                        </div>
                        <div className="text-body">{r.message}</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => handleDeleteReply(r)}
                        disabled={busy}
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCreateReply}>
                  <div className="mb-2">
                    <label className="form-label small mb-1">
                      Yeni Admin Yanıtı
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={busy}
                      placeholder="Müşteriye gönderilecek admin yanıtını yaz..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={busy || !replyText.trim()}
                  >
                    {isCreatingReply ? "Gönderiliyor..." : "Yanıt Gönder"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sağ tarafta küçük özet blok istersen buraya ekleyebilirsin */}
        </div>
      )}
    </div>
  );
};

export default AdminSupportDetailPage;
