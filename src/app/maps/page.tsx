import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function MapsPage() {
  const mapImage = PlaceHolderImages.find(img => img.id === 'map-sri-lanka');

  if (!mapImage) {
    return <p>Map image not found.</p>;
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Offline Maps</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Download maps to navigate Sri Lanka without an internet connection.
        </p>
      </section>

      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Map of Sri Lanka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden border">
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                fill
                className="object-contain"
                data-ai-hint={mapImage.imageHint}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-center">
             <Button asChild>
                <a href={mapImage.imageUrl} download="lankaguide-map.jpg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Map
                </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
