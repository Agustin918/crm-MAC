import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, completed } = await request.json();
    
    const task = await prisma.task.update({
      where: { id },
      data: { completed }
    });
    
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
  }
}
