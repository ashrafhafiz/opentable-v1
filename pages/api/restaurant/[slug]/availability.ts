import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import findAvailableTables from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!day || !time || !partySize) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid reservation request" });
    }

    // Step 1: Determining the Search Times
    // const searchTimes = times.find((t) => t.time === time)?.searchTimes;

    // if (!searchTimes) {
    //   return res
    //     .status(400)
    //     .json({ errorMessage: "Invalid reservation request" });
    // }

    // Step 2: Fetching the Bookings
    // Date format could be an issue, it has to be in the format of 2023-01-01
    // const bookings = await prisma.booking.findMany({
    //   where: {
    //     booking_time: {
    //       gte: new Date(`${day}T${searchTimes[0]}`),
    //       lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
    //     },
    //   },
    //   select: {
    //     number_of_people: true,
    //     booking_time: true,
    //     tables: true,
    //   },
    // });

    // Step 3: Compressing the booking
    // const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};
    // bookings.forEach((booking) => {
    //   bookingTablesObj[booking.booking_time.toISOString()] =
    //     booking.tables.reduce((obj, table) => {
    //       return {
    //         ...obj,
    //         [table.tableId]: true,
    //       };
    //     }, {});
    // });

    // Step 4: Fteching all tables at the restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: { tables: true, open_time: true, close_time: true },
    });

    if (!restaurant) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid reservation request" });
    }

    // Step 5: Reformatting the searchTimes to include date, time, and tables
    // const searchTimesWithtables = searchTimes.map((searchTime) => {
    //   return {
    //     date: new Date(`${day}T${searchTime}`),
    //     time: searchTime,
    //     tables: restaurant.tables,
    //   };
    // });

    // Step 6: Filter out tables if they already booked
    // searchTimesWithtables.forEach((t) => {
    //   t.tables = t.tables.filter((table) => {
    //     if (bookingTablesObj[t.date.toISOString()]) {
    //       if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
    //     }
    //     return true;
    //   });
    // });

    // All the above steps have been moved to services\restaurant\findAvailableTables.ts
    const searchTimesWithtables = await findAvailableTables({
      slug,
      day,
      time,
      res,
      restaurant,
    });
    if (!searchTimesWithtables) {
      return res
        .status(400)
        .json({ errorMessage: "Invalid reservation request" });
    }

    // Step 7: Determine if a timeslot is available based on the tables and party size
    // Then
    // Step 8: Filter out times that are outside of opening window
    const availabilities = searchTimesWithtables
      .map((t) => {
        const sumSeats = t.tables.reduce((sum, table) => sum + table.seats, 0);

        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availability) => {
        const timeIsAfterOpenHour =
          new Date(`${day}T${availability.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeCloseHour =
          new Date(`${day}T${availability.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpenHour && timeIsBeforeCloseHour;
      });

    return res.status(200).json(availabilities);

    // return res.status(200).json({
    //   // searchTimes,
    //   // bookings,
    //   // bookingTablesObj,
    //   // tables: restaurant.tables,
    //   // searchTimesWithtables,
    //   // availabilities,
    // });
  }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability
// ?day=28-3-2023&time=20:00:00.000z&partySize=5
