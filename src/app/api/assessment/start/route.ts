import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mode, customContext } = await request.json();

    if (!mode || !['default', 'custom', 'leadership'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        userId: session.user.id,
        mode,
        customContext: customContext || null,
        status: 'IN_PROGRESS',
      },
    });

    return NextResponse.json({
      assessmentId: assessment.id,
      message: 'Assessment started successfully',
    });
  } catch (error) {
    console.error('Error starting assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
