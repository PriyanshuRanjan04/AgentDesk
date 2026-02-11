import { PrismaClient } from '@prisma/client';

const encodedPassword = encodeURIComponent("Ranjangolu$$285");
const connectionString = `postgresql://postgres.dwijmxwibwzdnuqtgrft:${encodedPassword}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true`;

console.log("Testing connection with string (masked password):");
console.log(connectionString.replace(encodedPassword, "****"));

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString,
        },
    },
    log: ['info', 'warn', 'error'],
});

async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to the database!');
        const userCount = await prisma.user.count();
        console.log(`Found ${userCount} users.`);
    } catch (e) {
        console.error('❌ Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
