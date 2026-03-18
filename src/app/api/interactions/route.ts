import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const interactions = await prisma.interaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contact: true
      }
    });
    return NextResponse.json(interactions);
  } catch {
    return NextResponse.json({ error: 'Error fetching interactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { contactId, type, content } = await request.json();
    
    const interaction = await prisma.interaction.create({
      data: {
        contactId,
        type: type || 'NOTE',
        content
      }
    });

    await prisma.contact.update({
      where: { id: contactId },
      data: { lastInteractionAt: new Date() }
    });
    
    return NextResponse.json(interaction);
  } catch (error) {
    console.error('Error creating interaction:', error);
    return NextResponse.json({ error: 'Error creating interaction' }, { status: 500 });
  }
}
