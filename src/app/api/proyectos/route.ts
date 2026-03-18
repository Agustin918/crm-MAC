import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const proyectos = await prisma.proyecto.findMany({
      include: {
        contacto: true,
        fases: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: proyectos });
  } catch (error) {
    console.error('Error fetching proyectos:', error);
    return NextResponse.json({ error: 'Error fetching proyectos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, contactoId, m2, valorEstimado, faseActual, estado } = body;

    const proyecto = await prisma.proyecto.create({
      data: {
        nombre,
        contactoId,
        m2: m2 || null,
        valorEstimado: valorEstimado || null,
        faseActual: faseActual || 'ANTEPROYECTO',
        estado: estado || 'ACTIVO',
        honorariosTotal: 0,
        honorariosCobrados: 0,
      },
      include: {
        contacto: true,
      },
    });

    // Create initial phases
    const fases = ['ANTEPROYECTO', 'PROYECTO', 'DOCUMENTACION', 'OBRA'];
    for (const fase of fases) {
      await prisma.faseProyecto.create({
        data: {
          proyectoId: proyecto.id,
          nombre: fase,
          estado: fase === 'ANTEPROYECTO' ? 'EN_PROGRESO' : 'PENDIENTE',
          porcentajeAvance: fase === 'ANTEPROYECTO' ? 0 : 0,
        },
      });
    }

    // Create historial entry
    await prisma.historial.create({
      data: {
        proyectoId: proyecto.id,
        tipo: 'proyecto_creado',
        descripcion: `Proyecto "${nombre}" creado`,
      },
    });

    return NextResponse.json({ data: proyecto }, { status: 201 });
  } catch (error) {
    console.error('Error creating proyecto:', error);
    return NextResponse.json({ error: 'Error creating proyecto' }, { status: 500 });
  }
}
