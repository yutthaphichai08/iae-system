import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    // ตรวจสอบการสร้างวันที่ให้ถูกต้อง
    const startDate = new Date(`${year}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(`${year}-${(Number(month) + 1).toString().padStart(2, '0')}-01`);

    // console.log('Start Date:', startDate);  // ตรวจสอบวันเริ่มต้น
    // console.log('End Date:', endDate);  // ตรวจสอบวันสิ้นสุด

    // ดึงข้อมูลจากฐานข้อมูล
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // ตรวจสอบข้อมูล transactions
    console.log('Transactions:', transactions);

    // คำนวณรายรับและรายจ่าย
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    return NextResponse.json(
      {
        month,
        year,
        totalIncome: income,
        totalExpense: expense,
        balance,
        transactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating report:',error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
