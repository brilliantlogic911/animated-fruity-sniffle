'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

interface BaseAuthButtonProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

const BaseAuthButton: React.FC<BaseAuthButtonProps> = ({ 
  onConnect, 
  onDisconnect,
  className = ''
}) => {
  const { isConnected, userAddress, connectWallet, disconnectWallet, trackEvent } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Track intent to connect
      trackEvent('wallet_connect_intent');
      
      await connectWallet();
      
      // Callback
      if (onConnect) onConnect();
    } catch (err: any) {
      console.error('Connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    
    // Callback
    if (onDisconnect) onDisconnect();
  };

  if (isConnected && userAddress) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
          Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isConnecting ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2">⏳</span>
            Connecting...
          </span>
        ) : (
          'Sign in with Base'
        )}
      </Button>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Connect your Base Account to stake and interact with predictions
      </div>
    </div>
  );
};

export default BaseAuthButton;