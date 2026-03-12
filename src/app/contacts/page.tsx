import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getContacts, deleteContact } from "@/actions/contacts"
import Link from "next/link"

export default async function ContactsPage() {
  const contacts = await getContacts();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
          <p className="text-muted-foreground">Gestiona tus leads y clientes aquí.</p>
        </div>
        <Button asChild>
          <Link href="/contacts/new">Agregar Contacto</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact: any) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${contact.status === 'WON' ? 'bg-green-100 text-green-800' : 
                      contact.status === 'LEAD' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {contact.status}
                  </span>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="sm">Ver Detalles</Button>
                  <form action={async () => {
                    "use server";
                    await deleteContact(contact.id);
                  }}>
                    <Button variant="destructive" size="sm" type="submit">Eliminar</Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
