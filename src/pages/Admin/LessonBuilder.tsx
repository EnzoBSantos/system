"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical, 
  Type, AlignLeft, Image as ImageIcon, MousePointer2, 
  ChevronRight, ChevronLeft, Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonBlock, LessonPage, BlockType } from '@/types/lesson-builder';
import { supabase } from '@/integrations/supabase/client';

const INITIAL_PAGES: LessonPage[] = [
  {
    id: '1',
    title: 'The 1% Rule',
    blocks: [
      { id: 'b1', type: 'HEADING', content: 'Small Steps, Big Results' },
      { id: 'b2', type: 'TEXT', content: 'Forget about big changes. If you get 1% better each day for one year, you’ll end up thirty-seven times better by the time you’re done.' },
      { id: 'b3', type: 'IMAGE', content: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop' },
      { id: 'b4', type: 'BUTTON', content: 'Proceed to Mastery' }
    ]
  },
  {
    id: '2',
    title: 'Identity over Outcomes',
    blocks: [
      { id: 'b5', type: 'HEADING', content: 'Identity-Based Habits' },
      { id: 'b6', type: 'TEXT', content: 'The ultimate form of intrinsic motivation is when a habit becomes part of your identity. It’s one thing to say I’m the type of person who wants this. It’s something quite different to say I’m the type of person who is this.' },
      { id: 'b7', type: 'BUTTON', content: 'Continue Flow' }
    ]
  }
];

const LessonBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessonTitle, setLessonTitle] = useState('New Atomic Ritual');
  const [pages, setPages] = useState<LessonPage[]>(INITIAL_PAGES);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const activePage = pages[activePageIndex];

  const addPage = () => {
    const newPage: LessonPage = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Page ${pages.length + 1}`,
      blocks: [{ id: Date.now().toString(), type: 'HEADING', content: '' }]
    };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
  };

  const removePage = (index: number) => {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    setActivePageIndex(Math.max(0, index - 1));
  };

  const addBlock = (type: BlockType) => {
    const newBlock: LessonBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      placeholder: type === 'HEADING' ? 'enter title...' : type === 'TEXT' ? 'share the wisdom...' : type === 'IMAGE' ? 'image url...' : 'button text...'
    };
    const newPages = [...pages];
    newPages[activePageIndex].blocks.push(newBlock);
    setPages(newPages);
  };

  const updateBlock = (blockId: string, content: string) => {
    const newPages = [...pages];
    const blockIndex = newPages[activePageIndex].blocks.findIndex(b => b.id === blockId);
    if (blockIndex !== -1) {
      newPages[activePageIndex].blocks[blockIndex].content = content;
      setPages(newPages);
    }
  };

  const removeBlock = (blockId: string) => {
    const newPages = [...pages];
    newPages[activePageIndex].blocks = newPages[activePageIndex].blocks.filter(b => b.id !== blockId);
    setPages(newPages);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Mock save delay
    await new Promise(r => setTimeout(r, 1000));
    toast({ title: "lesson architected.", description: "the knowledge is now preserved." });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[100] font-sans">
      {/* Top Bar */}
      <header className="h-24 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/courses')}
            className="rounded-full text-zinc-500 hover:text-white"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">architecting lesson</p>
            <input 
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="bg-transparent border-none text-2xl font-black tracking-tighter lowercase focus:ring-0 px-0 outline-none w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/courses')}
            className="text-zinc-500 font-bold lowercase hover:text-white"
          >
            cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-black hover:bg-zinc-200 h-12 px-8 rounded-2xl font-black lowercase gap-2 shadow-lg"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            save lesson
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Navigator */}
        <aside className="w-80 border-r border-zinc-900 bg-zinc-950/30 flex flex-col shrink-0">
          <div className="p-6 border-b border-zinc-900">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">page sequence</h3>
            <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {pages.map((page, idx) => (
                  <motion.div
                    key={page.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      "group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border",
                      activePageIndex === idx 
                        ? "bg-white text-black border-white shadow-xl" 
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                    )}
                    onClick={() => setActivePageIndex(idx)}
                  >
                    <span className="text-[10px] font-black uppercase opacity-50">{idx + 1}</span>
                    <span className="flex-1 font-bold lowercase truncate">{page.blocks[0]?.content || `untitled ${idx + 1}`}</span>
                    {pages.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removePage(idx); }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button 
              onClick={addPage}
              className="w-full mt-6 h-12 rounded-xl bg-zinc-900 border border-dashed border-zinc-800 text-zinc-500 hover:text-white hover:border-white transition-all lowercase gap-2"
            >
              <Plus size={16} /> add new page
            </Button>
          </div>
          
          <div className="p-6 mt-auto">
             <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">editor tips</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed italic lowercase">"atomic habits are small actions that lead to remarkable results. design your lesson to flow naturally."</p>
            </div>
          </div>
        </aside>

        {/* Main Canvas: Editor */}
        <main className="flex-1 overflow-y-auto bg-black p-12 md:p-20 custom-scrollbar relative">
          <div className="max-w-3xl mx-auto space-y-12 pb-32">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500">
                  {activePageIndex + 1}
                </div>
                <h2 className="text-3xl font-black tracking-tighter lowercase">edit page {activePageIndex + 1}.</h2>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  disabled={activePageIndex === 0}
                  onClick={() => setActivePageIndex(prev => prev - 1)}
                  className="rounded-xl h-10 w-10 p-0 text-zinc-500 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button 
                  variant="ghost" 
                  disabled={activePageIndex === pages.length - 1}
                  onClick={() => setActivePageIndex(prev => prev + 1)}
                  className="rounded-xl h-10 w-10 p-0 text-zinc-500 hover:text-white"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </header>

            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {activePage.blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative group bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 hover:border-white/10 transition-all"
                  >
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <GripVertical size={20} className="text-zinc-700" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {block.type === 'HEADING' && <Type size={12} />}
                        {block.type === 'TEXT' && <AlignLeft size={12} />}
                        {block.type === 'IMAGE' && <ImageIcon size={12} />}
                        {block.type === 'BUTTON' && <MousePointer2 size={12} />}
                        {block.type}
                      </div>
                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="text-zinc-800 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {block.type === 'HEADING' && (
                      <Input 
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="page heading..."
                        className="text-4xl font-black bg-transparent border-none focus:ring-0 p-0 h-auto tracking-tighter lowercase placeholder:text-zinc-800"
                      />
                    )}

                    {block.type === 'TEXT' && (
                      <Textarea 
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="write your wisdom..."
                        className="bg-transparent border-none focus:ring-0 p-0 min-h-[100px] text-lg font-medium lowercase placeholder:text-zinc-800 leading-relaxed resize-none"
                      />
                    )}

                    {block.type === 'IMAGE' && (
                      <div className="space-y-4">
                        <Input 
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          placeholder="unsplash image url..."
                          className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12 lowercase"
                        />
                        {block.content && (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                            <img 
                              src={block.content} 
                              alt="Preview" 
                              className="w-full h-full object-cover opacity-80"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'BUTTON' && (
                      <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <Input 
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            placeholder="button label..."
                            className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12 lowercase font-bold"
                          />
                        </div>
                        <div className="px-6 py-3 bg-white text-black rounded-xl font-bold lowercase text-sm shadow-lg pointer-events-none">
                          {block.content || 'preview'}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Block Adder Menu */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[110] bg-zinc-950/90 backdrop-blur-2xl border border-white/5 p-3 rounded-[2.5rem] shadow-2xl flex items-center gap-2">
              <Button onClick={() => addBlock('HEADING')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase">
                <Type size={18} /> heading
              </Button>
              <Button onClick={() => addBlock('TEXT')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase">
                <AlignLeft size={18} /> paragraph
              </Button>
              <Button onClick={() => addBlock('IMAGE')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase">
                <ImageIcon size={18} /> image
              </Button>
              <Button onClick={() => addBlock('BUTTON')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase">
                <MousePointer2 size={18} /> action
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonBuilder;