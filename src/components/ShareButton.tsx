"use client";

import { Share2, Twitter, Facebook, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

type ShareButtonProps = {
  shareText: string;
  shareUrl?: string;
};

export function ShareButton({ shareText, shareUrl: customUrl }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    setShareUrl(customUrl || window.location.href);
  }, [customUrl]);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LankaGuide AI",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    toast({ title: "Copied to clipboard!" });
  };

  if (!isClient) {
    return null;
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    return (
      <Button variant="ghost" size="icon" onClick={handleNativeShare}>
        <Share2 className="h-5 w-5" />
        <span className="sr-only">Share</span>
      </Button>
    );
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" asChild>
            <a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
