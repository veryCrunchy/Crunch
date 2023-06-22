import type { NextApiRequest, NextApiResponse } from "next";
import { cache } from "~/utils/api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    cache.set("twitchplays", req.body, 600);
    res
      .status(200)
      .json({ message: "TwitchPlays inputs successfully received" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
