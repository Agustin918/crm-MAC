"use server";

import { PrismaClient } from "@prisma/client";

// Evita múltiples instancias en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getContacts() {
  return await prisma.contact.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function createContact(data: { name: string, email?: string, company?: string }) {
  const contact = await prisma.contact.create({
    data
  });

   // Notificar a n8n sobre nuevo contacto
   try {
     await fetch('http://localhost:5678/webhook/crm/contact-created', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ contactId: contact.id })
     }).catch(() => {}); // Silencioso si n8n no está disponible
   } catch {
     // Silencioso
   }

  return contact;
}

export async function getStats() {
  const total = await prisma.contact.count();
  const leads = await prisma.contact.count({ where: { status: "LEAD" } });
  const contacted = await prisma.contact.count({ where: { status: "CONTACTED" } });
  const qualified = await prisma.contact.count({ where: { status: "QUALIFIED" } });
  const won = await prisma.contact.count({ where: { status: "WON" } });
  const lost = await prisma.contact.count({ where: { status: "LOST" } });

  return { total, leads, contacted, qualified, won, lost };
}

export async function deleteContact(id: string) {
  return await prisma.contact.delete({
    where: { id }
  });
}

export async function getContactsByStatus(status: string) {
  return await prisma.contact.findMany({
    where: { status },
    orderBy: { updatedAt: "desc" },
    include: {
      interactions: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });
}

export async function updateContactStatus(id: string, status: string) {
  return await prisma.contact.update({
    where: { id },
    data: { status }
  });
}

export async function getAllContactsWithInteractions() {
  return await prisma.contact.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      interactions: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
}
