import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, contactId } = body;

    if (!contactId) {
      return NextResponse.json({ error: 'contactId is required' }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    switch (event) {
      case 'contact.created':
        // Notificar a n8n sobre nuevo contacto
        console.log('📢 Nuevo lead creado:', contact.name);
        break;
      
      case 'contact.status_changed':
        console.log('📢 Estado cambiado:', contact.name, '→', contact.status);
        break;
      
      case 'interaction.created':
        console.log('📢 Nueva interacción:', contact.name);
        break;
      
      default:
        console.log('📢 Evento desconocido:', event);
    }

    return NextResponse.json({ 
      success: true, 
      event, 
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        status: contact.status
      }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
