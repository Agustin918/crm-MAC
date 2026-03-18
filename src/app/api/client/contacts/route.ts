import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PUBLIC_FIELDS = {
  id: true,
  name: true,
  email: true,
  phone: true,
  meters: true,
  description: true,
  value: true,
  status: true,
  tipologia: true,
  createdAt: true,
};

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      select: PUBLIC_FIELDS,
      orderBy: { createdAt: 'desc' },
    });
    
    const publicContacts = contacts.map(contact => ({
      ...contact,
      isPublic: true,
      exposureLevel: 'basic',
    }));
    
    return NextResponse.json(publicContacts);
  } catch (error) {
    console.error('Error fetching public contacts:', error);
    return NextResponse.json({ error: 'Error fetching contacts' }, { status: 500 });
  }
}
