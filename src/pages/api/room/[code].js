import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { code } = req.query;
  if (req.method === 'GET') {
    const room = await prisma.room.findUnique({
      where: {
        code,
      },
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }


    const songs = await prisma.song.findMany({
      where: {
        roomId: room.id
      }
    });

    res.status(200).json({ ...room, songs });
  } else {
    // Handle any other HTTP method
    res.status(405).json({message: 'Method not allowed'});
  }
}