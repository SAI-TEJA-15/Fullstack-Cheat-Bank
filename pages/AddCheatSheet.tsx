import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, NewCheatSheetPayload } from '../App';
import { categories } from '../data/mockData';
import { CheatSheetSection, Command, Category } from '../types';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="block w-full bg-surface border border-surface-light rounded-md py-2 px-3 text-sm placeholder-text-secondary focus:outline-none focus:text-text-primary focus:ring-1 focus:ring-primary" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className="block w-full bg-surface border border-surface-light rounded-md py-2 px-3 text-sm placeholder-text-secondary focus:outline-none focus:text-text-primary focus:ring-1 focus:ring-primary" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
     <select {...props} className="block w-full bg-surface border border-surface-light rounded-md py-2 px-3 text-sm placeholder-text-secondary focus:outline-none focus:text-text-primary focus:ring-1 focus:ring-primary" />
);

const AddCheatSheet: React.FC = () => {
    const navigate = useNavigate();
    const { addCheatSheet } = useContext(AppContext);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Category>('Development');
    const [authorName, setAuthorName] = useState('');
    const [tags, setTags] = useState('');
    const [sections, setSections] = useState<CheatSheetSection[]>([
        { title: '', commands: [{ command: '', description: '' }] }
    ]);

    const handleSectionChange = (index: number, value: string) => {
        const newSections = [...sections];
        newSections[index].title = value;
        setSections(newSections);
    };

    const handleCommandChange = (sectionIndex: number, commandIndex: number, field: keyof Command, value: string) => {
        const newSections = [...sections];
        newSections[sectionIndex].commands[commandIndex][field] = value;
        setSections(newSections);
    };

    const addSection = () => {
        setSections([...sections, { title: '', commands: [{ command: '', description: '' }] }]);
    };

    const removeSection = (index: number) => {
        if (sections.length > 1) {
            setSections(sections.filter((_, i) => i !== index));
        }
    };

    const addCommand = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].commands.push({ command: '', description: '' });
        setSections(newSections);
    };

    const removeCommand = (sectionIndex: number, commandIndex: number) => {
        const newSections = [...sections];
        if (newSections[sectionIndex].commands.length > 1) {
            newSections[sectionIndex].commands = newSections[sectionIndex].commands.filter((_, i) => i !== commandIndex);
            setSections(newSections);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newSheet: NewCheatSheetPayload = {
            title,
            description,
            category,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            author: { name: authorName },
            content: sections,
        };
        
        addCheatSheet(newSheet);
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-text-primary mb-8">Create New Cheat Sheet</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-surface p-8 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Docker Commands" />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-text-secondary mb-1">Author Name</label>
                        <Input id="author" value={authorName} onChange={e => setAuthorName(e.target.value)} required placeholder="e.g., CloudMaster" />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="A brief summary of the cheat sheet..." />
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                        <Select id="category" value={category} onChange={e => setCategory(e.target.value as Category)}>
                            {categories.filter(c => c !== 'All Categories').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </Select>
                    </div>
                     <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
                        <Input id="tags" value={tags} onChange={e => setTags(e.target.value)} required placeholder="e.g., docker, devops, cli" />
                    </div>
                </div>

                <hr className="border-surface-light" />

                <div>
                    <h2 className="text-xl font-bold text-text-primary mb-4">Content Sections</h2>
                    <div className="space-y-6">
                        {sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="bg-surface-light p-4 rounded-lg space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Section Title</label>
                                        <Input value={section.title} onChange={e => handleSectionChange(sectionIndex, e.target.value)} placeholder={`Section ${sectionIndex + 1} Title`} required />
                                    </div>
                                    <button type="button" onClick={() => removeSection(sectionIndex)} className="text-red-400 hover:text-red-300 mt-6 disabled:opacity-50" disabled={sections.length === 1}>
                                        <i className="fa-solid fa-trash fa-lg"></i>
                                    </button>
                                </div>
                                {section.commands.map((command, commandIndex) => (
                                     <div key={commandIndex} className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Command</label>
                                            <Input value={command.command} onChange={e => handleCommandChange(sectionIndex, commandIndex, 'command', e.target.value)} placeholder="e.g., docker ps -a" required/>
                                        </div>
                                        <div className="flex-1">
                                             <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                                            <Input value={command.description} onChange={e => handleCommandChange(sectionIndex, commandIndex, 'description', e.target.value)} placeholder="List all containers" required/>
                                        </div>
                                        <button type="button" onClick={() => removeCommand(sectionIndex, commandIndex)} className="text-red-400 hover:text-red-300 pb-2 disabled:opacity-50" disabled={section.commands.length === 1}>
                                            <i className="fa-solid fa-minus-circle"></i>
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addCommand(sectionIndex)} className="text-sm text-primary hover:text-accent font-semibold flex items-center gap-2">
                                    <i className="fa-solid fa-plus"></i> Add Command
                                </button>
                            </div>
                        ))}
                         <button type="button" onClick={addSection} className="w-full text-center bg-surface-light hover:bg-surface-light/50 text-text-primary py-2 px-4 rounded-md transition-colors duration-200 font-semibold">
                            Add Section
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                     <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-surface-light text-sm font-medium rounded-md text-text-primary bg-surface hover:bg-surface-light">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover">
                        Create Cheat Sheet
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCheatSheet;
