// pages/api/user-details.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getUserDetails } from "@/app/lib/actions/getUserDetails";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userDetails = await getUserDetails();
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { handler as GET };
