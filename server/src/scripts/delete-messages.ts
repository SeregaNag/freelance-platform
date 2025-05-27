import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteMessages() {
  try {
    const result = await prisma.message.deleteMany();
    
  } catch (error) {
    console.error('Error deleting messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteMessages(); 