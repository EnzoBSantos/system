"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, LayoutGrid, ArrowLeft, PenTool, Globe, EyeOff, Loader2, AlertCircle } from 'lucide-react';
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
        .select('*')
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

  const handleCreate = async () => {
    const title = newTitle.trim();
    if (!title) {
      toast({ title: "title required", description: "please enter a name for your course.", variant: "destructive" });
      return;
    }

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('courses')
        .insert([{ title, is_published: false }])
        .select()
        .single();

      if (error) throw error;
      
      toast({ title: "course created." });
      setNewTitle('');
      setCourses([data, ...courses]);
    } catch (err: any) {
      console.error("[AdminCourses] Creation error:", err);
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

      setCourses(courses.map(c => c.id === courseId ? { ...c, is_published: !currentStatus } : c));
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
      
      setCourses(courses.filter(c => c.id !== courseId));
      toast({ title: "course removed." });
    } catch (err: any) {
      toast({ title: "deletion failed", description: err.message, variant: "destructive" });
    }
  };

  if (authLoading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">verifying authority...</span>
    </div>
  );

  if (isAdmin === false) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center space-y-8">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-2">
        <h1 className="text-6xl font-black tracking-tighter lowercase text-white">access denied.</h1>
        <p className="text-zinc-500 font-medium max-w-md mx-auto">
          your soul is not yet authorized to curate these paths. please ensure your profile role is set to 'admin'.
        </p>
      </div>
      <Button 
        onClick={() => navigate('/dashboard')}
        className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold lowercase gap-2"
      >
        <ArrowLeft size={18} /> return to sanctuary
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar activeTab="dashboard" setActiveTab={() => {}} />
      <main className="flex-1 overflow-y-auto p-12 space-y-12">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">curator</h2>
            <h1 className="text-4xl font-black tracking-tighter lowercase">manage courses.</h1>
          </div>
          <div className="flex gap-4">
            <Input 
              placeholder="new course title..." 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-800 rounded-xl w-64 text-white"
            />
            <Button onClick={handleCreate} disabled={isCreating || !newTitle.trim()} className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl px-8">
              {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus size={18} className="mr-2" />}
              create
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">no courses found. create one above.</p>
              </div>
            )}
            
            {courses.map((course) => (
              <div key={course.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 flex flex-col group/card transition-all hover:border-zinc-700">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500">
                    <LayoutGrid size={28} />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(course.id, course.is_published)}
                    disabled={syncingId === course.id}
                    className={cn(
                      "rounded-full text-[8px] font-black uppercase tracking-widest px-4 h-8 transition-all",
                      course.is_published 
                        ? "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20" 
                        : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                    )}
                  >
                    {syncingId === course.id ? <Loader2 size={10} className="animate-spin mr-2" /> : (course.is_published ? <Globe size={10} className="mr-2" /> : <EyeOff size={10} className="mr-2" />)}
                    {course.is_published ? "published" : "draft"}
                  </Button>
                </div>
                
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold tracking-tight lowercase">{course.title}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 lowercase">{course.description || "no description provided."}</p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl border-zinc-800 hover:bg-zinc-800 lowercase font-bold"
                    onClick={() => navigate(`/admin/lesson-builder?courseId=${course.id}`)}
                  >
                    edit content
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(course.id)}
                    className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourses;