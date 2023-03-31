import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import findAvailableTables from "../../../../services/restaurant/findAvailabletables";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      booker_email,
      booker_phone,
      booker_first_name,
      booker_last_name,
      booker_occasion,
      booker_request,
    } = req.body;

    // step 1: Validate the restaurant exists, and
    // that the day is within the opening hours
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({
        errorMessage: "Invalid reservation request - Invalid restaurant",
      });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res.status(400).json({
        errorMessage: "Invalid reservation request - Out of working hours",
      });
    }

    // Step 2.0 Extracting the Table Availability Logic Into it's Own Function
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

    // Step 2.5 Determining the Available Tables
    const searchTimeWithtables = searchTimesWithtables.find(
      (t) => t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
    );
    if (!searchTimeWithtables) {
      return res.status(400).json({
        errorMessage: "Invalid reservation request - No availability",
      });
    }

    // Step 3 Count the Tables Based on Seats
    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    searchTimeWithtables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    // Step 4: Determine the Tables to Book
    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);
    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        } else {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        }
      }
    }

    // Step 5: Creating the Booking and Linking it to the Tables
    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email,
        booker_phone,
        booker_first_name,
        booker_last_name,
        booker_occasion,
        booker_request,
        restaurantId: restaurant.id,
      },
    });

    const bookingTableData = tablesToBook.map((tableId) => {
      return { tableId, bookingId: booking.id };
    });
    await prisma.booking_Table.createMany({
      data: bookingTableData,
    });

    return res.json(booking);
  }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-03-30&time=14:00:00.000Z&partySize=4
