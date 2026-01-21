'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DefaultPortfolioPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to root portfolio page
    router.replace('/portfolio');
  }, [router]);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
