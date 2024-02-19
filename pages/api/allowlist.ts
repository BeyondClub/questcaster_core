import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../app/lib/db";

const AllowlistHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  if (email !== "") {
    const emailAddress = email.toLowerCase();

    const emailExist = await prisma.questcaster_allowlist.findFirst({
      where: {
        email: emailAddress,
      },
    });

    if (!emailExist) {
      await prisma.questcaster_allowlist.create({
        data: {
          email: emailAddress,
        },
      });
    }
  }

  return res.status(200).json({ message: "LFG!" });
};

export default AllowlistHandler;
