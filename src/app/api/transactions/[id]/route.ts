import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

/** แก้ไข */
export async function PUT(req: NextRequest, { params }: { params: { id: Number } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { type, name, amount, transactionDate } = body;

    if (!id || !type || !name || !amount || !transactionDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        type,
        name,
        amount,
        transactionDate: new Date(transactionDate),
      },
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/** ลบรายการ */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    const deletedTransaction = await prisma.transaction.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedTransaction, { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
  } finally {
    await prisma.$disconnect();
  }
}
