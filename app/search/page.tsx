import Card2 from "../components/Card2";
import Header1 from "../components/Header1";
import SearchSideBar from "../components/SearchSideBar";
import { PrismaClient, Cuisine, Location, PRICE } from "@prisma/client";

// export interface RestaurantCardType {
//   id: number;
//   name: string;
//   main_image: string;
//   cuisine: Cuisine;
//   location: Location;
//   price: PRICE;
//   slug: string;
// }

const prisma = new PrismaClient();

interface searchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}
const fetchRestaurantsBySearchParams = (searchParams: searchParams) => {
  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    cuisine: true,
    location: true,
    price: true,
    slug: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

// const fetchRestaurantsByLocation = (searchLoacation: string | undefined) => {
//   const select = {
//     id: true,
//     name: true,
//     main_image: true,
//     cuisine: true,
//     location: true,
//     price: true,
//     slug: true,
//   };
//   if (!searchLoacation) return prisma.restaurant.findMany({ select });
//   return prisma.restaurant.findMany({
//     where: {
//       location: {
//         name: {
//           equals: searchLoacation,
//         },
//       },
//     },
//     select,
//   });
// };

const fetchLocations = () => {
  return prisma.location.findMany();
};

const fetchCuisines = () => {
  return prisma.cuisine.findMany();
};

const Search = async ({ searchParams }: { searchParams: searchParams }) => {
  // const restaurants = await fetchRestaurantsByLocation(searchParams.city);
  const restaurants = await fetchRestaurantsBySearchParams(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  // console.log({ restaurants });
  return (
    <>
      <Header1 />
      <div className="w-2/3 flex justify-between items-start m-auto py-4">
        <div className="w-1/5 pr-5">
          <SearchSideBar
            locations={locations}
            cuisines={cuisines}
            searchParams={searchParams}
          />
        </div>
        <div className="w-4/5">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <Card2 key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>Sorry, we found no restaurant matching your criteria.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
