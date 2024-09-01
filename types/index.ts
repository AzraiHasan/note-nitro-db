// types\index.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  status: 'Draft' | 'In Progress' | 'Completed';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}