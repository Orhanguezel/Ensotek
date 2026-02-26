'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/support/_components/admin-support-client.tsx
// Admin Support Tickets — list + detail dialog + replies thread
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import { RefreshCcw, Search, Trash2, Eye, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import type {
  SupportTicketView,
  SupportTicketStatus,
  SupportTicketPriority,
  SupportTicketUpdatePayload,
  TicketReplyView,
} from '@/integrations/shared';
import {
  useListSupportTicketsAdminQuery,
  useUpdateSupportTicketAdminMutation,
  useDeleteSupportTicketAdminMutation,
  useListRepliesAdminQuery,
  useCreateReplyAdminMutation,
  useDeleteReplyAdminMutation,
} from '@/integrations/hooks';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

const LIMIT = 20;

function fmtDate(v: unknown): string {
  if (!v) return '';
  const s = typeof v === 'string' ? v : String(v);
  return s.slice(0, 10);
}

function fmtDateTime(v: unknown): string {
  if (!v) return '';
  const s = typeof v === 'string' ? v : String(v);
  return s.slice(0, 16).replace('T', ' ');
}

// -------------------------------------------------------
// Types
// -------------------------------------------------------

type Filters = {
  q: string;
  status: '' | SupportTicketStatus;
  priority: '' | SupportTicketPriority;
  sort: 'created_at' | 'updated_at';
  order: 'asc' | 'desc';
  onlyOpen: boolean;
};

type EditState = {
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
};

// -------------------------------------------------------
// Sub-component: RepliesThread
// -------------------------------------------------------

function RepliesThread({
  ticketId,
  t,
}: {
  ticketId: string;
  t: ReturnType<typeof useAdminT>;
}) {
  const repliesQ = useListRepliesAdminQuery(ticketId, { refetchOnMountOrArgChange: true });
  const [deleteReply, deleteReplyState] = useDeleteReplyAdminMutation();
  const replies: TicketReplyView[] = Array.isArray(repliesQ.data) ? repliesQ.data : [];

  async function onDeleteReply(reply: TicketReplyView) {
    if (!window.confirm(`${t('viewDialog.deleteReply')}?`)) return;
    try {
      await deleteReply({ id: reply.id, ticket_id: ticketId }).unwrap();
      toast.success(t('messages.replyDeleted'));
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.replyDeleteError'));
    }
  }

  if (repliesQ.isLoading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        {t('admin.common.loading')}
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        {t('viewDialog.noReplies')}
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {replies.map((reply) => (
        <div
          key={reply.id}
          className={`flex ${reply.is_admin ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`group relative max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              reply.is_admin
                ? 'bg-primary/10 text-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={reply.is_admin ? 'default' : 'secondary'} className="text-xs px-1.5 py-0">
                {reply.is_admin ? t('viewDialog.adminBadge') : t('viewDialog.userBadge')}
              </Badge>
              <span className="text-xs text-muted-foreground">{fmtDateTime(reply.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap break-words">{reply.message}</p>
            {reply.is_admin && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 hidden size-6 group-hover:flex items-center justify-center rounded-full bg-background border shadow-sm"
                onClick={() => onDeleteReply(reply)}
                disabled={deleteReplyState.isLoading}
              >
                <Trash2 className="size-3 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------
// Main Component
// -------------------------------------------------------

export default function AdminSupportClient() {
  const t = useAdminT('admin.support');

  const [filters, setFilters] = React.useState<Filters>({
    q: '',
    status: '',
    priority: '',
    sort: 'created_at',
    order: 'desc',
    onlyOpen: false,
  });
  const [offset, setOffset] = React.useState(0);

  const listParams = React.useMemo(
    () => ({
      q: filters.q.trim() || undefined,
      status: (filters.onlyOpen ? 'open' : filters.status || undefined) as SupportTicketStatus | undefined,
      priority: filters.priority || undefined,
      sort: filters.sort,
      order: filters.order,
      limit: LIMIT,
      offset,
    }),
    [filters, offset],
  );

  const listQ = useListSupportTicketsAdminQuery(listParams, { refetchOnMountOrArgChange: true });

  const tickets: SupportTicketView[] = listQ.data?.data ?? [];
  const total: number = listQ.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const [updateTicket, updateState] = useUpdateSupportTicketAdminMutation();
  const [deleteTicket, deleteState] = useDeleteSupportTicketAdminMutation();
  const [createReply, createReplyState] = useCreateReplyAdminMutation();

  const listBusy = listQ.isLoading || listQ.isFetching;
  const busy = listBusy || updateState.isLoading || deleteState.isLoading;

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SupportTicketView | null>(null);
  const [editState, setEditState] = React.useState<EditState | null>(null);
  const [replyText, setReplyText] = React.useState('');

  function openDialog(ticket: SupportTicketView) {
    setSelected(ticket);
    setEditState({ status: ticket.status, priority: ticket.priority });
    setReplyText('');
    setDialogOpen(true);
  }

  function closeDialog() {
    if (busy || createReplyState.isLoading) return;
    setDialogOpen(false);
    setSelected(null);
    setEditState(null);
    setReplyText('');
  }

  async function onSave() {
    if (!editState || !selected) return;
    const patch: SupportTicketUpdatePayload = {};
    if (editState.status !== selected.status) patch.status = editState.status;
    if (editState.priority !== selected.priority) patch.priority = editState.priority;
    if (Object.keys(patch).length === 0) {
      toast.info(t('messages.noChanges'));
      return;
    }
    try {
      await updateTicket({ id: selected.id, patch }).unwrap();
      toast.success(t('messages.saved'));
      closeDialog();
      listQ.refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.saveError'));
    }
  }

  async function onDelete(ticket: SupportTicketView) {
    if (!window.confirm(t('confirmDelete', { subject: ticket.subject, id: ticket.id }))) return;
    try {
      await deleteTicket(ticket.id).unwrap();
      toast.success(t('messages.deleted'));
      if (dialogOpen) closeDialog();
      listQ.refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.deleteError'));
    }
  }

  async function onSendReply() {
    if (!selected || !replyText.trim()) return;
    try {
      await createReply({
        ticket_id: selected.id,
        message: replyText.trim(),
        is_admin: true,
      }).unwrap();
      toast.success(t('messages.replySent'));
      setReplyText('');
      listQ.refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.message || t('messages.replyError'));
    }
  }

  // Status badge
  const statusBadge = React.useCallback(
    (s: SupportTicketStatus) => {
      const label = t(`status.${s}`);
      if (s === 'open') return <Badge>{label}</Badge>;
      if (s === 'in_progress') return <Badge variant="secondary">{label}</Badge>;
      if (s === 'waiting_response')
        return (
          <Badge variant="outline" className="border-amber-400 text-amber-600">
            {label}
          </Badge>
        );
      return <Badge variant="outline">{label}</Badge>;
    },
    [t],
  );

  // Priority badge
  const priorityBadge = React.useCallback(
    (p: SupportTicketPriority) => {
      const label = t(`priority.${p}`);
      if (p === 'urgent') return <Badge variant="destructive">{label}</Badge>;
      if (p === 'high')
        return (
          <Badge variant="outline" className="border-orange-400 text-orange-600">
            {label}
          </Badge>
        );
      if (p === 'medium') return <Badge variant="secondary">{label}</Badge>;
      return <Badge variant="outline">{label}</Badge>;
    },
    [t],
  );

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('header.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => listQ.refetch()}
          disabled={busy}
        >
          <RefreshCcw className="mr-2 size-4" />
          {t('admin.common.refresh')}
        </Button>
      </div>

      {/* Error state */}
      {listQ.error ? (
        <div className="rounded-lg border bg-card p-3 text-sm text-destructive">
          {t('messages.loadError')}
        </div>
      ) : null}

      {/* Filters */}
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('filters.title')}</CardTitle>
          <CardDescription>{t('filters.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {/* Search */}
          <div className="space-y-2 xl:col-span-1">
            <Label>{t('admin.common.search')}</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.q}
                onChange={(e) => {
                  setFilters((p) => ({ ...p, q: e.target.value }));
                  setOffset(0);
                }}
                placeholder={t('filters.searchPlaceholder')}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t('filters.statusLabel')}</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(v) => {
                setFilters((p) => ({ ...p, status: v === 'all' ? '' : (v as SupportTicketStatus), onlyOpen: false }));
                setOffset(0);
              }}
              disabled={filters.onlyOpen}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('filters.statusAll')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.statusAll')}</SelectItem>
                <SelectItem value="open">{t('status.open')}</SelectItem>
                <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                <SelectItem value="waiting_response">{t('status.waiting_response')}</SelectItem>
                <SelectItem value="closed">{t('status.closed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>{t('filters.priorityLabel')}</Label>
            <Select
              value={filters.priority || 'all'}
              onValueChange={(v) => {
                setFilters((p) => ({ ...p, priority: v === 'all' ? '' : (v as SupportTicketPriority) }));
                setOffset(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('filters.priorityAll')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.priorityAll')}</SelectItem>
                <SelectItem value="low">{t('priority.low')}</SelectItem>
                <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                <SelectItem value="high">{t('priority.high')}</SelectItem>
                <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label>{t('filters.sortLabel')}</Label>
            <Select
              value={filters.sort}
              onValueChange={(v) => setFilters((p) => ({ ...p, sort: v as Filters['sort'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">{t('filters.sortCreated')}</SelectItem>
                <SelectItem value="updated_at">{t('filters.sortUpdated')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label>{t('filters.orderLabel')}</Label>
            <Select
              value={filters.order}
              onValueChange={(v) => setFilters((p) => ({ ...p, order: v as Filters['order'] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t('filters.orderDesc')}</SelectItem>
                <SelectItem value="asc">{t('filters.orderAsc')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Only open switch */}
          <div className="flex items-center gap-2 xl:col-span-5">
            <Switch
              checked={filters.onlyOpen}
              onCheckedChange={(v) => {
                setFilters((p) => ({ ...p, onlyOpen: v, status: '' }));
                setOffset(0);
              }}
            />
            <Label>{t('filters.onlyOpen')}</Label>
          </div>
        </CardContent>
      </Card>

      {/* Tickets table */}
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('list.title')}</CardTitle>
          <CardDescription>
            {t('list.description')}
            {total > 0 && (
              <span className="ml-2 tabular-nums text-foreground">
                ({total})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.subject')}</TableHead>
                  <TableHead>{t('columns.user')}</TableHead>
                  <TableHead>{t('columns.status')}</TableHead>
                  <TableHead>{t('columns.priority')}</TableHead>
                  <TableHead>{t('columns.createdAt')}</TableHead>
                  <TableHead className="text-right">{t('admin.common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 && listBusy && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      {t('list.loading')}
                    </TableCell>
                  </TableRow>
                )}
                {tickets.length === 0 && !listBusy && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      {t('list.empty')}
                    </TableCell>
                  </TableRow>
                )}
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openDialog(ticket)}>
                    <TableCell className="font-medium max-w-[220px] truncate">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{ticket.user_display_name ?? '-'}</div>
                      {ticket.user_email && (
                        <div className="text-xs text-muted-foreground">{ticket.user_email}</div>
                      )}
                    </TableCell>
                    <TableCell>{statusBadge(ticket.status)}</TableCell>
                    <TableCell>{priorityBadge(ticket.priority)}</TableCell>
                    <TableCell className="text-sm">{fmtDate(ticket.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(ticket)}
                          disabled={busy}
                        >
                          <Eye className="mr-2 size-4" />
                          {t('admin.common.view')}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(ticket)}
                          disabled={busy}
                        >
                          <Trash2 className="mr-2 size-4" />
                          {t('admin.common.delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {t('admin.common.page')} {currentPage} / {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0 || listBusy}
                  onClick={() => setOffset((p) => Math.max(0, p - LIMIT))}
                >
                  {t('admin.common.prev')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset + LIMIT >= total || listBusy}
                  onClick={() => setOffset((p) => p + LIMIT)}
                >
                  {t('admin.common.next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => (v ? null : closeDialog())}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('viewDialog.title')}</DialogTitle>
            <DialogDescription>{t('viewDialog.description')}</DialogDescription>
          </DialogHeader>

          {selected && editState && (
            <div className="grid gap-4">
              {/* Info box */}
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {t('viewDialog.infoTitle')}
                </div>
                <div className="grid gap-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('viewDialog.userLabel')}:</span>{' '}
                    <span className="font-medium">{selected.user_display_name ?? '-'}</span>
                  </div>
                  {selected.user_email && (
                    <div>
                      <span className="text-muted-foreground">{t('viewDialog.emailLabel')}:</span>{' '}
                      <span className="font-medium">{selected.user_email}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span>ID: <code>{selected.id}</code></span>
                    <span>{t('columns.createdAt')}: <code>{fmtDateTime(selected.created_at)}</code></span>
                    <span>{t('admin.common.updatedAt')}: <code>{fmtDateTime(selected.updated_at)}</code></span>
                  </div>
                </div>
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t('viewDialog.statusLabel')}</Label>
                  <Select
                    value={editState.status}
                    onValueChange={(v) =>
                      setEditState((p) => (p ? { ...p, status: v as SupportTicketStatus } : p))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">{t('status.open')}</SelectItem>
                      <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                      <SelectItem value="waiting_response">{t('status.waiting_response')}</SelectItem>
                      <SelectItem value="closed">{t('status.closed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('viewDialog.priorityLabel')}</Label>
                  <Select
                    value={editState.priority}
                    onValueChange={(v) =>
                      setEditState((p) => (p ? { ...p, priority: v as SupportTicketPriority } : p))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('priority.low')}</SelectItem>
                      <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                      <SelectItem value="high">{t('priority.high')}</SelectItem>
                      <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Original message */}
              <div className="space-y-2">
                <Label>{t('viewDialog.messageLabel')}</Label>
                <div className="rounded-md bg-muted/40 border p-3 text-sm whitespace-pre-wrap break-words min-h-[60px]">
                  {selected.message || '-'}
                </div>
              </div>

              {/* Replies thread */}
              <div className="space-y-3">
                <Label>{t('viewDialog.replies')}</Label>
                <div className="rounded-lg border bg-card p-3">
                  <RepliesThread ticketId={selected.id} t={t} />
                </div>
              </div>

              {/* Reply form */}
              <div className="space-y-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('viewDialog.replyPlaceholder')}
                  rows={3}
                  disabled={createReplyState.isLoading}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={onSendReply}
                  disabled={!replyText.trim() || createReplyState.isLoading}
                >
                  <Send className="mr-2 size-4" />
                  {createReplyState.isLoading ? t('viewDialog.sending') : t('viewDialog.sendReply')}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => selected && onDelete(selected)}
              disabled={busy}
            >
              <Trash2 className="mr-2 size-4" />
              {t('admin.common.delete')}
            </Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={closeDialog} disabled={busy}>
              {t('admin.common.cancel')}
            </Button>
            <Button onClick={onSave} disabled={busy || !editState}>
              {t('admin.common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
