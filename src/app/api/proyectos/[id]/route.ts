import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const proyecto = await prisma.proyecto.findUnique({
      where: { id },
      include: {
        contacto: true,
        fases: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        archivos: true,
        historial: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!proyecto) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ data: proyecto });
  } catch (error) {
    console.error('Error fetching proyecto:', error);
    return NextResponse.json({ error: 'Error fetching proyecto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, estado, faseActual, m2, valorEstimado, honorariosTotal, honorariosCobrados, metadata } = body;

    const proyecto = await prisma.proyecto.update({
      where: { id },
      data: {
        nombre: nombre,
        estado: estado,
        faseActual: faseActual,
        m2: m2,
        valorEstimado: valorEstimado,
        honorariosTotal: honorariosTotal,
        honorariosCobrados: honorariosCobrados,
        metadata: metadata,
      },
      include: {
        contacto: true,
        fases: true,
      },
    });

    return NextResponse.json({ data: proyecto });
  } catch (error) {
    console.error('Error updating proyecto:', error);
    return NextResponse.json({ error: 'Error updating proyecto' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.proyecto.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting proyecto:', error);
    return NextResponse.json({ error: 'Error deleting proyecto' }, { status: 500 });
  }
}
