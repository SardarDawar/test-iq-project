import { PrismaClient, QuestionCategory, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iceas.app' },
    update: {},
    create: {
      email: 'admin@iceas.app',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create IQ Questions
  const iqQuestions = [
    {
      category: 'IQ' as QuestionCategory,
      type: 'PATTERN_RECOGNITION' as QuestionType,
      difficulty: 3,
      text: 'What number comes next in the sequence: 2, 4, 8, 16, ?',
      options: JSON.stringify(['24', '32', '30', '28']),
      correctAnswer: JSON.stringify('32'),
      explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
    },
    {
      category: 'IQ' as QuestionCategory,
      type: 'VISUAL_REASONING' as QuestionType,
      difficulty: 4,
      text: 'If you rotate a square 90 degrees clockwise and then flip it horizontally, which corner that was originally at the top-left will now be where?',
      options: JSON.stringify(['Top-right', 'Bottom-right', 'Bottom-left', 'Top-left']),
      correctAnswer: JSON.stringify('Bottom-left'),
      explanation: 'After rotation, top-left moves to top-right. After horizontal flip, it moves to bottom-left.',
    },
    {
      category: 'IQ' as QuestionCategory,
      type: 'MULTIPLE_CHOICE' as QuestionType,
      difficulty: 2,
      text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
      options: JSON.stringify(['Yes', 'No', 'Cannot be determined']),
      correctAnswer: JSON.stringify('Yes'),
      explanation: 'This is a syllogism: if A⊆B and B⊆C, then A⊆C',
    },
    {
      category: 'IQ' as QuestionCategory,
      type: 'MULTIPLE_CHOICE' as QuestionType,
      difficulty: 3,
      text: 'A train travels 120 miles in 2 hours. At this rate, how long will it take to travel 300 miles?',
      options: JSON.stringify(['4 hours', '5 hours', '6 hours', '4.5 hours']),
      correctAnswer: JSON.stringify('5 hours'),
      explanation: 'Speed = 120/2 = 60 mph. Time = 300/60 = 5 hours',
    },
    {
      category: 'IQ' as QuestionCategory,
      type: 'PATTERN_RECOGNITION' as QuestionType,
      difficulty: 5,
      text: 'Complete the analogy: Book is to Reading as Fork is to ?',
      options: JSON.stringify(['Eating', 'Cooking', 'Food', 'Kitchen']),
      correctAnswer: JSON.stringify('Eating'),
      explanation: 'A book is a tool used for reading, just as a fork is a tool used for eating',
    },
  ];

  // Create EQ Questions
  const eqQuestions = [
    {
      category: 'EQ' as QuestionCategory,
      type: 'SCENARIO' as QuestionType,
      difficulty: 3,
      text: 'A team member criticizes your work in a meeting. How do you typically respond?',
      options: JSON.stringify([
        'Defend yourself immediately',
        'Stay calm, listen, and ask clarifying questions',
        'Feel hurt and withdraw from the conversation',
        'Criticize their work in return',
      ]),
      correctAnswer: JSON.stringify('Stay calm, listen, and ask clarifying questions'),
      explanation: 'High EQ involves managing emotions and seeking to understand feedback constructively',
    },
    {
      category: 'EQ' as QuestionCategory,
      type: 'EMOTIONAL_RECOGNITION' as QuestionType,
      difficulty: 2,
      text: 'Your colleague seems quiet and withdrawn today. What is your most emotionally intelligent response?',
      options: JSON.stringify([
        'Ignore it - it\'s not your business',
        'Privately ask if they\'re okay and if they want to talk',
        'Announce to everyone that they seem upset',
        'Assume they\'re angry at you',
      ]),
      correctAnswer: JSON.stringify('Privately ask if they\'re okay and if they want to talk'),
      explanation: 'Empathy and appropriate social approach are key EQ skills',
    },
    {
      category: 'EQ' as QuestionCategory,
      type: 'REFLECTION' as QuestionType,
      difficulty: 4,
      text: 'When you face a stressful deadline, which best describes your emotional state?',
      options: JSON.stringify([
        'I panic and struggle to focus',
        'I feel the stress but can channel it into productivity',
        'I become irritable with others',
        'I avoid thinking about it',
      ]),
      correctAnswer: JSON.stringify('I feel the stress but can channel it into productivity'),
      explanation: 'Self-regulation means acknowledging emotions while maintaining effectiveness',
    },
    {
      category: 'EQ' as QuestionCategory,
      type: 'SCENARIO' as QuestionType,
      difficulty: 3,
      text: 'You notice a friend is consistently late to your meetups. How do you address this?',
      options: JSON.stringify([
        'Stop inviting them',
        'Express how it makes you feel and ask if there\'s an issue',
        'Start being late yourself to teach them a lesson',
        'Complain to others about them',
      ]),
      correctAnswer: JSON.stringify('Express how it makes you feel and ask if there\'s an issue'),
      explanation: 'Healthy communication involves expressing feelings without blame',
    },
    {
      category: 'EQ' as QuestionCategory,
      type: 'MULTIPLE_CHOICE' as QuestionType,
      difficulty: 2,
      text: 'Self-awareness in emotional intelligence primarily means:',
      options: JSON.stringify([
        'Being aware of others\' emotions',
        'Understanding your own emotions and their impact',
        'Knowing how to manipulate emotions',
        'Suppressing negative emotions',
      ]),
      correctAnswer: JSON.stringify('Understanding your own emotions and their impact'),
      explanation: 'Self-awareness is the foundation of emotional intelligence',
    },
  ];

  // Create SQ Questions
  const sqQuestions = [
    {
      category: 'SQ' as QuestionCategory,
      type: 'REFLECTION' as QuestionType,
      difficulty: 3,
      text: 'When making an important decision, what guides you most?',
      options: JSON.stringify([
        'What will benefit me most',
        'What aligns with my core values',
        'What others expect of me',
        'What is easiest or most convenient',
      ]),
      correctAnswer: JSON.stringify('What aligns with my core values'),
      explanation: 'SQ involves using values as a compass for decision-making',
    },
    {
      category: 'SQ' as QuestionCategory,
      type: 'SCENARIO' as QuestionType,
      difficulty: 4,
      text: 'You witness a colleague taking credit for someone else\'s work. What do you do?',
      options: JSON.stringify([
        'Stay silent to avoid conflict',
        'Speak up privately to address the injustice',
        'Join in taking credit to get ahead',
        'Gossip about it with others',
      ]),
      correctAnswer: JSON.stringify('Speak up privately to address the injustice'),
      explanation: 'Ethical action based on compassion and integrity reflects high SQ',
    },
    {
      category: 'SQ' as QuestionCategory,
      type: 'REFLECTION' as QuestionType,
      difficulty: 3,
      text: 'How often do you reflect on your life\'s purpose?',
      options: JSON.stringify([
        'Rarely or never',
        'Occasionally when prompted',
        'Regularly as part of my routine',
        'Only during major life events',
      ]),
      correctAnswer: JSON.stringify('Regularly as part of my routine'),
      explanation: 'Purpose awareness is central to spiritual/social intelligence',
    },
    {
      category: 'SQ' as QuestionCategory,
      type: 'MULTIPLE_CHOICE' as QuestionType,
      difficulty: 2,
      text: 'Compassion primarily involves:',
      options: JSON.stringify([
        'Feeling sorry for others',
        'Understanding suffering and wanting to help alleviate it',
        'Agreeing with everyone',
        'Sacrificing your own needs always',
      ]),
      correctAnswer: JSON.stringify('Understanding suffering and wanting to help alleviate it'),
      explanation: 'True compassion combines empathy with action',
    },
    {
      category: 'SQ' as QuestionCategory,
      type: 'SCENARIO' as QuestionType,
      difficulty: 4,
      text: 'A promotion requires you to compromise a personal value. What do you do?',
      options: JSON.stringify([
        'Take the promotion anyway',
        'Decline and look for alternatives aligned with your values',
        'Take it but feel guilty',
        'Ask others what they would do',
      ]),
      correctAnswer: JSON.stringify('Decline and look for alternatives aligned with your values'),
      explanation: 'High SQ means maintaining value alignment even when difficult',
    },
  ];

  // Create Leadership Questions
  const leadershipQuestions = [
    {
      category: 'LEADERSHIP' as QuestionCategory,
      type: 'SCENARIO' as QuestionType,
      difficulty: 4,
      text: 'Your team is divided on a critical decision. How do you lead them forward?',
      options: JSON.stringify([
        'Make the decision yourself to save time',
        'Facilitate discussion to understand all perspectives and find common ground',
        'Let them figure it out on their own',
        'Side with the majority immediately',
      ]),
      correctAnswer: JSON.stringify('Facilitate discussion to understand all perspectives and find common ground'),
      explanation: 'Effective leadership involves vision, empathy, and collaborative decision-making',
    },
    {
      category: 'LEADERSHIP' as QuestionCategory,
      type: 'REFLECTION' as QuestionType,
      difficulty: 3,
      text: 'What motivates you most as a leader?',
      options: JSON.stringify([
        'Personal recognition and advancement',
        'Seeing others grow and succeed',
        'Power and control',
        'Avoiding failure',
      ]),
      correctAnswer: JSON.stringify('Seeing others grow and succeed'),
      explanation: 'Transformational leaders are motivated by team development',
    },
    {
      category: 'LEADERSHIP' as QuestionCategory,
      type: 'SCENARIO' as QuestionType,
      difficulty: 5,
      text: 'A high-performing team member is disrupting team morale. How do you handle it?',
      options: JSON.stringify([
        'Ignore it because they perform well',
        'Have a direct conversation about behavior impact and expectations',
        'Fire them immediately',
        'Hope it resolves itself',
      ]),
      correctAnswer: JSON.stringify('Have a direct conversation about behavior impact and expectations'),
      explanation: 'Leadership requires balancing performance with team culture and values',
    },
    {
      category: 'LEADERSHIP' as QuestionCategory,
      type: 'MULTIPLE_CHOICE' as QuestionType,
      difficulty: 3,
      text: 'The most important quality in a leader is:',
      options: JSON.stringify([
        'Intelligence',
        'Charisma',
        'Integrity',
        'Decisiveness',
      ]),
      correctAnswer: JSON.stringify('Integrity'),
      explanation: 'Integrity builds trust, which is the foundation of effective leadership',
    },
    {
      category: 'LEADERSHIP' as QuestionCategory,
      type: 'REFLECTION' as QuestionType,
      difficulty: 4,
      text: 'When facing uncertainty, you:',
      options: JSON.stringify([
        'Wait for more information indefinitely',
        'Make a decision with available data and adapt as needed',
        'Panic and seek others to decide',
        'Avoid the situation',
      ]),
      correctAnswer: JSON.stringify('Make a decision with available data and adapt as needed'),
      explanation: 'Resilient leaders can act decisively while remaining adaptive',
    },
  ];

  // Insert all questions
  const allQuestions = [
    ...iqQuestions,
    ...eqQuestions,
    ...sqQuestions,
    ...leadershipQuestions,
  ];

  for (const q of allQuestions) {
    await prisma.question.create({
      data: q,
    });
  }

  console.log(`Created ${allQuestions.length} questions`);

  // Create badges
  const badges = [
    {
      name: 'Logic Master',
      description: 'Complete the IQ assessment',
      icon: '🧠',
      category: 'IQ' as QuestionCategory,
      level: 1,
    },
    {
      name: 'Logic Explorer',
      description: 'Start the IQ assessment',
      icon: '🔍',
      category: 'IQ' as QuestionCategory,
      level: 1,
    },
    {
      name: 'Empathy Explorer',
      description: 'Complete the EQ assessment',
      icon: '❤️',
      category: 'EQ' as QuestionCategory,
      level: 1,
    },
    {
      name: 'Emotional Detective',
      description: 'Excel in emotional recognition',
      icon: '🕵️',
      category: 'EQ' as QuestionCategory,
      level: 2,
    },
    {
      name: 'Purpose Pathfinder',
      description: 'Complete the SQ assessment',
      icon: '✨',
      category: 'SQ' as QuestionCategory,
      level: 1,
    },
    {
      name: 'Meaning Seeker',
      description: 'Show deep value alignment',
      icon: '🌟',
      category: 'SQ' as QuestionCategory,
      level: 2,
    },
    {
      name: 'Leadership Pathfinder',
      description: 'Complete the Leadership assessment',
      icon: '🎯',
      category: 'LEADERSHIP' as QuestionCategory,
      level: 1,
    },
    {
      name: 'Visionary Leader',
      description: 'Excel in leadership vision',
      icon: '👁️',
      category: 'LEADERSHIP' as QuestionCategory,
      level: 3,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.create({
      data: badge,
    });
  }

  console.log(`Created ${badges.length} badges`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
