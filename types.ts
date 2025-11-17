
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
}

export type Category = 'All Categories' | 'Development' | 'Programming' | 'Design' | 'System Admin' | 'Database' | 'DevOps' | 'Tools';
