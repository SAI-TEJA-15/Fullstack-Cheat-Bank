
import { CheatSheet, Category } from '../types';

export const categories: Category[] = ['All Categories', 'Development', 'Programming', 'Design', 'System Admin', 'Database', 'DevOps', 'Tools'];

export const cheatSheets: CheatSheet[] = [
  {
    id: 1,
    title: 'Git Commands...',
    description: 'Essential Git commands for version control. Covers basic operations, branching, merging, and advanced workflows.',
    category: 'Development',
    tags: ['git', 'version-control', 'cli', 'development', 'workflow'],
    author: { name: 'DevMaster' },
    stats: { views: 45230, downloads: 15420 },
    createdAt: '2024-01-15',
    content: [
      {
        title: 'Basic Commands',
        commands: [
          { command: 'git init', description: 'Initialize a new Git repository' },
          { command: 'git clone <url>', description: 'Clone a repository from remote' },
          { command: 'git add .', description: 'Add all files to staging area' },
          { command: 'git commit -m "message"', description: 'Commit changes with message' },
          { command: 'git push', description: 'Push changes to remote repository' },
          { command: 'git pull', description: 'Pull latest changes from remote' },
        ],
      },
      {
        title: 'Branching',
        commands: [
          { command: 'git branch', description: 'List all branches' },
          { command: 'git branch <name>', description: 'Create new branch' },
          { command: 'git checkout <branch>', description: 'Switch to branch' },
          { command: 'git merge <branch>', description: 'Merge branch into current' },
          { command: 'git branch -d <branch>', description: 'Delete branch' },
        ],
      },
      {
        title: 'Status & History',
        commands: [
          { command: 'git status', description: 'Show working directory status' },
          { command: 'git log', description: 'Show commit history' },
          { command: 'git diff', description: 'Show changes between commits' },
          { command: 'git show <commit>', description: 'Show specific commit details' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'JavaScript ES6+...',
    description: 'Modern JavaScript features including arrow functions, destructuring, promises, and async/await for cleaner code.',
    category: 'Programming',
    tags: ['javascript', 'es6', 'modern-js', 'frontend'],
    author: { name: 'CodeGuru' },
    stats: { views: 67890, downloads: 23150 },
    createdAt: '2024-02-20',
    content: [
      {
        title: 'Variables',
        commands: [
          { command: 'let variable = value', description: 'Block-scoped variable.' },
          { command: 'const constant = value', description: 'Block-scoped constant.' },
        ]
      },
      {
        title: 'Arrow Functions',
        commands: [
          { command: 'const fn = () => {}', description: 'Shorter function syntax.' },
          { command: '(p1, p2) => p1 + p2', description: 'Implicit return for single expressions.' },
        ]
      },
      {
        title: 'Destructuring',
        commands: [
          { command: 'const { a, b } = obj', description: 'Object destructuring.' },
          { command: 'const [x, y] = arr', description: 'Array destructuring.' },
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'CSS Flexbox Guide',
    description: 'Complete flexbox reference with examples. Master responsive layouts with ease using this powerful CSS module.',
    category: 'Design',
    tags: ['css', 'flexbox', 'layout', 'frontend', 'design'],
    author: { name: 'UIExpert' },
    stats: { views: 52340, downloads: 18750 },
    createdAt: '2024-03-10',
     content: [
      {
        title: 'Container Properties',
        commands: [
          { command: 'display: flex;', description: 'Defines a flex container.' },
          { command: 'flex-direction: row | column;', description: 'Sets the main axis direction.' },
          { command: 'justify-content: center;', description: 'Aligns items along the main axis.' },
          { command: 'align-items: center;', description: 'Aligns items along the cross axis.' },
        ]
      },
    ]
  },
  {
    id: 4,
    title: 'Linux Commands...',
    description: 'Essential Linux/Unix commands for system administration, file management, and process control.',
    category: 'System Admin',
    tags: ['linux', 'command-line', 'bash', 'sysadmin'],
    author: { name: 'SysAdmin Pro' },
    stats: { views: 38920, downloads: 12890 },
    createdAt: '2023-12-05',
    content: [
       {
        title: 'File System',
        commands: [
          { command: 'ls -l', description: 'List files in long format.' },
          { command: 'cd /path/to/dir', description: 'Change directory.' },
          { command: 'pwd', description: 'Print working directory.' },
          { command: 'mkdir new_dir', description: 'Create a new directory.' },
        ]
      },
    ]
  },
  {
    id: 5,
    title: 'Python Data Structures',
    description: 'Python built-in data structures: lists, dictionaries, sets, tuples with methods and examples.',
    category: 'Programming',
    tags: ['python', 'data-structures', 'programming', 'backend'],
    author: { name: 'PythonNinja' },
    stats: { views: 58470, downloads: 19620 },
    createdAt: '2024-04-01',
    content: [
       {
        title: 'Lists',
        commands: [
          { command: 'my_list.append(item)', description: 'Add item to end of list.' },
          { command: 'my_list.pop()', description: 'Remove and return last item.' },
          { command: 'len(my_list)', description: 'Get number of items in list.' },
        ]
      },
    ]
  },
  {
    id: 6,
    title: 'React Hooks Reference',
    description: 'Complete guide to React Hooks including useState, useEffect, useContext, and creating custom hooks.',
    category: 'Development',
    tags: ['react', 'hooks', 'frontend', 'javascript'],
    author: { name: 'ReactPro' },
    stats: { views: 63820, downloads: 21340 },
    createdAt: '2024-05-11',
    content: [
       {
        title: 'Basic Hooks',
        commands: [
          { command: "const [state, setState] = useState(initial);", description: 'State hook.' },
          { command: "useEffect(() => { /* effect */ });", description: 'Effect hook.' },
          { command: "const context = useContext(MyContext);", description: 'Context hook.' },
        ]
      },
    ]
  },
  {
    id: 7,
    title: 'SQL Query Cheat Sheet',
    description: 'Essential SQL queries for data manipulation, joins, aggregations, and common database operations.',
    category: 'Database',
    tags: ['sql', 'database', 'queries', 'data'],
    author: { name: 'DataExpert' },
    stats: { views: 49230, downloads: 16780 },
    createdAt: '2023-11-22',
    content: [
       {
        title: 'Data Manipulation',
        commands: [
          { command: "SELECT * FROM table;", description: 'Select all records.' },
          { command: "INSERT INTO table (col1) VALUES (val1);", description: 'Insert a new record.' },
          { command: "UPDATE table SET col1 = val1 WHERE id = 1;", description: 'Update a record.' },
        ]
      },
    ]
  },
  {
    id: 8,
    title: 'Docker Commands',
    description: 'Docker containerization commands for building, running, and managing containers and images.',
    category: 'DevOps',
    tags: ['docker', 'containers', 'devops', 'deployment'],
    author: { name: 'CloudMaster' },
    stats: { views: 41680, downloads: 13450 },
    createdAt: '2024-01-30',
    content: [
       {
        title: 'Images & Containers',
        commands: [
          { command: "docker build -t name:tag .", description: 'Build an image.' },
          { command: "docker run -d -p 80:80 name:tag", description: 'Run a container.' },
          { command: "docker ps -a", description: 'List all containers.' },
        ]
      },
    ]
  },
  {
    id: 9,
    title: 'Regex Patterns',
    description: 'Common regular expression patterns for text matching, validation, and string manipulation tasks.',
    category: 'Programming',
    tags: ['regex', 'patterns', 'text-processing', 'validation'],
    author: { name: 'RegexGuru' },
    stats: { views: 34560, downloads: 11230 },
    createdAt: '2024-03-25',
     content: [
       {
        title: 'Common Patterns',
        commands: [
          { command: "/^\\d+$/", description: 'Match an integer.' },
          { command: "/\\S+@\\S+\\.\\S+/", description: 'Match an email address.' },
          { command: "/(https?:\\/\\/)?(www\\.)?[\\w-]+\\.[\\w-]+/", description: 'Match a URL.' },
        ]
      },
    ]
  },
  {
    id: 10,
    title: 'VS Code Shortcuts',
    description: 'Productivity shortcuts and extensions for Visual Studio Code editor to boost your development workflow.',
    category: 'Tools',
    tags: ['vscode', 'shortcuts', 'editor', 'productivity'],
    author: { name: 'DevTools' },
    stats: { views: 61240, downloads: 20150 },
    createdAt: '2024-02-15',
     content: [
       {
        title: 'Editing',
        commands: [
          { command: "Ctrl+D", description: 'Select next occurrence.' },
          { command: "Ctrl+Shift+L", description: 'Select all occurrences.' },
          { command: "Alt+Up/Down", description: 'Move line up/down.' },
        ]
      },
    ]
  },
  {
    id: 11,
    title: 'Tailwind CSS Classes',
    description: 'Essential Tailwind CSS utility classes for rapid UI development and responsive design.',
    category: 'Design',
    tags: ['tailwind', 'css', 'utility', 'frontend'],
    author: { name: 'UIWizard' },
    stats: { views: 53670, downloads: 17890 },
    createdAt: '2024-04-18',
     content: [
       {
        title: 'Layout',
        commands: [
          { command: "flex items-center justify-center", description: 'Center content in a flex container.' },
          { command: "grid grid-cols-3 gap-4", description: 'Create a 3-column grid.' },
          { command: "p-4 m-2", description: 'Apply padding and margin.' },
        ]
      },
    ]
  },
  {
    id: 12,
    title: 'Vim Commands',
    description: 'Essential Vim commands for navigation, editing, and advanced text manipulation in the Vim editor.',
    category: 'Tools',
    tags: ['vim', 'editor', 'commands', 'cli'],
    author: { name: 'VimNinja' },
    stats: { views: 29870, downloads: 9870 },
    createdAt: '2023-10-10',
    content: [
       {
        title: 'Navigation',
        commands: [
          { command: "h, j, k, l", description: 'Move left, down, up, right.' },
          { command: "w / b", description: 'Move forward/backward by word.' },
          { command: "gg / G", description: 'Go to start/end of file.' },
        ]
      },
    ]
  },
];
