// src/modules/orders/controller.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { telegramNotify } from '../telegram/helpers/telegram.notifier';
import { sendMailRaw, escapeMailHtml } from '../mail';

function orderLocale(req: FastifyRequest): string {
  const h = req.headers['x-locale'];
  return typeof h === 'string' && h.length >= 2 ? h.slice(0, 8) : 'tr';
}

async function sendOrderAdminEmail(input: {
  customerName: string;
  orderId: string;
  total: string;
  itemCount: number;
  notes?: string | null;
  locale?: string | null;
}) {
  const adminEmails = await getAdminNotificationEmails(input.locale);
  if (!adminEmails.length) return;

  const subject = `[Yeni Sipariş] ${escapeMailHtml(input.customerName)} — ${input.itemCount} kalem`;
  const html = `<p><strong>Bayi/Firma:</strong> ${escapeMailHtml(input.customerName)}</p>
    <p><strong>Sipariş No:</strong> ${escapeMailHtml(input.orderId)}</p>
    <p><strong>Kalem Sayısı:</strong> ${input.itemCount}</p>
    <p><strong>Toplam:</strong> ${escapeMailHtml(input.total)}</p>
    ${input.notes ? `<p><strong>Not:</strong><br/>${escapeMailHtml(input.notes).replace(/\n/g, '<br/>')}</p>` : ''}`;
  const text = `Bayi/Firma: ${input.customerName}\nSipariş No: ${input.orderId}\nKalem Sayısı: ${input.itemCount}\nToplam: ${input.total}${input.notes ? `\nNot: ${input.notes}` : ''}`;

  for (const to of adminEmails) {
    await sendMailRaw({ to, subject, html, text });
  }
}
import { randomUUID } from 'crypto';
import { env } from '../../core/env';
import {
  getAuthUserId,
  parsePage,
  sendNotFound,
  sendValidationError,
  handleRouteError,
  setContentRange,
  getAdminNotificationEmails,
} from '../_shared';
import {
  orderCreateSchema,
  orderListQuerySchema,
  type OrderStatus,
  type NewOrderRow,
  type NewOrderItemRow,
} from '@ensotek/shared-backend/modules/orders';
import {
  repoListOrders,
  repoCountOrders,
  repoGetOrderById,
  repoCreateOrder,
  repoUpdateOrderStatus,
  repoGetProductPrices,
} from './repository';
import { repoGetDealerProfile } from '../dealerFinance/repository';

/* ---- GET /orders ---- */
export async function dealerListOrders(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const raw = req.query as Record<string, string>;
    const parsed = orderListQuerySchema.safeParse(raw);
    if (!parsed.success) return sendValidationError(reply, parsed.error.issues);

    const { page, limit, offset } = parsePage(raw);
    const total = await repoCountOrders({
      dealer_id: dealerId,
      status: parsed.data.status as OrderStatus | undefined,
      date_from: parsed.data.date_from,
      date_to: parsed.data.date_to,
    });

    const rows = await repoListOrders({
      dealer_id: dealerId,
      status: parsed.data.status as OrderStatus | undefined,
      date_from: parsed.data.date_from,
      date_to: parsed.data.date_to,
      limit,
      offset,
    });

    setContentRange(reply, offset, limit, total);
    return reply.send({ data: rows, total, page, limit });
  } catch (e) {
    return handleRouteError(reply, req, e, 'dealer_list_orders');
  }
}

/* ---- GET /orders/:id ---- */
export async function dealerGetOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const { id } = req.params as { id: string };

    const order = await repoGetOrderById(id, orderLocale(req));
    if (!order || order.dealer_id !== dealerId) return sendNotFound(reply);

    return reply.send(order);
  } catch (e) {
    return handleRouteError(reply, req, e, 'dealer_get_order');
  }
}

/* ---- POST /orders ---- */
export async function dealerCreateOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const parsed = orderCreateSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(reply, parsed.error.issues);

    const { items: inputItems, seller_id, notes } = parsed.data;

    // Fetch real product prices from DB
    const productIds = inputItems.map((item) => item.product_id);
    const priceMap = await repoGetProductPrices(productIds);

    const profile = await repoGetDealerProfile(dealerId);
    const discountPct = profile ? parseFloat(profile.discount_rate) : 0;
    const discountFactor =
      1 - Math.min(99.99, Math.max(0, Number.isFinite(discountPct) ? discountPct : 0)) / 100;

    // Validate all products exist
    const missing = productIds.filter((pid) => !priceMap.has(pid));
    if (missing.length > 0) {
      return reply.code(400).send({
        error: { message: 'products_not_found', product_ids: missing },
      });
    }

    // Build order items with server-calculated prices
    const orderId = randomUUID();
    let orderTotal = 0;

    const isPieceOrder = env.DEALER_ORDER_QUANTITY_UNIT === 'piece';
    const orderItemRows: NewOrderItemRow[] = inputItems.map((item) => {
      const list = parseFloat(priceMap.get(item.product_id) ?? '0');
      const unitPrice = list * discountFactor;
      const totalPrice = isPieceOrder
        ? unitPrice * item.quantity
        : (unitPrice * item.quantity) / 1000;
      orderTotal += totalPrice;

      return {
        id: randomUUID(),
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: String(unitPrice),
        total_price: String(totalPrice),
      };
    });

    const orderRow: NewOrderRow = {
      id: orderId,
      dealer_id: dealerId,
      seller_id: seller_id ?? null,
      status: 'pending',
      total: String(orderTotal),
      notes: notes ?? null,
    };

    await repoCreateOrder(orderRow, orderItemRows);

    const created = await repoGetOrderById(orderId, orderLocale(req));
    const customerName = profile?.company_name ?? dealerId;
    telegramNotify({
      event: 'new_order',
      data: {
        customer_name: customerName,
        order_id: orderId,
        total: String(orderTotal.toFixed(2)),
        item_count: String(orderItemRows.length),
        created_at: new Date().toISOString(),
      },
    }).catch(() => {});
    sendOrderAdminEmail({
      customerName,
      orderId,
      total: orderTotal.toFixed(2),
      itemCount: orderItemRows.length,
      notes,
      locale: orderLocale(req),
    }).catch(() => {});
    return reply.code(201).send(created);
  } catch (e) {
    return handleRouteError(reply, req, e, 'dealer_create_order');
  }
}

/* ---- PATCH /orders/:id/cancel ---- */
export async function dealerCancelOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const { id } = req.params as { id: string };

    const order = await repoGetOrderById(id, orderLocale(req));
    if (!order || order.dealer_id !== dealerId) return sendNotFound(reply);

    if (order.status !== 'pending') {
      return reply.code(400).send({
        error: { message: 'only_pending_orders_can_be_cancelled' },
      });
    }

    await repoUpdateOrderStatus(id, 'cancelled');
    const updated = await repoGetOrderById(id, orderLocale(req));
    return reply.send(updated);
  } catch (e) {
    return handleRouteError(reply, req, e, 'dealer_cancel_order');
  }
}
