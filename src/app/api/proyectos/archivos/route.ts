import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const proyectoId = formData.get('proyectoId') as string;
    const tipo = formData.get('tipo') as string;
    const nombre = formData.get('nombre') as string;

    if (!file || !proyectoId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'proyectos', proyectoId);
    await mkdir(uploadDir, { recursive: true });
    
    const uniqueName = `${Date.now()}-${nombre}`;
    const filePath = join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const archivo = await prisma.archivo.create({
      data: {
        proyectoId,
        nombre: nombre || file.name,
        tipo: tipo || 'otro',
        url: `/uploads/proyectos/${proyectoId}/${uniqueName}`,
      },
    });

    return NextResponse.json({ data: archivo });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 });
  }
}
