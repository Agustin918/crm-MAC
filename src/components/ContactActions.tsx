'use client';

import { MessageSquare, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WHATSAPP_NUMBER = '5491112345678';
const COMPANY_NAME = 'Estudio de Arquitectura';

interface ContactActionsProps {
  name: string;
  email?: string | null;
  phone?: string | null;
  meters?: number | null;
  status?: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  LEAD: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  MEETING: 'bg-violet-500',
  QUALIFIED: 'bg-orange-500',
  QUOTE: 'bg-purple-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
};

export function ContactActions({ name, email, phone, meters, status }: ContactActionsProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const getWhatsAppLink = (meters?: number | null) => {
    const metersText = meters ? `de ${meters} m²` : '';
    const message = encodeURIComponent(`Hola ${name.split(' ')[0]}, soy Agustín del ${COMPANY_NAME}.\n\nTe contacto por tu consulta${metersText}.\n\n¿Te parece si coordinamos una llamada para conversar sobre tu proyecto?`);
    return `https://wa.me/${formatPhone(phone || WHATSAPP_NUMBER)}?text=${message}`;
  };

  const getEmailLink = () => {
    const subject = encodeURIComponent(`Contacto desde ${COMPANY_NAME}`);
    const body = encodeURIComponent(`Hola ${name},\n\nGracias por contactarte con ${COMPANY_NAME}.\n\n¿En qué podemos ayudarte?\n\nSaludos`);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const getPhoneLink = () => {
    return `tel:${formatPhone(phone || '')}`;
  };

  return (
    <div className="flex items-center gap-1">
      {phone && (
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          className="h-8 w-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10"
        >
          <a
            href={getWhatsAppLink(meters)}
            target="_blank"
            rel="noopener noreferrer"
            title="Enviar WhatsApp"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
        </Button>
      )}
      
      {phone && (
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        >
          <a
            href={getPhoneLink()}
            title="Llamar"
          >
            <Phone className="h-4 w-4" />
          </a>
        </Button>
      )}

      {email && (
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <a
            href={getEmailLink()}
            title="Enviar Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
