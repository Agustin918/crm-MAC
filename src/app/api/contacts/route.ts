import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: true,
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Error fetching contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, meters, description, source, value, status, notes, tipologia, costoM2, porcentajeHonorarios } = await request.json();
    
    const metros = meters ? parseFloat(meters) : null;
    const costoM2Num = costoM2 ? parseFloat(costoM2) : null;
    const porcentajeNum = porcentajeHonorarios ? parseFloat(porcentajeHonorarios) : null;
    
    let valorEstimado = value ? parseFloat(value) : null;
    if (metros && costoM2Num && porcentajeNum) {
      valorEstimado = (metros * costoM2Num) * (porcentajeNum / 100);
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        meters: metros,
        description,
        source: source || 'manual',
        value: valorEstimado,
        status: status || 'LEAD',
        notes,
        tipologia: tipologia || null,
        costoM2: costoM2Num,
        porcentajeHonorarios: porcentajeNum,
        valorEstimado: valorEstimado,
        lastInteractionAt: new Date()
      }
    });

    if (description) {
      await prisma.interaction.create({
        data: {
          type: 'NOTE',
          content: description,
          contactId: contact.id
        }
      });
    }

    if (contact.status === 'LEAD') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      await prisma.task.create({
        data: {
          title: `Contactar a ${name}`,
          description: 'Seguimiento automático: primer contacto al lead',
          dueDate: tomorrow,
          priority: 'HIGH',
          category: 'CALL',
          contactId: contact.id,
          createdBy: 'system'
        }
      });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Error creating contact' }, { status: 500 });
  }
}
