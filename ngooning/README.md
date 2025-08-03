# NGooning - AI Social Recovery & Lifestyle Planner

A modern full-featured app helping young people stop watching porn, rebuild their lives, make new friends, and plan real-world experiences with an AI assistant named Goon.

## 🌟 Features

### 🤖 Goon AI Assistant
- 24/7 recovery support and motivation
- Context-aware conversations with memory
- Voice input and text-to-speech capabilities
- Personalized activity suggestions
- Crisis support and emergency plans

### 🤝 Social Recovery System
- Verified friend groups and communities
- Real-world meetup planning
- Group chat and voice channels
- Anonymous mode for privacy
- Recovery-focused social activities

### 📅 Smart Calendar Integration
- Google Calendar & Apple Calendar sync
- AI-generated daily plans
- Habit tracking with streaks
- Goal setting and progress monitoring
- Recovery milestone celebrations

### ✈️ Trip & Activity Planner
- Skyscanner flight booking integration
- TripAdvisor recommendations
- Group trip planning and cost splitting
- Local event discovery
- Mapbox/Google Maps integration

### 💳 Premium Subscription
- 30-day free trial
- £10/month premium access
- Stripe payment processing
- Enhanced AI features
- Priority support

## 🎨 Design System

Built with **Neumorphism** design language:
- Soft, extruded UI components
- Subtle inner and outer shadows
- Apple iOS and Tesla OS inspired
- Light and dark theme support
- Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with custom neumorphic styling
- **Backend**: Supabase (Auth, Database, Real-time)
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 with custom recovery prompts
- **Payments**: Stripe
- **Email**: Resend
- **Maps**: Google Maps / Mapbox
- **Mobile**: Capacitor for iOS/Android deployment
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- OpenAI API key
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ngooning
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="your-postgresql-url"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Development

### iOS/Android Build Setup

1. **Install Capacitor CLI**
   ```bash
   npm install -g @capacitor/cli
   ```

2. **Build the web app**
   ```bash
   npm run build
   ```

3. **Add mobile platforms**
   ```bash
   npx cap add ios
   npx cap add android
   ```

4. **Sync and open in native IDE**
   ```bash
   npx cap sync
   npx cap open ios     # Opens in Xcode
   npx cap open android # Opens in Android Studio
   ```

## 🏗️ Project Structure

```
ngooning/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── chat/           # Chat with Goon page
│   │   └── ...
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/         # Layout components
│   │   ├── chat/           # Chat interface
│   │   └── ...
│   └── lib/                # Utilities and services
│       ├── ai.ts           # Goon AI service
│       ├── supabase.ts     # Database client
│       └── utils.ts        # Helper functions
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── ...
```

## 🎯 Current Features Status

### ✅ Completed
- [x] Neumorphic design system with Tailwind CSS
- [x] Core UI components (Button, Card, Input, etc.)
- [x] Responsive navigation with mobile support
- [x] Goon AI assistant with OpenAI integration
- [x] Chat interface with voice support
- [x] Database schema with Prisma
- [x] Supabase authentication setup

### 🚧 In Development
- [ ] Social system (groups, messaging)
- [ ] Calendar integration (Google/Apple)
- [ ] Trip planning with external APIs
- [ ] Stripe payment integration
- [ ] Habit tracking system
- [ ] Mobile app deployment

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma migrate   # Create database migration

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues

# Mobile
npx cap sync         # Sync web build to mobile
npx cap run ios      # Run on iOS simulator
npx cap run android  # Run on Android emulator
```

## 🎨 Design Guidelines

### Neumorphic Components
All UI components follow the neumorphic design principles:

```css
/* Light mode */
.neu-flat {
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
}

/* Dark mode */
.dark .neu-flat {
  box-shadow: 8px 8px 16px #1a202c, -8px -8px 16px #4a5568;
}
```

### Color Palette
- **Primary**: Recovery-focused blues and greens
- **Secondary**: Soft grays for backgrounds
- **Accent**: Motivational colors (success greens, warning oranges)
- **Neumorphic**: Light/dark variants for depth

## 🧪 Testing the AI Assistant

To test Goon AI locally:

1. Ensure your OpenAI API key is set in `.env.local`
2. Navigate to `/chat` page
3. Try these sample conversations:
   - "I'm struggling today, can you help?"
   - "What activities should I do this weekend?"
   - "Help me set some recovery goals"
   - "I'm feeling lonely, how can I meet people?"

## 🔐 Environment Variables

### Required for Basic Functionality
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenAI API key for Goon AI

### Optional for Full Features
- `STRIPE_PUBLIC_KEY` & `STRIPE_SECRET_KEY` - Payment processing
- `GOOGLE_MAPS_API_KEY` - Map integration
- `RESEND_API_KEY` - Email notifications

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

For support, email support@ngooning.com or join our Discord community.

---

**NGooning** - Building lives so good you don't want to escape from them. 🌟
