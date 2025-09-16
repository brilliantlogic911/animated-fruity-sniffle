'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { RootProvider } from './rootProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </RootProvider>
  );
}