import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const contact = await prisma.contact.update({
      where: { id },
      data: { status }
    });

    // Auto-create project when contact becomes QUALIFIED
    if (status === 'QUALIFIED') {
      const existingProject = await prisma.proyecto.findUnique({
        where: { contactoId: id }
      });

      if (!existingProject) {
        const proyecto = await prisma.proyecto.create({
          data: {
            nombre: `Proyecto ${contact.name}`,
            contactoId: contact.id,
            m2: contact.meters,
            valorEstimado: contact.valorEstimado || contact.value,
            faseActual: 'ANTEPROYECTO',
            estado: 'ACTIVO',
            honorariosTotal: 0,
            honorariosCobrados: 0,
          }
        });

        // Create initial phases
        const fases = ['ANTEPROYECTO', 'PROYECTO', 'DOCUMENTACION', 'OBRA'];
        for (const fase of fases) {
          await prisma.faseProyecto.create({
            data: {
              proyectoId: proyecto.id,
              nombre: fase,
              estado: fase === 'ANTEPROYECTO' ? 'EN_PROGRESO' : 'PENDIENTE',
              porcentajeAvance: 0,
            },
          });
        }

        // Create historial entry
        await prisma.historial.create({
          data: {
            proyectoId: proyecto.id,
            tipo: 'proyecto_creado',
            descripcion: `Proyecto creado automáticamente al calificar lead`,
          },
        });

        // Create follow-up task
        await prisma.task.create({
          data: {
            title: 'Primera reunión de proyecto',
            description: 'Programar primera reunión con el cliente para avance de anteproyecto',
            contactId: contact.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            priority: 'HIGH',
            category: 'MEETING',
          },
        });
      }
    }

    // Create follow-up task when status becomes QUOTE
    if (status === 'QUOTE') {
      await prisma.task.create({
        data: {
          title: 'Follow up presupuesto',
          description: 'Seguimiento después de enviar presupuesto',
          contactId: contact.id,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          priority: 'MEDIUM',
          category: 'FOLLOWUP',
        },
      });
    }
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Error updating contact' }, { status: 500 });
  }
}
