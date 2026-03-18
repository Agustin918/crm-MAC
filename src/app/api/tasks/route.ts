import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse, validateBody } from '@/lib/api-response';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { dueDate: 'asc' },
      include: {
        contacto: true
      }
    });
    
    return NextResponse.json(successResponse(tasks));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(errorResponse('Error al obtener tareas'), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = validateBody(body, ['title']);
    if (!validation.valid) {
      return NextResponse.json(
        errorResponse(`Campos requeridos: ${validation.missing?.join(', ')}`), 
        { status: 400 }
      );
    }
    
    const { title, description, dueDate, contactId, priority, category, assignedTo, createdBy } = body;
    
    let parsedDate = null;
    if (dueDate) {
      const [datePart, timePart] = dueDate.split('T');
      if (datePart) {
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = (timePart || '12:00').split(':').map(Number);
        parsedDate = new Date(year, month - 1, day, hours || 12, minutes || 0, 0);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: parsedDate,
        contactId,
        priority: priority || 'MEDIUM',
        category: category || 'TASK',
        assignedTo,
        createdBy,
      }
    });
    
    return NextResponse.json(successResponse(task, 'Tarea creada correctamente'));
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(errorResponse('Error al crear tarea'), { status: 500 });
  }
}
