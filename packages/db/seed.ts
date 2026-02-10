import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // Cleanup
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();

    // Create User
    const alice = await prisma.user.create({
        data: {
            email: "alice@example.com",
            name: "Alice Johnson",
            role: "CUSTOMER",
        },
    });

    console.log(`Created user: ${alice.name}`);

    // Create Orders
    await prisma.order.create({
        data: {
            orderNumber: "ORD-123456",
            userId: alice.id,
            status: "SHIPPED",
            total: 129.99,
            items: JSON.stringify([
                { name: "Wireless Headphones", price: 99.99, quantity: 1 },
                { name: "USB-C Cable", price: 30.00, quantity: 1 }
            ]),
            details: "Shipped via FedEx on Oct 24th. Tracking: FX123456789",
        },
    });

    await prisma.order.create({
        data: {
            orderNumber: "ORD-789012",
            userId: alice.id,
            status: "PENDING",
            total: 59.50,
            items: JSON.stringify([
                { name: "Mechanical Keyboard Keycaps", price: 59.50, quantity: 1 }
            ]),
            details: "Order is being packed at the warehouse.",
        },
    });

    console.log("Created 2 orders for Alice");

    // Create Invoice (Billing Agent Test)
    await prisma.invoice.create({
        data: {
            invoiceNumber: "INV-2024-001",
            amount: 129.99,
            status: "PAID",
            dueDate: new Date("2024-11-01"),
            items: JSON.stringify({ orderId: "ORD-123456" }),
        },
    });

    console.log("Created 1 invoice");

    // Create a past conversation
    const conv = await prisma.conversation.create({
        data: {
            userId: alice.id,
            title: "Previous Support Chat",
            messages: {
                create: [
                    { role: "user", content: "Hi, when will my headphones arrive?" },
                    { role: "assistant", content: "Hi Alice! I see your order ORD-123456 containing Wireless Headphones has been shipped. It should arrive by Friday." },
                ],
            },
        },
    });

    console.log(`Created conversation: ${conv.id}`);

    console.log("✅ Seed completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
