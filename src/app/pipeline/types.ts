export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  meters: number | null;
  description: string | null;
  value: number | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  source: string | null;
  campaign: string | null;
  tipologia: string | null;
  tasks?: { 
    id: string; 
    title: string; 
    description: string | null; 
    dueDate: string | null; 
    priority: string; 
    category: string; 
    completed: boolean;
    createdAt: string;
  }[];
  interactions: { id: string; type: string; content: string; createdAt: string }[];
}

export interface Column {
  id: string;
  name: string;
  title: string;
  color: string;
  order: number;
  fixed?: boolean;
}
