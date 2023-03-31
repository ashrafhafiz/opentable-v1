// 1. Make an HTTP request to the endpoint with data (json format) in the request body
// 2. Validate the user input
// 3. Validate that user has an account
// 4. Compare hashed password
// 5. Create JWT
// 6. Send the JWT to the client
// 7. Set Cookie
//
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Make an HTTP request to the endpoint with data in the request header
  if (req.method === "POST") {
    let { email, password } = req.body;

    // 2. Validate the user input
    const errors: string[] = [];
    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Invalid email.",
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: "Password cannot be empty.",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) return res.status(400).json({ error: errors[0] });

    // 3. Validate that user has an account
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      return res.status(401).json({ error: "Invalid credentials!" });

    // 4. Compare hashed password
    const isMatchedPasssword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isMatchedPasssword)
      return res.status(401).json({ error: "Invalid credentials!" });

    // 5. Create JWT and send it to the user
    const alg = "HS256";
    // The secret key for the HS256 algorithm must be one of type KeyObject, CryptoKey, or Uint8Array.
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: existingUser.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    setCookie("jwt", token, { req, res, maxAge: 60 * 60 * 24 });

    return res.status(200).json({
      id: existingUser.id,
      firstName: existingUser.first_name,
      lastName: existingUser.last_name,
      email: existingUser.email,
      city: existingUser.city,
      phone: existingUser.phone,
      created_at: existingUser.created_at,
      updated_at: existingUser.updated_at,
    });
  } else {
    return res.status(400).json({ message: "Invalid request!" });
  }
}
