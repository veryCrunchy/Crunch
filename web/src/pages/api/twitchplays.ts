import type { NextApiRequest, NextApiResponse } from "next";
import { cache } from "~/utils/api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    cache.set("twitchplays", req.body, 600);
    // Process the data as needed

    // Return a response
    res.status(200).json({ message: "Data received successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
