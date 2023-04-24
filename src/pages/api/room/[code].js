import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { code } = req.query;
  if (req.method === 'GET') {
    const room = await prisma.room.findUnique({
      where: {
        code,
      },
      include: {
        songs: true,
        users: true,
        roomHost: true,
      }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room);
  } else if (req.method === 'DELETE') {
    const room = await prisma.room.findUnique({
      where: {
        code,
      },
      include: {
        songs: true,
        users: true,
        roomHost: true,
      }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await prisma.room.update({
      where: {
        id: room.id,
      },
      data: {
        users: {
          disconnect: room.users.map((user) => ({ id: user.id })),
        },
      },
    });

    await prisma.song.deleteMany({
      where: {
        roomId: room.id,
      },
    });
    
    await prisma.room.delete({
      where: {
        id: room.id
      }
    });

    await prisma.roomHost.delete({
      where: {
        id: room.roomHost.id,
      },
    });
    
    res.status(201).json({ message: 'Deleted Room'});
  }
  else {
    // Handle any other HTTP method
    res.status(405).json({message: 'Method not allowed'});
  }
}