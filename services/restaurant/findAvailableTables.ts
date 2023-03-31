import { PrismaClient, Restaurant, Table } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../data";

const prisma = new PrismaClient();

const findAvailableTables = async ({
  slug,
  day,
  time,
  res,
  restaurant,
}: {
  slug: string;
  day: string;
  time: string;
  res: NextApiResponse<any>;
  restaurant: { tables: Table[]; open_time: string; close_time: string };
}) => {
  // Step 1: Determining the Search Times
  const searchTimes = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTimes) {
    return res
      .status(400)
      .json({ errorMessage: "Invalid reservation request" });
  }

  // Step 2: Fetching the Bookings
  // Date format could be an issue, it has to be in the format of 2023-01-01
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  // Step 3: Compressing the booking
  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};
  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.tableId]: true,
        };
      }, {});
  });

  // Step 4: Fteching all tables at the restaurant
  const restaurantE = await prisma.restaurant.findUnique({
    where: { slug },
    select: { tables: true, open_time: true, close_time: true },
  });

  if (!restaurantE) {
    return res
      .status(400)
      .json({ errorMessage: "Invalid reservation request" });
  }

  // Step 5: Reformatting the searchTimes to include date, time, and tables
  const searchTimesWithtables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables: restaurantE.tables,
    };
  });

  // Step 6: Filter out tables if they already booked
  searchTimesWithtables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithtables;
};

export default findAvailableTables;
