import Link from "next/link";
import Price from "./Price";
import { RestaurantCardType } from "../page";
import { calculateReviewRatingAverage } from "../../utilities/calculateReviewRatingAverage";
import Stars from "./Stars";

const Card2 = ({ restaurant }: { restaurant: RestaurantCardType }) => {
  // console.log(restaurant)

  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(restaurant.reviews);

    if (rating > 4) return "Awesome";
    if (rating <= 4 && rating > 3) return "Good";
    if (rating <= 3 && rating > 2) return "Average";
    return "Unrated";
  };

  return (
    <div className="border-b flex py-3">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img
          src={restaurant.main_image}
          alt={restaurant.name}
          className="w-44 h-36 rounded"
        />
      </Link>
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">
            <Stars reviews={restaurant.reviews} />
          </div>
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={restaurant.price} />
            <p className="mr-1 capitalize">• {restaurant.cuisine.name} •</p>
            <p className="capitalize">{restaurant.location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card2;
