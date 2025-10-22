import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
      },
    });

    // Fetch results
    const results = await prisma.result.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        iqScore: true,
        eqScore: true,
        sqScore: true,
        lpiScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch badges
    const badges = await prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: {
        badge: {
          select: {
            name: true,
            description: true,
            icon: true,
          },
        },
      },
    });

    // Fetch progress
    let progress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    });

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          xp: 0,
          level: 1,
          streak: 0,
        },
      });
    }

    return NextResponse.json({
      user,
      results,
      badges,
      progress: {
        xp: progress.xp,
        level: progress.level,
        streak: progress.streak,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
