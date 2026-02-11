import { z } from 'zod';
import { tool } from 'ai';
import prisma from '@agentdesk/db';

export class BillingAgent {
    static getTools() {
        return {
            checkInvoiceStatus: tool({
                description: 'Check the status of an invoice or payment.',
                parameters: z.object({
                    invoiceNumber: z.string().describe('The invoice number (e.g., INV-001)'),
                }),
                execute: async ({ invoiceNumber }) => {
                    console.log(`[BillingAgent] Checking invoice: ${invoiceNumber}`);
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
                        console.error('[BillingAgent] Database Error:', error);
                        return { error: 'Failed to fetch invoice. Database might be offline.' };
                    }
                },
            }),
        };
    }
}
