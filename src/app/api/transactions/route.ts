import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, name, amount, transactionDate } = body;

    // ตรวจสอบว่าข้อมูลที่ต้องการถูกส่งมาครบถ้วน
    if (!type || !name || !amount || !transactionDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // บันทึกข้อมูลลงในฐานข้อมูล
    const transaction = await prisma.transaction.create({
      data: {
        type,
        name,
        amount,
        transactionDate: new Date(transactionDate),
      },
    });

    // ส่งข้อมูลที่บันทึกกลับไปยังผู้ใช้
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET() {
  const prisma = new PrismaClient();
  const transactions = await prisma.transaction.findMany();

  return NextResponse.json({
    status: 200,
    message: "get transaction success",
    data: transactions,
  });
}
