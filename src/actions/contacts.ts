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
  return await prisma.contact.create({
    data
  });
}

export async function getStats() {
  const total = await prisma.contact.count();
  const leads = await prisma.contact.count({ where: { status: "LEAD" } });
  const contacted = await prisma.contact.count({ where: { status: "CONTACTED" } });
  const won = await prisma.contact.count({ where: { status: "WON" } });

  return { total, leads, contacted, won };
}

export async function deleteContact(id: string) {
  return await prisma.contact.delete({
    where: { id }
  });
}
