import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import prisma from "@/lib/prisma";

export default async function handler(req, res) {

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { code } = req.query;

  const room = await prisma.room.findUnique({
    where: {
      code,
    },
  });

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  const song = await prisma.song.deleteMany({
    where: {
      roomId: room.id
    }
  })

  res.status(200).json(song);

}