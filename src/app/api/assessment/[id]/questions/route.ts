import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reframeQuestion } from '@/lib/openai';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!assessment || assessment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Fetch questions based on mode
    const categories = ['IQ', 'EQ', 'SQ'];
    if (assessment.mode === 'LEADERSHIP') {
      categories.push('LEADERSHIP');
    }

    const questions = await prisma.question.findMany({
      where: {
        category: { in: categories },
        tenantId: null, // Default questions
      },
      select: {
        id: true,
        category: true,
        type: true,
        difficulty: true,
        text: true,
        options: true,
        imageUrl: true,
      },
      orderBy: [
        { category: 'asc' },
        { difficulty: 'asc' },
      ],
    });

    // If custom mode, reframe questions
    if (assessment.mode === 'CUSTOM' && assessment.customContext) {
      const context = assessment.customContext as any;

      // Reframe questions using AI (in production, cache these)
      const reframedQuestions = await Promise.all(
        questions.map(async (q) => {
          const reframedText = await reframeQuestion(q.text, {
            bio: context.bio,
            industry: context.industry,
            jobRole: context.jobRole,
          });
          return { ...q, text: reframedText };
        })
      );

      return NextResponse.json({ questions: reframedQuestions });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
