import { Inter } from "@next/font/google";
import Header1 from "./components/Header1";
import Card1 from "./components/Card1";
import { PrismaClient, Cuisine, Location, PRICE, Review } from "@prisma/client";

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
  reviews: Review[];
}

const inter = Inter({ subsets: ["latin"] });
const prisma = new PrismaClient();
const fetchRestaurants = async (): Promise<RestaurantCardType[]> => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      cuisine: true,
      location: true,
      price: true,
      slug: true,
      reviews: true,
    },
  });
  return restaurants;
};

export default async function Home() {
  const restautants = await fetchRestaurants();
  return (
    <>
      <Header1 />
      <div className="py-3 px-36 mt-10 flex flex-wrap">
        {restautants.map((restaurant) => (
          <Card1 key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </>
  );
}
