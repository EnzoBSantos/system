"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
        id: 'temp-1',
        title: 'Introduction',
        blocks: [{ id: 'b1', type: 'HEADING', content: 'Welcome' }]
      }]);
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('title, exercises(*)')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      setLessonTitle(lesson.title);
      
      if (lesson.exercises && lesson.exercises.length > 0) {
        const sortedExercises = [...lesson.exercises].sort((a, b) => a.order - b.order);
        const fetchedPages = sortedExercises.map(ex => ({
          id: ex.id,
          title: ex.content?.title || 'Untitled Page',
          blocks: ex.content?.blocks || []
        }));
        setPages(fetchedPages);
      } else {
        setPages([{ id: 'temp-1', title: 'Introduction', blocks: [] }]);
      }
    } catch (err: any) {
      console.error("[LessonBuilder] Load error:", err);
      toast({ title: "Failed to load lesson", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const activePage = pages[activePageIndex];

  const addPage = () => {
    const newPage: LessonPage = {
      id: `temp-${Date.now()}`,
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
    if (!courseId && !lessonId) {
      toast({ title: "context required", description: "please select a course first.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      let currentLessonId = lessonId;

      if (!currentLessonId && courseId) {
        let { data: units } = await supabase.from('units').select('id').eq('course_id', courseId).order('order', { ascending: true }).limit(1);
        let unitId = units?.[0]?.id;

        if (!unitId) {
          const { data: newUnit, error: unitError } = await supabase.from('units').insert({
            course_id: courseId,
            title: 'foundation',
            order: 1
          }).select().single();
          if (unitError) throw unitError;
          unitId = newUnit.id;
        }

        const { data: newLesson, error: lessonError } = await supabase.from('lessons').insert({
          unit_id: unitId,
          title: lessonTitle.trim() || 'untitled ritual',
          order: 1,
          xp_reward: 50
        }).select().single();
        if (lessonError) throw lessonError;
        currentLessonId = newLesson.id;
      } else if (currentLessonId) {
        const { error: lessonUpdateError } = await supabase.from('lessons').update({ title: lessonTitle }).eq('id', currentLessonId);
        if (lessonUpdateError) throw lessonUpdateError;
      }

      if (currentLessonId) {
        // Sync exercises (pages)
        const { error: delError } = await supabase.from('exercises').delete().eq('lesson_id', currentLessonId);
        if (delError) throw delError;
        
        const exerciseData = pages.map((page, idx) => ({
          lesson_id: currentLessonId,
          order: idx + 1,
          type: 'CONTENT',
          content: { title: page.title, blocks: page.blocks },
          correct_answer: 'N/A'
        }));

        if (exerciseData.length > 0) {
          const { error: insError } = await supabase.from('exercises').insert(exerciseData);
          if (insError) throw insError;
        }
      }

      toast({ title: "lesson published.", description: "the wisdom path is now updated." });
      navigate('/admin/courses');
    } catch (err: any) {
      console.error("[LessonBuilder] Save failed:", err);
      toast({ title: "sync failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[100] font-sans">
      <header className="h-24 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/courses')} className="rounded-full text-zinc-500 hover:text-white">
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
          <Button variant="ghost" onClick={() => navigate('/admin/courses')} className="text-zinc-500 font-bold lowercase hover:text-white">cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-zinc-200 h-12 px-8 rounded-2xl font-black lowercase gap-2 shadow-lg">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            publish lesson
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
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
                      activePageIndex === idx ? "bg-white text-black border-white shadow-xl" : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                    )}
                    onClick={() => setActivePageIndex(idx)}
                  >
                    <span className="text-[10px] font-black uppercase opacity-50">{idx + 1}</span>
                    <span className="flex-1 font-bold lowercase truncate">{page.blocks.find(b => b.type === 'HEADING')?.content || `page ${idx + 1}`}</span>
                    {pages.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); removePage(idx); }} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button onClick={addPage} className="w-full mt-6 h-12 rounded-xl bg-zinc-900 border border-dashed border-zinc-800 text-zinc-500 hover:text-white hover:border-white transition-all lowercase gap-2">
              <Plus size={16} /> add new page
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-black p-12 md:p-20 custom-scrollbar relative">
          <div className="max-w-3xl mx-auto space-y-12 pb-32">
            {activePage ? (
              <>
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500">{activePageIndex + 1}</div>
                    <h2 className="text-3xl font-black tracking-tighter lowercase">edit page {activePageIndex + 1}.</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" disabled={activePageIndex === 0} onClick={() => setActivePageIndex(prev => prev - 1)} className="rounded-xl h-10 w-10 p-0 text-zinc-500 hover:text-white"><ChevronLeft size={20} /></Button>
                    <Button variant="ghost" disabled={activePageIndex === pages.length - 1} onClick={() => setActivePageIndex(prev => prev - 1)} className="rounded-xl h-10 w-10 p-0 text-zinc-500 hover:text-white"><ChevronRight size={20} /></Button>
                  </div>
                </header>
                <div className="space-y-8">
                  {activePage.blocks.map((block) => (
                    <div key={block.id} className="relative group bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{block.type}</div>
                        <button onClick={() => removeBlock(block.id)} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                      {block.type === 'HEADING' && (
                        <Input value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="page heading..." className="text-4xl font-black bg-transparent border-none focus:ring-0 p-0 h-auto tracking-tighter lowercase placeholder:text-zinc-800" />
                      )}
                      {block.type === 'TEXT' && (
                        <Textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="write your wisdom..." className="bg-transparent border-none focus:ring-0 p-0 min-h-[100px] text-lg font-medium lowercase placeholder:text-zinc-800 leading-relaxed resize-none" />
                      )}
                      {block.type === 'IMAGE' && (
                        <Input value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="image url..." className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12 lowercase" />
                      )}
                      {block.type === 'BUTTON' && (
                        <Input value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} placeholder="button text..." className="bg-zinc-900/50 border-zinc-800 rounded-xl h-12 lowercase" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : <p className="text-center text-zinc-500">Select or create a page.</p>}

            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[110] bg-zinc-950/90 backdrop-blur-2xl border border-white/5 p-3 rounded-[2.5rem] shadow-2xl flex items-center gap-2">
              <Button onClick={() => addBlock('HEADING')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase"><Type size={18} /> heading</Button>
              <Button onClick={() => addBlock('TEXT')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase"><AlignLeft size={18} /> paragraph</Button>
              <Button onClick={() => addBlock('IMAGE')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase"><ImageIcon size={18} /> image</Button>
              <Button onClick={() => addBlock('BUTTON')} variant="ghost" className="h-14 px-6 rounded-2xl hover:bg-white hover:text-black gap-2 font-bold lowercase"><MousePointer2 size={18} /> action</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonBuilder;