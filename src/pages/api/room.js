import generateRoomCode from "@/utils/generateRoomCode";
import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]'
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    const newRoomCode = generateRoomCode();
    const room = await prisma.room.create({
      data: {
        name: req.body.name,
        code: newRoomCode,
        roomHost: {
          create: {
            id: session.user.id,
          },
        },
        users: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    res.status(201).json(room);
  } else {
    // Handle any other HTTP method
    res.status(405).json({message: 'Method not allowed'});
  }
}