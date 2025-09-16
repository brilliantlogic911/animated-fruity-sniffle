'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Twitter,
  Copy,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface PostSuccessShareProps {
  predictionId: number;
  predictionTitle: string;
  onDismiss?: () => void;
}

const PostSuccessShare: React.FC<PostSuccessShareProps> = ({ 
  predictionId, 
  predictionTitle,
  onDismiss 
}) => {
  const { trackEvent } = useAuth();
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(true);

  // Auto-show after a successful stake/comment/like
  useEffect(() => {
    const shouldShow = localStorage.getItem('showPostSuccessShare') === 'true';
    if (shouldShow) {
      setShow(true);
      localStorage.removeItem('showPostSuccessShare');
    }
  }, []);

  const shareUrl = `${window.location.origin}/markets?prediction=${predictionId}`;
  const shareText = `Check out this prediction on StaticFruit: "${predictionTitle}"`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    trackEvent('post_success_twitter_share', { predictionId });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('post_success_copy_link', { predictionId });
    });
  };

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) onDismiss();
    trackEvent('post_success_share_dismiss', { predictionId });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-white">Share Your Action</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </Button>
        </div>
        
        <p className="text-gray-300 text-sm mb-4">
          Help spread the word about your prediction or stake!
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handleTwitterShare}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Twitter size={16} className="mr-2" />
            Twitter
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy Link
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Sharing helps build the community and increases engagement
        </div>
      </div>
    </div>
  );
};

export default PostSuccessShare;