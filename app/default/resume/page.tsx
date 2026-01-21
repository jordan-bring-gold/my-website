'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DefaultResumePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to root resume page
    router.replace('/resume');
  }, [router]);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
