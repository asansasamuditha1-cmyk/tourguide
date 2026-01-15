import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { AiPoweredRecommendationsOutput } from "@/ai/flows/ai-powered-recommendations";
import { ShareButton } from "../ShareButton";

type RecommendationCardProps = {
  recommendation: AiPoweredRecommendationsOutput["recommendations"][0];
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const shareText = `Check out this place in Sri Lanka: ${recommendation.name}! ${recommendation.description}`;

  return (
    <Card className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative w-full h-48">
        <Image
          src={recommendation.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
          alt={recommendation.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint="attraction photo"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg leading-tight">{recommendation.name}</CardTitle>
            <Badge variant="secondary">{recommendation.type}</Badge>
        </div>
        <CardDescription className="text-xs pt-1">{recommendation.address}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{recommendation.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{recommendation.rating.toFixed(1)}</span>
        </div>
        <ShareButton shareText={shareText} />
      </CardFooter>
    </Card>
  );
}
