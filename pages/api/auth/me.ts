// 1. Make an HTTP request to the endpoint with a token in the request header
// 2. Extract token from the request header
// 3. Verify token
// 4. decaode the token to get the user email
// 5. Fetch the user from the database
// 6. Send user info to the client
//
// \The Next.js 13 Bootcamp - The Complete Developer Guide\8. Implementing Authentication
//
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as jose from "jose";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Make an HTTP request to the endpoint with a token in the request header
  if (req.method === "GET") {
    // 2. Extract token from the request header
    const tokenArray = req.headers.authorization?.split(" ");
    //
    // The following 2 lines have been moved to middleware
    // if (!tokenArray || tokenArray.length !== 2)
    //   return res.status(401).json({ error: "Unauthorized request!" });
    //
    // 3. Verify token
    // 4. decaode the token to get the user email
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = tokenArray[1];

    try {
      const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
      // console.log(protectedHeader)
      // console.log(payload)

      // 5. fetch the user from the database
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: payload.email },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            city: true,
            phone: true,
            created_at: true,
            updated_at: true,
          },
        });
        // 6. send user info to the client
        return res.status(200).json({
          id: existingUser?.id,
          firstName: existingUser?.first_name,
          lastName: existingUser?.last_name,
          email: existingUser?.email,
          city: existingUser?.city,
          phone: existingUser?.phone,
          created_at: existingUser?.created_at,
          updated_at: existingUser?.updated_at,
        });
      } catch (error) {
        return res.status(401).json({ error: "Cannot fetch user data!" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized request!" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request!" });
  }
}
