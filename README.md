# ICEAS - Inclufy Cognitive & Emotional Assessment System

A comprehensive intelligence assessment platform that combines **IQ**, **EQ**, **SQ**, and **Leadership** evaluations to create personalized "Mindprints" for users.

## Features

### Core Features

- **Multi-Domain Assessment**: Evaluate cognitive, emotional, social/spiritual, and leadership intelligence
- **AI-Powered Personalization**: Optional question reframing based on user context without changing difficulty
- **Gamification**: Badges, levels, XP, and progress tracking to keep users engaged
- **Visual Dashboards**: Interactive charts including IQ gauges, EQ radars, and SQ trees
- **Microlearning**: Personalized 5-day learning plans with actionable insights
- **Admin Portal**: Manage questions, view analytics, and configure branding
- **Widget Integration**: Embeddable assessment widget for external websites

### Intelligence Categories

1. **IQ (Cognitive Intelligence)**
   - Visual & Spatial Reasoning
   - Numerical Analysis
   - Verbal Intelligence
   - Pattern Recognition

2. **EQ (Emotional Intelligence)**
   - Self-Awareness
   - Self-Control
   - Empathy
   - Motivation
   - Social Skills

3. **SQ (Social/Spiritual Intelligence)**
   - Values & Purpose
   - Ethical Reasoning
   - Connection & Compassion

4. **Leadership Assessment**
   - Leadership Potential Index (LPI)
   - Vision, Empathy, Resilience, Ethics, Drive
   - Leadership style classification

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API for question reframing and insights
- **Charts**: Recharts
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd test-iq-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/iceas_db?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**

```bash
# Push the Prisma schema to your database
npm run db:push

# Seed the database with sample questions and badges
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Account

After seeding, you can log in with:

- **Email**: `admin@iceas.app`
- **Password**: `admin123`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── assessment/   # Assessment management
│   │   ├── results/      # Results retrieval
│   │   └── dashboard/    # Dashboard data
│   ├── auth/             # Auth pages (login, register)
│   ├── start/            # Assessment intake page
│   ├── assessment/       # Assessment taking pages
│   ├── results/          # Results visualization
│   ├── dashboard/        # User dashboard
│   ├── microlearning/    # Learning plans
│   ├── admin/            # Admin portal
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   ├── openai.ts         # OpenAI integration
│   ├── scoring.ts        # Scoring algorithms
│   └── utils.ts          # Utility functions
└── types/
    └── next-auth.d.ts    # NextAuth type extensions

prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Seed data

public/
└── widget.js             # Embeddable widget script
```

## User Flows

### 1. Standard Assessment Flow

1. User registers/logs in
2. Selects "Default Test" mode
3. Completes IQ, EQ, SQ questions
4. Views results dashboard with gauges and insights
5. Receives microlearning recommendations

### 2. Custom Assessment Flow

1. User selects "Customize for Me"
2. Provides bio, role, and industry
3. AI reframes questions contextually
4. Completes assessment with personalized wording
5. Views results and insights

### 3. Leadership Assessment Flow

1. User or organization selects "Leadership Assessment"
2. Completes IQ, EQ, SQ + Leadership questions
3. Receives Leadership Potential Index (LPI)
4. Views leadership style and radar chart
5. Gets leadership-specific microlearning plan

## Key Pages

### Landing Page (`/`)
- Feature overview
- Assessment types explanation
- Call-to-action to start

### Assessment Intake (`/start`)
- Choose assessment mode: Default, Custom, or Leadership
- Optional bio/context input for AI reframing

### Assessment Page (`/assessment/[id]`)
- Question-by-question interface
- Progress tracking
- Category badges and difficulty indicators

### Results Dashboard (`/results/[id]`)
- IQ, EQ, SQ, LPI scores
- Radar charts for EQ and SQ
- AI-generated insights
- Strengths and growth areas

### User Dashboard (`/dashboard`)
- Assessment history
- Badges and achievements
- XP, level, and streak tracking

### Microlearning (`/microlearning/[id]`)
- Insight cards
- 5-day learning plan
- Progress tracking

### Admin Portal (`/admin`)
- Question management
- Analytics dashboard
- Widget integration code

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Assessment
- `POST /api/assessment/start` - Start new assessment
- `GET /api/assessment/[id]/questions` - Fetch questions
- `POST /api/assessment/[id]/answer` - Submit answer
- `POST /api/assessment/[id]/complete` - Complete assessment

### Results
- `GET /api/results/[id]` - Get assessment results

### Dashboard
- `GET /api/dashboard` - Get user dashboard data

## Scoring Algorithms

### IQ Score
- Based on accuracy × question difficulty
- Normalized to 100-200 scale
- Percentile calculated using normal distribution

### EQ Score
- Sentiment-weighted scoring
- 5 domain breakdown (Self-awareness, Control, Empathy, Motivation, Social)

### SQ Score
- Values-based scoring
- 5 domain breakdown (Values, Purpose, Connection, Compassion, Ethics)

### Leadership Potential Index (LPI)
```
LPI = 0.30 × IQ + 0.35 × EQ + 0.20 × SQ + 0.15 × Behavior
```

## Widget Integration

Embed ICEAS on any website:

```html
<div id="iceas-widget"></div>
<script src="https://your-domain.com/widget.js"
        data-client="your-tenant-id"
        data-mode="leadership">
</script>
```

### Widget Events

Listen for completion:

```javascript
window.addEventListener('iceas:complete', (event) => {
  console.log('Assessment completed:', event.detail);
});
```

## Gamification System

- **XP System**: Earn 100 XP per completed assessment
- **Levels**: Calculated from XP (Level = √(XP/100) + 1)
- **Badges**:
  - Logic Explorer (IQ start)
  - Logic Master (IQ complete)
  - Empathy Explorer (EQ complete)
  - Purpose Pathfinder (SQ complete)
  - Leadership Pathfinder (Leadership complete)

## Database Schema

Key models:
- **User**: Authentication and profile
- **Assessment**: Test instances
- **Question**: Question bank (IQ/EQ/SQ/Leadership)
- **Answer**: User responses
- **Result**: Calculated scores and insights
- **Badge**: Achievement definitions
- **UserBadge**: Earned badges
- **UserProgress**: XP, level, streak
- **MicrolearningPlan**: Personalized learning

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data

### Adding Questions

Questions can be added through the admin portal or directly via Prisma:

```typescript
await prisma.question.create({
  data: {
    category: 'IQ',
    type: 'MULTIPLE_CHOICE',
    difficulty: 3,
    text: 'Your question text...',
    options: JSON.stringify(['Option 1', 'Option 2', 'Option 3', 'Option 4']),
    correctAnswer: JSON.stringify('Option 2'),
    explanation: 'Explanation of correct answer...',
  },
});
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Setup

Recommended: Use a managed PostgreSQL service like:
- Vercel Postgres
- Supabase
- Railway
- Neon

## Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Team/organization accounts
- [ ] Question versioning
- [ ] A/B testing for questions
- [ ] Mobile app
- [ ] Social sharing of results
- [ ] Retake recommendations
- [ ] Progress comparison over time
- [ ] Custom branding per tenant

## License

This project is proprietary software developed for Inclufy.

## Support

For issues or questions, please contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and AI
