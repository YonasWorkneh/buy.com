import React from "react";
import { Star, StarHalf, StarOff } from "lucide-react";

interface RatingProps {
  rating: number; // raw rating value, e.g. 86 (if out of 100)
  scale?: number; // original scale (default = 100)
}

export const Rating: React.FC<RatingProps> = ({ rating, scale = 5 }) => {
  // Normalize rating to 0–5
  const normalized = Math.min(5, Math.max(0, (rating / scale) * 5));
  const fullStars = Math.floor(normalized);
  const hasHalfStar =
    normalized - fullStars >= 0.25 && normalized - fullStars < 0.75;
  const totalStars = 5;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="w-3 h-3 text-yellow-400 fill-yellow-400"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1 p-2">
      {renderStars()}
      <span className="text-xs text-gray-600 font-medium ml-1">
        {normalized} / 5
      </span>
    </div>
  );
};
