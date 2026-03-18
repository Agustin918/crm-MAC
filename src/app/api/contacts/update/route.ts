import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { id, value, notes, status, tipologia, costoM2, porcentajeHonorarios, meters, lastInteractionAt } = await request.json();
    
    const metros = meters !== undefined ? (meters ? parseFloat(meters) : null) : undefined;
    const costoM2Num = costoM2 !== undefined ? (costoM2 ? parseFloat(costoM2) : null) : undefined;
    const porcentajeNum = porcentajeHonorarios !== undefined ? (porcentajeHonorarios ? parseFloat(porcentajeHonorarios) : null) : undefined;
    const valueNum = value !== undefined ? (value ? parseFloat(value) : null) : undefined;
    
    let valorEstimado = valueNum;
    if ((metros || metros === 0) && (costoM2Num || costoM2Num === 0) && (porcentajeNum || porcentajeNum === 0)) {
      valorEstimado = (metros! * costoM2Num!) * (porcentajeNum! / 100);
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...(value !== undefined && { value: valorEstimado }),
        ...(notes !== undefined && { notes }),
        ...(status && { status }),
        ...(tipologia !== undefined && { tipologia }),
        ...(costoM2 !== undefined && { costoM2: costoM2Num }),
        ...(porcentajeHonorarios !== undefined && { porcentajeHonorarios: porcentajeNum }),
        ...(meters !== undefined && { meters: metros }),
        ...(lastInteractionAt !== undefined && { lastInteractionAt: new Date(lastInteractionAt) }),
        ...(lastInteractionAt === true && { lastInteractionAt: new Date() })
      }
    });
    
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Error updating contact' }, { status: 500 });
  }
}
