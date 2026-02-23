"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { Bird } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
              <Bird className="text-black" size={28} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter lowercase text-white">aura.</h1>
          </div>
          <p className="text-zinc-500 font-medium text-center">master your mind, one ritual at a time.</p>
        </div>
        
        <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#ffffff',
                    brandAccent: '#e5e5e5',
                    brandButtonText: '#000000',
                    inputBackground: 'transparent',
                    inputText: 'white',
                    inputBorder: '#1c1c1e',
                    inputPlaceholder: '#52525b',
                  },
                },
              },
              className: {
                button: 'rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] !text-black',
                input: 'rounded-2xl h-12 border-zinc-800 focus:border-white transition-all',
                label: 'text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block',
                anchor: 'text-zinc-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest',
              }
            }}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;