"use client";
//max
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, LayoutGrid, ArrowLeft, PenTool, Globe, EyeOff, Loader2, AlertCircle, Play, Edit2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminCourses = () => {
  const { isAdmin, loading: authLoading } = useAdmin();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) fetchCourses();
  }, [isAdmin]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          units (
            *,
            lessons (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      console.error("[AdminCourses] Fetch error:", err);
      toast({ title: "failed to fetch courses", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const title = newTitle.trim();
    if (!title) {
      toast({ title: "title required", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('courses')
        .insert([{ title, is_published: false, description: "" }])
        .select()
        .single();

      if (error) throw error;
      
      toast({ title: "course created." });
      setNewTitle('');
      fetchCourses();
    } catch (err: any) {
      toast({ title: "creation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      setSyncingId(courseId);
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;
      fetchCourses();
      toast({ title: !currentStatus ? "course published." : "course hidden." });
    } catch (err: any) {
      toast({ title: "update failed", description: err.message, variant: "destructive" });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("remove this path forever?")) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      fetchCourses();
      toast({ title: "course removed." });
    } catch (err: any) {
      toast({ title: "deletion failed", description: err.message, variant: "destructive" });
    }
  };

  if (authLoading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  if (isAdmin === false) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center space-y-8">
      <AlertCircle size={64} className="text-red-500" />
      <h1 className="text-4xl font-black">Access Denied</h1>
      <Button onClick={() => navigate('/dashboard')}>Return to Sanctuary</Button>
    </div>
  );

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar activeTab="dashboard" setActiveTab={() => {}} />
      <main className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">curator</h2>
            <h1 className="text-4xl font-black tracking-tighter lowercase">manage courses.</h1>
          </div>
          <form onSubmit={handleCreate} className="flex gap-4">
            <Input 
              placeholder="new course title..." 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-800 rounded-xl w-64"
            />
            <Button type="submit" disabled={isCreating} className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl px-8">
              {isCreating ? <Loader2 className="animate-spin" /> : <Plus size={18} className="mr-2" />}
              create
            </Button>
          </form>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-8 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight lowercase">{course.title}</h3>
                  <p className="text-zinc-500 text-sm lowercase">{course.description || "no description."}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublish(course.id, course.is_published)}
                  className={cn(
                    "rounded-full text-[8px] font-black uppercase tracking-widest px-4 h-8",
                    course.is_published ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                  )}
                >
                  {course.is_published ? "published" : "draft"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">lessons</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/admin/lesson-builder?courseId=${course.id}`)}
                    className="text-[10px] font-bold uppercase tracking-widest hover:text-white"
                  >
                    <Plus size={12} className="mr-1" /> add lesson
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {course.units?.flatMap((u: any) => u.lessons || []).map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-2xl group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600">
                          <Play size={14} fill="currentColor" />
                        </div>
                        <span className="text-sm font-bold lowercase">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/admin/lesson-builder/${lesson.id}?courseId=${course.id}`)}
                          className="w-8 h-8 rounded-lg text-zinc-500 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="w-8 h-8 rounded-lg text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!course.units || course.units.length === 0 || course.units.every((u: any) => !u.lessons || u.lessons.length === 0)) && (
                    <p className="text-[10px] text-zinc-700 italic text-center py-4">no lessons yet.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-auto flex gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => handleDelete(course.id)}
                  className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl font-bold lowercase"
                >
                  delete course
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminCourses;