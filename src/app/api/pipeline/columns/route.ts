import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_COLUMNS = [
  { name: 'Lead', color: 'bg-blue-500', order: 0 },
  { name: 'Contactado', color: 'bg-yellow-500', order: 1 },
  { name: 'Calificado', color: 'bg-orange-500', order: 2 },
  { name: 'Presupuestado', color: 'bg-purple-500', order: 3 },
  { name: 'Ganado', color: 'bg-green-500', order: 4 },
  { name: 'Perdido', color: 'bg-red-500', order: 5 },
];

export async function GET() {
  try {
    let columns = await prisma.pipelineColumn.findMany({
      orderBy: { order: 'asc' }
    });

    if (columns.length === 0) {
      for (const col of DEFAULT_COLUMNS) {
        await prisma.pipelineColumn.create({ data: col });
      }
      columns = await prisma.pipelineColumn.findMany({
        orderBy: { order: 'asc' }
      });
    }

    return NextResponse.json(columns);
  } catch {
    return NextResponse.json({ error: 'Error fetching columns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, color } = await request.json();
    
    const maxOrder = await prisma.pipelineColumn.aggregate({
      _max: { order: true }
    });

    const column = await prisma.pipelineColumn.create({
      data: {
        name,
        color,
        order: (maxOrder._max.order || 0) + 1
      }
    });

    return NextResponse.json(column);
  } catch {
    return NextResponse.json({ error: 'Error creating column' }, { status: 500 });
  }
}
