import { PrismaClient, Restaurant, Review } from "@prisma/client";
import { notFound } from "next/navigation";
import { calculateReviewRatingAverage } from "../../../utilities/calculateReviewRatingAverage";
import Navbar3 from "../../components/Navbar3";
import ReservationSideBar from "../../components/ReservationSideBar";
import ReviewCard from "../../components/ReviewCard";
import Stars from "../../components/Stars";

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: slug },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  // if (!restaurant) throw new Error("Cannot find restaurant!");
  if (!restaurant) notFound();

  return restaurant;
};

const RestaurantDetails = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  // console.log(restaurant);
  return (
    <>
      {/* DETAILS SECTION */}
      <div className="bg-white w-[70%] rounded p-3 shadow">
        {/* SUB-NAVBAR */}
        <Navbar3 slug={restaurant.slug} />
        {/* TITLE */}
        <div className="mt-4 border-b pb-6">
          <h1 className="font-bold text-6xl">{restaurant.name}</h1>
        </div>
        {/* RATINGS */}
        <div className="flex items-center mt-2">
          <div className="ratings flex items-center">
            <Stars reviews={restaurant.reviews} />
            <p className="text-reg ml-2">
              {calculateReviewRatingAverage(restaurant.reviews).toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-reg ml-5">
              {restaurant.reviews.length} Review
              {restaurant.reviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {/* Notes */}
        <div className="mt-4">
          <p className="text-reg font-light leading-6">
            {restaurant.description}
          </p>
        </div>
        {/* IMAGES */}
        <div>
          <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
            {restaurant.images.length} images
          </h1>
          <div className="grid gap-4 grid-cols-4 grid-rows-2 overflow-hidden">
            {restaurant.images.map((image, index) => (
              <img
                key={index}
                className={`${
                  index === 0
                    ? "row-span-2 col-span-2"
                    : "row-span-1 col-span-1"
                } w-full h-full mr-1 mb-1 rounded`}
                src={image}
                alt="hot dog 1"
              />
            ))}
          </div>
        </div>
        {/* REVIEWS */}
        <div>
          <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
            What {restaurant.reviews.length}{" "}
            {restaurant.reviews.length === 1 ? "person is" : "people are"}{" "}
            saying about it
          </h1>
          <div>
            {restaurant.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
      {/* RESERVATION SIDEBAR */}
      <div className="w-[27%] text-reg relative">
        <ReservationSideBar
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={restaurant.slug}
        />
      </div>
    </>
  );
};

export default RestaurantDetails;
