import Link from "next/link";
import { RestaurantCardType } from "../page";
import Price from "./Price";
import Star from "./Star";
import Stars from "./Stars";

interface Props {
  restaurant: RestaurantCardType;
}

const Card1 = ({ restaurant }: Props) => {
  return (
    <Link href={`/restaurant/${restaurant.slug}`}>
      <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
        <img
          src={restaurant.main_image}
          alt="CharBar"
          className="w-full h-36"
        />
        <div className="p-1">
          <h3 className="text-lg font-bold leading-6 mb-2 truncate">
            {restaurant.name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center flex-shrink-0 mr-2">
              <Stars reviews={restaurant.reviews} />
            </div>
            <p className="ml-2">
              {restaurant.reviews.length} review
              {restaurant.reviews.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="text-reg font-light capitalize flex">
            <p className="mr-3">{restaurant.cuisine.name}</p>
            <Price price={restaurant.price} />
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm font-bold mt-1">Booked 3 times today</p>
        </div>
      </div>
    </Link>
  );
};

export default Card1;
