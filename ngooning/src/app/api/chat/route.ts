import { NextRequest, NextResponse } from 'next/server'
import { goonAI, type GoonMessage, type GoonContext } from '@/lib/ai'
import { auth } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await auth.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messages, context } = body as {
      messages: GoonMessage[]
      context?: Partial<GoonContext>
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Build context for the AI
    const aiContext: GoonContext = {
      userId: user.id,
      userName: user.user_metadata?.full_name || user.user_metadata?.username,
      timeOfDay: getTimeOfDay(),
      ...context
    }

    // Get AI response
    const response = await goonAI.chat(messages, aiContext)

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await auth.getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type')

    switch (type) {
      case 'motivation':
        const motivation = await goonAI.generateDailyMotivation({
          userId: user.id,
          userName: user.user_metadata?.full_name
        })
        return NextResponse.json({ message: motivation })

      case 'activities':
        const mood = url.searchParams.get('mood')
        const preferences = url.searchParams.get('preferences')?.split(',')
        const activities = await goonAI.suggestActivities(
          { userId: user.id, timeOfDay: getTimeOfDay() },
          mood || undefined,
          preferences
        )
        return NextResponse.json({ activities })

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

  } catch (error) {
    console.error('Chat GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'late night'
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 21) return 'evening'
  return 'night'
}