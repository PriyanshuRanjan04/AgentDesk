import { z } from 'zod';
import { tool } from 'ai';
import prisma from '@agentdesk/db';

// Tool to get order details
export const getOrderDetails = tool({
    description: 'Get the details of a specific order by its Order Number (e.g., ORD-123).',
    parameters: z.object({
        orderNumber: z.string().describe('The order number to look up'),
    }),
    execute: async ({ orderNumber }) => {
        try {
            const order = await prisma.order.findUnique({
                where: { orderNumber },
            });
            if (!order) {
                return { error: 'Order not found.' };
            }
            return {
                orderNumber: order.orderNumber,
                status: order.status,
                total: order.total,
                items: order.items,
                details: order.details,
            };
        } catch (error) {
            return { error: 'Failed to fetch order details. Database might be offline.' };
        }
    },
});

// Tool to check billing/invoice status
export const checkInvoiceStatus = tool({
    description: 'Check the status of an invoice or payment.',
    parameters: z.object({
        invoiceNumber: z.string().describe('The invoice number (e.g., INV-001)'),
    }),
    execute: async ({ invoiceNumber }) => {
        try {
            const invoice = await prisma.invoice.findUnique({
                where: { invoiceNumber },
            });
            if (!invoice) return { error: 'Invoice not found.' };
            return {
                invoiceNumber: invoice.invoiceNumber,
                amount: invoice.amount,
                status: invoice.status,
                dueDate: invoice.dueDate,
            };
        } catch (error) {
            return { error: 'Failed to fetch invoice. Database might be offline.' };
        }
    },
});

// Tool for return policy (Static Knowledge Base)
export const getReturnPolicy = tool({
    description: 'Get the return policy information.',
    parameters: z.object({
        query: z.string().optional().describe('Optional context for the return policy query'),
    }),
    execute: async () => {
        return {
            policy: "Items can be returned within 30 days of delivery. They must be in original condition. Shipping fees are non-refundable unless the item is defective.",
            process: "To initiate a return, go to the 'My Orders' section in your account or contact support.",
        };
    },
});
