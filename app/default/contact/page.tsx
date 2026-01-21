'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DefaultContactPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to root contact page
    router.replace('/contact');
  }, [router]);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
