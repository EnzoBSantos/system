"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, LayoutGrid, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const { isAdmin, loading: authLoading } = useAdmin();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) fetchCourses();
  }, [isAdmin]);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newCourse.title) return;
    const { error } = await supabase.from('courses').insert([newCourse]);
    if (!error) {
      toast({ title: "course created." });
      setNewCourse({ title: '', description: '' });
      fetchCourses();
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
      <div className="space-y-2">
        <h1 className="text-6xl font-black tracking-tighter lowercase">access denied.</h1>
        <p className="text-zinc-500 font-medium">your soul is not yet authorized to curate these paths.</p>
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
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              className="bg-zinc-900 border-zinc-800 rounded-xl"
            />
            <Button onClick={handleCreate} className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl px-8">
              <Plus size={18} className="mr-2" /> create
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500">
                <LayoutGrid size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight lowercase">{course.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 lowercase">{course.description || "no description."}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 rounded-xl border-zinc-800 hover:bg-zinc-800 lowercase">edit</Button>
                <Button variant="ghost" className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                  <Trash2 size={18} />
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