import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId, answer, timeSpent } = await request.json();

    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
    });

    if (!assessment || assessment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Get question to check correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Check if answer is correct
    const correctAnswer = question.correctAnswer;
    const isCorrect = JSON.stringify(answer) === JSON.stringify(correctAnswer);

    // Save answer
    await prisma.answer.create({
      data: {
        assessmentId: params.id,
        questionId,
        answer,
        isCorrect,
        timeSpent,
      },
    });

    return NextResponse.json({ success: true, isCorrect });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
