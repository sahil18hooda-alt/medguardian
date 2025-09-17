'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/digilocker');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return <div>Please wait, we are signing you in...</div>;
}
