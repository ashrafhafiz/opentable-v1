import { PrismaClient, Restaurant } from "@prisma/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  convertToDisplayTime,
  Time,
} from "../../../utilities/convertToDisplayTime";
import Form from "./components/Form";

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  });
  if (!restaurant) {
    notFound();
  }
  return restaurant;
};
const Reservation = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { date: string; partySize: string };
}) => {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  const [day, time] = searchParams.date.split("T");
  return (
    <>
      {/* RESERVATION */}
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          {/* HEADER */}
          <div>
            <h3 className="font-bold">You're almost done!</h3>
            <div className="mt-5 flex">
              <img
                src={restaurant.main_image}
                alt={restaurant.name}
                className="w-32 h-18 rounded"
              />
              <div className="ml-4">
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <div className="flex mt-3">
                  <p className="mr-6">
                    {format(new Date(day), "ccc, LLL d, y")}
                  </p>
                  <p className="mr-6">{convertToDisplayTime(time as Time)}</p>
                  <p className="mr-6">
                    {searchParams.partySize}{" "}
                    {parseInt(searchParams.partySize) === 1
                      ? "person"
                      : "persons"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* FORM */}
          <Form
            slug={restaurant.slug}
            day={day}
            time={time}
            partySize={searchParams.partySize}
          />
        </div>
      </div>
    </>
  );
};

export default Reservation;
