// 1. Make an HTTP request to the endpoint with data (json format) in the request body
// 2. Validate the user input
// 3. Validate that user doesnot have an account
// 4. Hash the password
// 5. Save the user in database
// 6. Create JWT
// 7. Send the JWT to the client
// 8. Set Cookie
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
  if (req.method === "POST") {
    const errors: string[] = [];
    let user = req.body;
    const validationSchema = [
      {
        valid: validator.isLength(user.firstName, { min: 1, max: 20 }),
        errorMessage: "Invalid first name.",
      },
      {
        valid: validator.isLength(user.lastName, { min: 1, max: 20 }),
        errorMessage: "Invalid last name.",
      },
      {
        valid: validator.isEmail(user.email),
        errorMessage: "Invalid email.",
      },
      {
        valid: validator.isStrongPassword(user.password),
        errorMessage: "Invalid password.",
      },
      {
        valid: validator.isMobilePhone(user.phone),
        errorMessage: "Invalid mobile number.",
      },
      {
        valid: validator.isLength(user.city, { min: 1, max: 20 }),
        errorMessage: "Invalid city.",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) return res.status(400).json({ error: errors[0] });

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser)
      return res.status(400).json({ error: "Email aleardy exists!" });

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const newUser = await prisma.user.create({
      data: {
        first_name: user.firstName,
        last_name: user.lastName,
        password: user.password,
        city: user.city,
        phone: user.phone,
        email: user.email,
      },
    });

    const alg = "HS256";
    // The secret key for the HS256 algorithm must be one of type KeyObject, CryptoKey, or Uint8Array.
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    setCookie("jwt", token, { req, res, maxAge: 60 * 60 * 24 });

    return res.status(200).json({
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      email: newUser.email,
      phone: newUser.phone,
      city: newUser.city,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    });
  } else {
    return res.status(400).json({ message: "Invalid request!" });
  }
}
