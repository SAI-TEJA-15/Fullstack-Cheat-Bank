
export interface Command {
  command: string;
  description: string;
}

export interface CheatSheetSection {
  title: string;
  commands: Command[];
}

export interface CheatSheet {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: {
    name: string;
  };
  stats: {
    views: number;
    downloads: number;
  };
  createdAt: string;
  content: CheatSheetSection[];
  status?: 'pending' | 'approved' | 'rejected';
  submittedBy?: number;
  approvedBy?: number | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export type Category = 'All Categories' | 'Development' | 'Programming' | 'Design' | 'System Admin' | 'Database' | 'DevOps' | 'Tools';

export const categories: Category[] = ['All Categories', 'Development', 'Programming', 'Design', 'System Admin', 'Database', 'DevOps', 'Tools'];
