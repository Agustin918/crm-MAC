import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, color, order } = await request.json();

    const column = await prisma.pipelineColumn.update({
      where: { id },
      data: { name, color, order }
    });

    return NextResponse.json(column);
  } catch {
    return NextResponse.json({ error: 'Error updating column' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.pipelineColumn.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error deleting column' }, { status: 500 });
  }
}
