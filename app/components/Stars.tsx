import { Review } from "@prisma/client";
import Image from "next/image";
import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import { calculateReviewRatingAverage } from "../../utilities/calculateReviewRatingAverage";

const Stars = ({
  reviews,
  userRating,
}: {
  reviews: Review[];
  userRating?: number | undefined;
}) => {
  const rating = userRating || calculateReviewRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = parseFloat((rating - i).toFixed(1));
      // if (difference >= 1) stars.push(fullStar);
      // else if (difference > 0 && difference < 1) {
      //   if (difference <= 0.2) stars.push(emptyStar);
      //   else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
      //   else stars.push(fullStar);
      // } else stars.push(emptyStar);
      if (difference > 0.6) stars.push(fullStar);
      else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
      else if (difference <= 0.2) stars.push(emptyStar);
    }
    return stars.map((star) => (
      <Image className="w-4 h-4 mr-1" src={star} alt="star" />
    ));
  };
  return <>{renderStars()}</>;
};

export default Stars;
