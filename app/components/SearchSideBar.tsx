import Link from "next/link";
import { Location, Cuisine, PRICE } from "@prisma/client";

const SearchSideBar = async ({
  locations,
  cuisines,
  searchParams,
}: {
  locations: Location[];
  cuisines: Cuisine[];
  searchParams: {
    city?: string | undefined;
    cuisine?: string | undefined;
    price?: PRICE | undefined;
  };
}) => {
  const prices = [
    {
      price: PRICE.CHEAP,
      label: "$",
      classes:
        "bg-gray-100 hover:cursor-pointer border w-full text-reg text-center font-light rounded-l p-2",
    },
    {
      price: PRICE.REGULAR,
      label: "$$",
      classes:
        "bg-gray-100 hover:cursor-pointer border-t border-b w-full text-reg text-center font-light p-2",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
      classes:
        "bg-gray-100 hover:cursor-pointer border w-full text-reg text-center font-light rounded-r p-2",
    },
  ];
  return (
    <>
      <div className="border-b pb-4">
        <h1 className="mb-2 font-bold">Region</h1>
        {locations.map((location: Location) => (
          <p
            key={location.id}
            className="font-light text-reg capitalize hover:cursor-pointer"
          >
            <Link
              href={{
                pathname: "/search",
                query: { ...searchParams, city: location.name },
              }}
            >
              {location.name}
            </Link>
          </p>
        ))}
      </div>
      {/* */}
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2 font-bold">Cuisine</h1>
        {cuisines.map((cuisine: Cuisine) => (
          <p
            key={cuisine.id}
            className="font-light text-reg capitalize hover:cursor-pointer"
          >
            <Link
              href={{
                pathname: "/search",
                query: { ...searchParams, cuisine: cuisine.name },
              }}
            >
              {cuisine.name}
            </Link>
          </p>
        ))}
      </div>
      {/* */}
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2 font-bold">Price</h1>
        <div className="flex">
          {prices.map(({ price, label, classes }) => (
            <Link
              href={{
                pathname: "/search",
                query: { ...searchParams, price },
              }}
              className={classes}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchSideBar;
