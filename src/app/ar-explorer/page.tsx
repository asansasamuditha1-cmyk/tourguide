import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function ARExplorerPage() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'ar-temple');

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
          Point your "camera" at landmarks to discover their secrets.
        </p>
      </section>

      <Card>
        <CardContent className="p-2 md:p-4">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
            {bgImage && (
              <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover"
                data-ai-hint={bgImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/10"></div>
            
            {hotspots.map(spot => (
              <Popover key={spot.id}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="absolute w-12 h-12 rounded-full animate-pulse"
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
