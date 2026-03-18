import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📥 Instagram Lead received:', body);
    
    const { 
      name, 
      email, 
      phone, 
      meters, 
      description,
      source = 'instagram',
      campaign 
    } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const contact = await prisma.contact.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        meters: meters ? parseFloat(meters) : null,
        description: description || null,
        source,
        campaign: campaign || null,
        status: 'LEAD'
      }
    });
    
    if (description) {
      await prisma.interaction.create({
        data: {
          type: 'NOTE',
          content: `Lead de Instagram. Descripción: ${description}`,
          contactId: contact.id
        }
      });
    }
    
    console.log('✅ Contact created:', contact.id);
    
    return NextResponse.json({ 
      success: true, 
      contactId: contact.id,
      message: 'Lead creado exitosamente'
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Instagram Lead Ads webhook is active',
    usage: 'POST with { name, email, phone, meters, description }'
  });
}
