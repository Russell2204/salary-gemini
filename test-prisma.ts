import { prisma } from './lib/prisma.ts';

async function test() {
  try {
    console.log('Prisma keys:', Object.keys(prisma));
    console.log('Prisma user:', prisma.user);
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    process.exit(0);
  } catch (error) {
    console.error('Prisma test error:', error);
    process.exit(1);
  }
}

test();
