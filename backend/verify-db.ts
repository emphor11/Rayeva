import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function verify() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const productCount = await prisma.product.count();
        const logCount = await prisma.aIInteractionLog.count();

        console.log(`Verification Results:`);
        console.log(`- Products in database: ${productCount}`);
        console.log(`- AI Logs in database: ${logCount}`);

        if (productCount > 0 && logCount > 0) {
            console.log(`✅ Success: Data persisted in both tables.`);
        } else {
            console.error(`❌ Failure: Missing data in one or more tables.`);
        }

        // Show the latest log
        const lastLog = await prisma.aIInteractionLog.findFirst({
            orderBy: { timestamp: 'desc' }
        });
        console.log(`Latest Log Status: ${lastLog?.status}`);

    } catch (error) {
        console.error(`Verification error:`, error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

verify();
