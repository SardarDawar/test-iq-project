import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  calculateIQScore,
  calculateEQScore,
  calculateSQScore,
  calculateLPI,
  generateBehaviorMetrics,
} from '@/lib/scoring';
import { generateInsights } from '@/lib/openai';

export async function POST(
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
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!assessment || assessment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Mark assessment as completed
    await prisma.assessment.update({
      where: { id: params.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Calculate scores
    const answers = assessment.answers.map((a) => ({
      questionId: a.questionId,
      answer: a.answer,
      isCorrect: a.isCorrect,
      timeSpent: a.timeSpent,
    }));

    const questions = assessment.answers.map((a) => ({
      id: a.question.id,
      category: a.question.category,
      difficulty: a.question.difficulty,
      type: a.question.type,
    }));

    const iqResult = calculateIQScore(answers, questions);
    const eqResult = calculateEQScore(answers, questions);
    const sqResult = calculateSQScore(answers, questions);

    const behaviorMetrics = generateBehaviorMetrics(answers);

    let lpiResult = null;
    if (assessment.mode === 'LEADERSHIP') {
      lpiResult = calculateLPI(
        iqResult.score,
        eqResult.score,
        sqResult.score,
        behaviorMetrics
      );
    }

    // Build domain scores
    const domainScores = {
      iq: {
        visualReasoning: 75, // Simplified
        numericalAnalysis: 80,
        verbalIntelligence: 70,
        spatialReasoning: 85,
      },
      eq: eqResult.domainScores,
      sq: sqResult.domainScores,
      ...(lpiResult && { leadership: lpiResult.domainScores }),
    };

    // Generate AI insights
    const insightsText = await generateInsights(
      {
        iq: iqResult.score,
        eq: eqResult.score,
        sq: sqResult.score,
        lpi: lpiResult?.score,
      },
      domainScores
    );

    // Create result
    const result = await prisma.result.create({
      data: {
        userId: session.user.id,
        assessmentId: params.id,
        iqScore: iqResult.score,
        iqPercentile: iqResult.percentile,
        eqScore: eqResult.score,
        sqScore: sqResult.score,
        lpiScore: lpiResult?.score,
        domainScores,
        reasoningType: iqResult.reasoningType,
        leadershipStyle: lpiResult?.style,
        insights: { text: insightsText },
        strengths: { list: ['Analytical thinking', 'Empathy', 'Value-driven'] },
        improvements: { list: ['Time management', 'Conflict resolution'] },
        behaviorMetrics,
      },
    });

    // Award badges
    const badges = await prisma.badge.findMany({
      where: {
        category: { in: ['IQ', 'EQ', 'SQ'] },
        level: 1,
      },
    });

    for (const badge of badges) {
      await prisma.userBadge.create({
        data: {
          userId: session.user.id,
          badgeId: badge.id,
        },
      }).catch(() => {}); // Ignore duplicates
    }

    // Update user progress
    await prisma.userProgress.update({
      where: { userId: session.user.id },
      data: {
        xp: { increment: 100 },
        lastActive: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      resultId: result.id,
      message: 'Assessment completed successfully',
    });
  } catch (error) {
    console.error('Error completing assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
