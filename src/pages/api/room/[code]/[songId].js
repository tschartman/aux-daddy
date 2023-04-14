import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { code, songId } = req.query;

  if (!songId) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const room = await prisma.room.findUnique({
    where: {
      code,
    },
  });

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  const song = await prisma.song.delete({
    where: {
      id: songId
    }
  })

  res.status(200).json(song);

}