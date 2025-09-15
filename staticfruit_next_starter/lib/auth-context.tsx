'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isConnected: boolean;
  userAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);

  // Initialize Base Account SDK
  useEffect(() => {
    const initializeProvider = () => {
      if (typeof window !== 'undefined' && (window as any).createBaseAccountSDK) {
        try {
          const baseProvider = (window as any).createBaseAccountSDK({
            appName: 'StaticFruit',
            appLogoUrl: 'https://staticfruit.com/logo.png',
          }).getProvider();
          
          setProvider(baseProvider);
        } catch (error) {
          console.error('Failed to initialize Base Account SDK:', error);
        }
      }
    };

    initializeProvider();
  }, []);

  // Generate a fresh nonce for authentication
  const generateNonce = useCallback(() => {
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto.randomUUID().replace(/-/g, '');
    }
    return Math.random().toString(36).substring(2, 15);
  }, []);

  // Connect wallet using Base Account
  const connectWallet = useCallback(async () => {
    if (!provider) {
      console.error('Base Account provider not initialized');
      return;
    }

    try {
      // Track connection attempt
      trackEvent('wallet_connect_attempt');

      // Generate a fresh nonce
      const nonce = generateNonce();
      
      // Connect and authenticate using the wallet_connect method
      const { accounts } = await provider.request({
        method: 'wallet_connect',
        params: [{
          version: '1',
          capabilities: {
            signInWithEthereum: { 
              nonce, 
              chainId: '0x2105' // Base Mainnet - 8453
            }
          }
        }]
      });
      
      const { address } = accounts[0];
      const { message, signature } = accounts[0].capabilities.signInWithEthereum;
      
      setUserAddress(address);
      setIsConnected(true);
      
      // Track successful connection
      trackEvent('wallet_connect_success', { address: address.slice(0, 6) + '...' + address.slice(-4) });
      
      // In a real app, you would send the message and signature to your backend for verification
      console.log('Authentication data:', { address, message, signature });
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      trackEvent('wallet_connect_error', { error: error.message });
      throw error;
    }
  }, [provider, generateNonce]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setUserAddress(null);
    setIsConnected(false);
    trackEvent('wallet_disconnect');
  }, []);

  // Track events for analytics funnel
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // In a real app, this would send data to your analytics backend
    console.log(`[Analytics] ${eventName}:`, properties);
    
    // Store funnel events in localStorage for tracking
    if (typeof window !== 'undefined') {
      const funnelEvents = JSON.parse(localStorage.getItem('funnel_events') || '[]');
      funnelEvents.push({
        event: eventName,
        timestamp: Date.now(),
        properties
      });
      localStorage.setItem('funnel_events', JSON.stringify(funnelEvents));
    }
  }, []);

  // Check if user has completed activation (first protected action)
  const checkActivation = useCallback(() => {
    if (typeof window !== 'undefined') {
      const funnelEvents = JSON.parse(localStorage.getItem('funnel_events') || '[]');
      return funnelEvents.some((event: any) => 
        event.event === 'prediction_stake_success' || 
        event.event === 'prediction_create_success' ||
        event.event === 'comment_create_success'
      );
    }
    return false;
  }, []);

  // Track activation when it happens
  useEffect(() => {
    if (checkActivation() && !localStorage.getItem('activated')) {
      localStorage.setItem('activated', 'true');
      trackEvent('user_activated');
    }
  }, [checkActivation, trackEvent]);

  return (
    <AuthContext.Provider value={{ 
      isConnected, 
      userAddress, 
      connectWallet, 
      disconnectWallet,
      trackEvent
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}