import { PrismaClient } from "@prisma/client";
import generateRoomCode from "@/utils/generateRoomCode";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const newRoomCode = generateRoomCode();
    const room = await prisma.room.create({
      data: {
        name: req.body.name,
        code: newRoomCode
      }
    });
    res.status(201).json(room);
  } else {
    // Handle any other HTTP method
    res.status(405).json({message: 'Method not allowed'});
  }
}