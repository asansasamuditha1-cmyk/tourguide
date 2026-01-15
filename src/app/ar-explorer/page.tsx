
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CameraOff } from "lucide-react";

export default function ARExplorerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API not supported in this browser.");
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Your browser does not support the camera API needed for this feature.",
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };

    getCameraPermission();
    
    // Cleanup function to stop video tracks when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };

  }, [toast]);

  const hotspots = [
    {
      id: 1,
      top: '30%',
      left: '25%',
      title: "Ancient Archway",
      content: "This archway dates back to the 12th century and was the main entrance to the royal court. Notice the intricate carvings, which depict tales from ancient folklore."
    },
    {
      id: 2,
      top: '65%',
      left: '50%',
      title: "Central Stupa",
      content: "The central stupa, or dagoba, was believed to house sacred relics. It was a focal point for religious ceremonies and pilgrimages. Its dome shape represents the vastness of the universe."
    },
    {
      id: 3,
      top: '40%',
      left: '75%',
      title: "Meditation Hall",
      content: "This partially ruined structure was a hall for monks to meditate. The remaining pillars once supported a large wooden roof. The layout promoted tranquility and focus."
    },
  ];

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">AR Explorer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Point your camera at landmarks to discover their secrets.
        </p>
      </section>

      <Card>
        <CardContent className="p-2 md:p-4">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-black flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
                <CameraOff className="h-12 w-12 mb-4" />
                <Alert variant="destructive" className="w-auto max-w-sm">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Camera access was denied or is not available. Please enable it in your browser settings to use the AR View.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {hasCameraPermission === true && hotspots.map(spot => (
              <Popover key={spot.id}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="absolute w-12 h-12 rounded-full animate-pulse shadow-lg"
                    style={{ top: spot.top, left: spot.left, transform: 'translate(-50%, -50%)' }}
                  >
                    <Info className="w-6 h-6 text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" side="top" align="center">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">{spot.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {spot.content}
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
