"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, 
  Type, AlignLeft, Image as ImageIcon, MousePointer2, 
  ChevronRight, ChevronLeft, Loader2
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
        id: 'p1',
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
      const { data, error } = await supabase.functions.invoke('save-lesson', {
        body: {
          lessonId,
          courseId,
          title: lessonTitle,
          content: pages,
          order: 1
        }
      });

      if (error) throw error;

      toast({ title: "lesson published." });
      navigate('/admin/courses');
    } catch (err: any) {
      toast({ title: "save failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
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

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-[100] font-sans">
      <header className="h-24 border-b border-zinc-900 px-8 flex items-center justify-between bg-black/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/courses')} className="rounded-full text-zinc-500">
            <ArrowLeft size={24} />
          </Button>
          <input 
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="bg-transparent border-none text-2xl font-black tracking-tighter lowercase outline-none w-64"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-zinc-200 h-12 px-8 rounded-2xl font-black lowercase gap-2">
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          publish lesson
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-20">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-8">
            {pages[activePageIndex]?.blocks.map((block, idx) => (
              <div key={idx} className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 space-y-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{block.type}</span>
                {block.type === 'heading' || block.type === 'button' ? (
                  <Input 
                    value={block.value} 
                    onChange={(e) => updateBlock(idx, e.target.value)}
                    className="bg-transparent border-zinc-800 text-xl font-bold lowercase"
                    placeholder={`Enter ${block.type}...`}
                  />
                ) : (
                  <Textarea 
                    value={block.value} 
                    onChange={(e) => updateBlock(idx, e.target.value)}
                    className="bg-transparent border-zinc-800 lowercase"
                    placeholder={`Enter ${block.type}...`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => addBlock('heading')} variant="outline" className="rounded-xl lowercase font-bold gap-2"><Type size={16}/> Heading</Button>
            <Button onClick={() => addBlock('paragraph')} variant="outline" className="rounded-xl lowercase font-bold gap-2"><AlignLeft size={16}/> Paragraph</Button>
            <Button onClick={() => addBlock('image')} variant="outline" className="rounded-xl lowercase font-bold gap-2"><ImageIcon size={16}/> Image</Button>
            <Button onClick={() => addBlock('button')} variant="outline" className="rounded-xl lowercase font-bold gap-2"><MousePointer2 size={16}/> Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilder;