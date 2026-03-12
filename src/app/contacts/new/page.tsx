import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createContact } from "@/actions/contacts";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function NewContactPage() {
  async function onSubmit(formData: FormData) {
    "use server";
    
    await createContact({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
    });
    
    redirect("/contacts");
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Contacto</h2>
          <p className="text-muted-foreground">Ingresa los datos del nuevo lead.</p>
        </div>
        <Button variant={"outline"} asChild>
          <Link href="/contacts">Volver</Link>
        </Button>
      </div>

      <form action={onSubmit} className="space-y-4 rounded-md border bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre / Razón Social <span className="text-red-500">*</span></Label>
          <Input id="name" name="name" placeholder="Ej: Acme Corp" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" name="email" type="email" placeholder="contacto@acme.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Empresa (si aplica)</Label>
          <Input id="company" name="company" placeholder="Acme Inc." />
        </div>
        <div className="pt-4 flex justify-end">
          <Button type="submit">Guardar Contacto</Button>
        </div>
      </form>
    </div>
  );
}
