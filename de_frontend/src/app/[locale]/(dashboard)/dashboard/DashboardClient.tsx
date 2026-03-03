'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useTickets } from '@/features/support/support.action';
import { useNotifications } from '@/features/notifications/notifications.action';
import { useChatMessages, useChatThreads } from '@/features/chat/chat.action';

const statusToVariant: Record<string, string> = {
  open: 'success',
  in_progress: 'warning',
  waiting_response: 'info',
  closed: 'secondary',
};

const priorityToVariant: Record<string, string> = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

export function DashboardClient() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const { data: tickets, isLoading: ticketsLoading } = useTickets();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  const { data: chatThreadsData, isLoading: chatThreadsLoading } = useChatThreads({
    context_type: 'request',
    limit: 6,
  });
  const { data: selectedThreadMessages, isLoading: selectedMessagesLoading } = useChatMessages(
    selectedThreadId,
    { limit: 80 },
    { enabled: !!selectedThreadId, refetchInterval: 5000 },
  );

  const safeTickets = tickets || [];
  const safeNotifications = notifications?.data || [];
  const safeChatThreads = (chatThreadsData?.items || []).map((item: any) =>
    item?.thread ? item.thread : item,
  );

  const openTickets = safeTickets.filter((tItem) => tItem.status !== 'closed').length;
  const unreadNotifications = safeNotifications.filter((n) => !n.is_read).length;
  const statusLabels: Record<string, string> = {
    open: t('status_open'),
    in_progress: t('status_in_progress'),
    waiting_response: t('status_waiting_response'),
    closed: t('status_closed'),
  };
  const priorityLabels: Record<string, string> = {
    low: t('priority_low'),
    medium: t('priority_medium'),
    high: t('priority_high'),
    urgent: t('priority_urgent'),
  };

  const cards = [
    { icon: 'fa-headset', label: t('open_tickets'), value: openTickets, href: '/dashboard', color: 'primary' },
    {
      icon: 'fa-bell',
      label: t('unread_notifications'),
      value: unreadNotifications,
      href: '/dashboard',
      color: 'warning',
    },
    { icon: 'fa-file-invoice', label: t('offer_request'), value: null, href: '/offer', color: 'success' },
    { icon: 'fa-book', label: t('catalog_request'), value: null, href: '/contact', color: 'info' },
  ];

  return (
    <div>
      <h4 className="fw-bold mb-4">{t('overview')}</h4>

      <div className="row g-3">
        {cards.map((card) => (
          <div key={card.label} className="col-12 col-md-6 col-xl-3">
            <Link href={card.href} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex align-items-center gap-3">
                  <div
                    className={`rounded-circle bg-${card.color} bg-opacity-10 d-flex align-items-center justify-content-center`}
                    style={{ width: 52, height: 52 }}
                  >
                    <i className={`fa-light ${card.icon} text-${card.color}`} />
                  </div>
                  <div>
                    {card.value !== null && <h3 className="mb-0 fw-bold">{card.value}</h3>}
                    <div className="small text-muted">{card.label}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0">{t('recent_tickets')}</h5>
          <Link href="/dashboard" className="text-decoration-none small">{t('view_all')}</Link>
        </div>

        {(ticketsLoading || notificationsLoading) && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">{t('loading')}</div>
          </div>
        )}

        {!ticketsLoading && safeTickets.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-muted">{t('no_tickets')}</div>
          </div>
        )}

        {!ticketsLoading && safeTickets.length > 0 && (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('table_subject')}</th>
                    <th>{t('table_status')}</th>
                    <th>{t('table_priority')}</th>
                    <th>{t('table_date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {safeTickets.slice(0, 6).map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.subject}</td>
                      <td>
                        <span className={`badge bg-${statusToVariant[ticket.status] || 'secondary'}`}>
                          {statusLabels[ticket.status] || ticket.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${priorityToVariant[ticket.priority] || 'secondary'}`}>
                          {priorityLabels[ticket.priority] || ticket.priority}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {new Date(ticket.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0">{t('chat_requests_title')}</h5>
        </div>

        {chatThreadsLoading && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">{t('loading')}</div>
          </div>
        )}

        {!chatThreadsLoading && safeChatThreads.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-muted">{t('chat_no_requests')}</div>
          </div>
        )}

        {!chatThreadsLoading && safeChatThreads.length > 0 && (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('chat_thread')}</th>
                    <th>{t('table_status')}</th>
                    <th>{t('chat_updated_at')}</th>
                    <th>{t('chat_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {safeChatThreads.map((thread: any) => (
                    <tr key={thread.id} className={selectedThreadId === thread.id ? 'table-primary' : ''}>
                      <td className="small">{thread.id}</td>
                      <td>
                        <span className={`badge ${thread.handoff_mode === 'admin' ? 'bg-warning text-dark' : 'bg-info'}`}>
                          {thread.handoff_mode === 'admin' ? t('chat_handoff_admin') : t('chat_handoff_ai')}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {new Date(thread.updated_at || thread.created_at).toLocaleDateString(
                          locale === 'tr' ? 'tr-TR' : 'en-US',
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedThreadId(thread.id)}
                        >
                          {t('chat_view')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedThreadId && (
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">{t('chat_messages_title')}</h6>

              {selectedMessagesLoading && <div className="text-muted small">{t('loading')}</div>}

              {!selectedMessagesLoading && (selectedThreadMessages?.items || []).length === 0 && (
                <div className="text-muted small">{t('chat_no_messages')}</div>
              )}

              {!selectedMessagesLoading && (selectedThreadMessages?.items || []).length > 0 && (
                <div style={{ maxHeight: 320, overflowY: 'auto' }} className="d-flex flex-column gap-2">
                  {(selectedThreadMessages?.items || []).map((msg: any) => (
                    <div key={msg.id} className="border rounded p-2 bg-light">
                      <div className="small text-muted mb-1">
                        {new Date(msg.created_at).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
