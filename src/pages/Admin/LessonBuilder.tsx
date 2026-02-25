"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, 
  Type, AlignLeft, Image as ImageIcon, MousePointer2, 
  ChevronRight, ChevronLeft, Loader2, FileText, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonBlock, LessonPage, BlockType } from '@/types/lesson';
import { supabase } from '@/integrations/supabase/client';

const LessonBuilder = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const { toast } = useToast();
  
  const [lessonTitle, setLessonTitle] = useState('New Atomic Ritual');
  const [pages, setPages] = useState<LessonPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!!lessonId);

  useEffect(() => {
    if (lessonId) {
      fetchLesson();
    } else {
      setPages([{
        id: crypto.randomUUID(),
        title: 'Introduction',
        blocks: [{ type: 'heading', value: 'Welcome to the path' }]
      }]);
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { data: lesson, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      setLessonTitle(lesson.title);
      setPages(lesson.content || []);
    } catch (err: any) {
      toast({ title: "Failed to load", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      // Using full hardcoded URL as per system guidelines
      const response = await fetch('https://xywbivdtaurgtzbinnss.supabase.co/functions/v1/save-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d2JpdmR0YXVyZ3R6YmlubnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjA3MzQsImV4cCI6MjA4NzQzNjczNH0.fziZ2CMouROZq2TvORJ_iNiikzKhM6Fe_3F3tsnbiGk'
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          title: lessonTitle,
          content: pages,
          order: 1
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save lesson");
      }

      toast({ title: "lesson published." });
      navigate('/admin/courses');
    } catch (err: any) {
      console.error("[LessonBuilder] Save error:", err);
      toast({ 
        title: "save failed", 
        description: err.message || "Check console for details.", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addPage = () => {
    const newPage: LessonPage = {
      id: crypto.randomUUID(),
      title: `Page ${pages.length + 1}`,
      blocks: []
    };
    setPages([...pages, newPage]);
    setActivePageIndex(pages.length);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      toast({ title: "cannot delete", description: "a lesson must have at least one page.", variant: "destructive" });
      return;
    }
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    if (activePageIndex >= newPages.length) {
      setActivePageIndex(newPages.length - 1);
    }
  };

  const updatePageTitle = (value: string) => {
    const newPages = [...pages];
    newPages[activePageIndex].title = value;
    setPages(newPages);
  };

  const addBlock = (type: BlockType) => {
    const newPages = [...pages];
    newPages[activePageIndex].blocks.push({ type, value: '' });
    setPages(newPages);
  };

  const updateBlock = (blockIndex: number, value: string) => {
    const newPages = [...pages];
    newPages[activePageIndex].blocks[blockIndex].value = value;
    setPages(newPages);
  };

  const deleteBlock = (blockIndex: number) => {
    const newPages = [...pages];
    newPages[activePageIndex].blocks = newPages[activePageIndex].blocks.filter((_, i) => i !== blockIndex);
    setPages(newPages);
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const activePage = pages[activePageIndex];

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[100] font-sans">
      <header className="h-20 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/courses')} className="rounded-full text-zinc-500">
            <ArrowLeft size={24} />
          </Button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">lesson title</span>
            <input 
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="bg-transparent border-none text-xl font-black tracking-tighter lowercase outline-none w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-zinc-200 h-11 px-6 rounded-xl font-black lowercase gap-2">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            publish lesson
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Pages Sidebar */}
        <aside className="w-72 border-r border-zinc-900 bg-zinc-950/50 flex flex-col shrink-0">
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">lesson pages</h3>
            <Button variant="ghost" size="icon" onClick={addPage} className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900">
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {pages.map((page, idx) => (
              <div 
                key={page.id}
                onClick={() => setActivePageIndex(idx)}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                  activePageIndex === idx 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                <FileText size={16} className={cn(activePageIndex === idx ? "text-black" : "text-zinc-700")} />
                <span className="flex-1 text-xs font-bold lowercase truncate">{page.title}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deletePage(idx); }}
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    activePageIndex === idx ? "text-black/40 hover:text-black" : "text-zinc-700 hover:text-red-500"
                  )}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 overflow-y-auto bg-black custom-scrollbar">
          <div className="max-w-3xl mx-auto py-20 px-8 space-y-12">
            {/* Page Header Editor */}
            <div className="space-y-4 border-b border-zinc-900 pb-12">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">page title</span>
              <Input 
                value={activePage?.title || ''}
                onChange={(e) => updatePageTitle(e.target.value)}
                className="bg-transparent border-none text-5xl font-black tracking-tighter lowercase p-0 h-auto focus-visible:ring-0"
                placeholder="Enter page title..."
              />
            </div>

            {/* Blocks List */}
            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {activePage?.blocks.map((block, idx) => (
                  <motion.div 
                    key={idx}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2rem] space-y-4 hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-zinc-800" />
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{block.type}</span>
                      </div>
                      <button 
                        onClick={() => deleteBlock(idx)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {block.type === 'heading' || block.type === 'button' ? (
                      <Input 
                        value={block.value} 
                        onChange={(e) => updateBlock(idx, e.target.value)}
                        className="bg-zinc-950 border-zinc-800 h-14 rounded-xl text-lg font-bold lowercase focus:border-white transition-all"
                        placeholder={`Enter ${block.type} text...`}
                      />
                    ) : (
                      <Textarea 
                        value={block.value} 
                        onChange={(e) => updateBlock(idx, e.target.value)}
                        className="bg-zinc-950 border-zinc-800 min-h-[120px] rounded-xl text-base lowercase focus:border-white transition-all leading-relaxed"
                        placeholder={`Enter ${block.type} content...`}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {activePage?.blocks.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
                  <p className="text-zinc-700 font-bold uppercase tracking-widest text-[10px]">this page is empty. add blocks below.</p>
                </div>
              )}
            </div>

            {/* Add Block Controls */}
            <div className="pt-12 border-t border-zinc-900">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={() => addBlock('heading')} variant="outline" className="h-14 rounded-xl border-zinc-800 hover:bg-zinc-900 lowercase font-bold gap-2">
                  <Type size={16} className="text-zinc-500" /> Heading
                </Button>
                <Button onClick={() => addBlock('paragraph')} variant="outline" className="h-14 rounded-xl border-zinc-800 hover:bg-zinc-900 lowercase font-bold gap-2">
                  <AlignLeft size={16} className="text-zinc-500" /> Paragraph
                </Button>
                <Button onClick={() => addBlock('image')} variant="outline" className="h-14 rounded-xl border-zinc-800 hover:bg-zinc-900 lowercase font-bold gap-2">
                  <ImageIcon size={16} className="text-zinc-500" /> Image URL
                </Button>
                <Button onClick={() => addBlock('button')} variant="outline" className="h-14 rounded-xl border-zinc-800 hover:bg-zinc-900 lowercase font-bold gap-2">
                  <MousePointer2 size={16} className="text-zinc-500" /> Button
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonBuilder;