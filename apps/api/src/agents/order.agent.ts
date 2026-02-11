import { z } from 'zod';
import { tool } from 'ai';
import prisma from '@agentdesk/db';

export class OrderAgent {
    static getTools() {
        return {
            getOrderDetails: tool({
                description: 'Get the details of a specific order by its Order Number (e.g., ORD-123).',
                parameters: z.object({
                    orderNumber: z.string().describe('The order number to look up'),
                }),
                execute: async ({ orderNumber }) => {
                    console.log(`[OrderAgent] Fetching order: ${orderNumber}`);
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
                        console.error('[OrderAgent] Database Error:', error);
                        return { error: 'Failed to fetch order details. Database might be offline.' };
                    }
                },
            }),
        };
    }
}
