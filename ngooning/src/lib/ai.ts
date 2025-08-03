import OpenAI from 'openai'
import { supabase } from './supabase'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface GoonMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    mood?: string
    context?: string
    actionItems?: string[]
  }
}

export interface GoonContext {
  userId: string
  userName?: string
  recoveryDays?: number
  currentStreak?: number
  longestStreak?: number
  recentGoals?: any[]
  upcomingEvents?: any[]
  mood?: string
  timeOfDay?: string
  location?: string
}

class GoonAI {
  private systemPrompt = `You are Goon, an empathetic AI companion designed to help young people overcome porn addiction and build better lives. Your mission is to provide:

1. **Recovery Support**: Motivational guidance, coping strategies, and relapse prevention
2. **Social Connection**: Help users find real-world friendships and meaningful activities  
3. **Life Planning**: Assist with goal setting, habit building, and life experiences
4. **Emotional Intelligence**: Recognize mood, provide comfort, and encourage growth

**Your Personality:**
- Warm, understanding, and non-judgmental
- Encouraging but realistic about challenges
- Focused on practical solutions and real-world action
- Supportive of healthy relationships and activities
- Knowledgeable about recovery science and social psychology

**Key Guidelines:**
- Always maintain hope and positivity while acknowledging struggles
- Encourage real-world activities over digital escapism
- Suggest specific actionable steps, not just general advice
- Help users connect with others when appropriate
- Track progress and celebrate wins, no matter how small
- Be conversational and relatable, not clinical or robotic

**Available Actions:**
- Plan social activities and meetups
- Suggest habit tracking and goal setting
- Recommend local events and experiences
- Help with calendar scheduling
- Connect users with support groups
- Provide crisis support and motivation

Remember: You're here to help them build a life so good they don't want to escape from it.`

  async chat(messages: GoonMessage[], context: GoonContext): Promise<string> {
    try {
      // Build context-aware system message
      const contextualPrompt = this.buildContextualPrompt(context)
      
      // Prepare messages for OpenAI
      const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.systemPrompt + '\n\n' + contextualPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      ]

      const completion = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      })

      const response = completion.choices[0]?.message?.content || "I'm here to help! Could you tell me more about what's on your mind?"

      // Log the interaction
      await this.logInteraction(context.userId, messages[messages.length - 1]?.content || '', response, {
        tokensUsed: completion.usage?.total_tokens,
        cost: this.calculateCost(completion.usage?.total_tokens || 0),
        context: context
      })

      return response
    } catch (error) {
      console.error('Goon AI Error:', error)
      return "I'm experiencing some technical difficulties right now. Let me try to help you in a different way. What's the most important thing you need support with today?"
    }
  }

  private buildContextualPrompt(context: GoonContext): string {
    let prompt = `**Current User Context:**\n`
    
    if (context.userName) {
      prompt += `- User: ${context.userName}\n`
    }
    
    if (context.recoveryDays !== undefined) {
      prompt += `- Recovery Journey: ${context.recoveryDays} days since starting\n`
    }
    
    if (context.currentStreak !== undefined) {
      prompt += `- Current Streak: ${context.currentStreak} days clean\n`
    }
    
    if (context.longestStreak !== undefined && context.longestStreak > 0) {
      prompt += `- Personal Best: ${context.longestStreak} days\n`
    }
    
    if (context.timeOfDay) {
      prompt += `- Time: ${context.timeOfDay}\n`
    }
    
    if (context.mood) {
      prompt += `- Current Mood: ${context.mood}\n`
    }
    
    if (context.recentGoals && context.recentGoals.length > 0) {
      prompt += `- Active Goals: ${context.recentGoals.map(g => g.title).join(', ')}\n`
    }
    
    if (context.upcomingEvents && context.upcomingEvents.length > 0) {
      prompt += `- Upcoming Events: ${context.upcomingEvents.map(e => e.title).join(', ')}\n`
    }

    prompt += `\nTailor your response to their current situation and progress. Be specific and personal.`
    
    return prompt
  }

  async generateDailyMotivation(context: GoonContext): Promise<string> {
    const motivationPrompt = `Generate a personalized daily motivation message for ${context.userName || 'this user'} based on their recovery journey. 

    Context:
    - ${context.currentStreak || 0} days current streak
    - ${context.longestStreak || 0} days personal best
    - Goals: ${context.recentGoals?.map(g => g.title).join(', ') || 'Building better habits'}
    
    Make it encouraging, specific to their progress, and include a suggested action for today. Keep it under 150 words.`

    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: motivationPrompt }
        ],
        temperature: 0.8,
        max_tokens: 200,
      })

      return completion.choices[0]?.message?.content || "Today is a new opportunity to build the life you want. What's one small step you can take right now?"
    } catch (error) {
      console.error('Daily motivation error:', error)
      return "Every day is progress, even if it doesn't feel like it. You're stronger than you know! 💪"
    }
  }

  async suggestActivities(context: GoonContext, mood?: string, preferences?: string[]): Promise<string[]> {
    const activityPrompt = `Suggest 5 specific real-world activities for someone in recovery who is feeling ${mood || 'neutral'}.

    Context:
    - Location: ${context.location || 'general suggestions'}
    - Interests: ${preferences?.join(', ') || 'varied activities'}
    - Time of day: ${context.timeOfDay || 'any time'}
    
    Focus on:
    - Social connections and meeting new people
    - Physical activities and outdoor experiences
    - Creative and skill-building pursuits
    - Community involvement and volunteer opportunities
    - Healthy entertainment and cultural activities
    
    Return as a simple numbered list, each item should be actionable and specific.`

    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are a helpful assistant focused on suggesting healthy, real-world activities.' },
          { role: 'user', content: activityPrompt }
        ],
        temperature: 0.9,
        max_tokens: 300,
      })

      const response = completion.choices[0]?.message?.content || ''
      return response.split('\n').filter(line => line.trim() && /^\d+\./.test(line.trim())).map(line => line.replace(/^\d+\.\s*/, ''))
    } catch (error) {
      console.error('Activity suggestion error:', error)
      return [
        'Take a walk in a local park or nature area',
        'Visit a coffee shop and strike up a conversation',
        'Join a fitness class or sports group',
        'Attend a community event or workshop',
        'Volunteer for a local charity or cause'
      ]
    }
  }

  async analyzeRelapseTriggers(context: GoonContext, situation: string): Promise<{
    triggers: string[]
    strategies: string[]
    emergencyPlan: string[]
  }> {
    const analysisPrompt = `Analyze this situation for potential relapse triggers and provide coping strategies:

    Situation: "${situation}"
    
    User context:
    - Current streak: ${context.currentStreak || 0} days
    - Mood: ${context.mood || 'not specified'}
    
    Provide:
    1. Potential triggers in this situation
    2. Specific coping strategies
    3. Emergency plan if urges become strong
    
    Format as JSON with keys: triggers, strategies, emergencyPlan (each as arrays of strings)`

    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.systemPrompt + '\n\nYou are analyzing situations for recovery support. Be specific and practical.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.6,
        max_tokens: 400,
      })

      const response = completion.choices[0]?.message?.content || ''
      
      try {
        return JSON.parse(response)
      } catch {
        // Fallback if JSON parsing fails
        return {
          triggers: ['Stress', 'Isolation', 'Boredom'],
          strategies: ['Take deep breaths', 'Call a friend', 'Go for a walk'],
          emergencyPlan: ['Contact support group', 'Use emergency contact', 'Visit public space']
        }
      }
    } catch (error) {
      console.error('Trigger analysis error:', error)
      return {
        triggers: ['Emotional stress', 'Being alone', 'Unstructured time'],
        strategies: ['Practice mindfulness', 'Reach out to someone', 'Engage in physical activity'],
        emergencyPlan: ['Call crisis line', 'Go to public place', 'Contact accountability partner']
      }
    }
  }

  private async logInteraction(userId: string, prompt: string, response: string, metadata: any) {
    try {
      await supabase
        .from('ai_logs')
        .insert([{
          userId,
          type: 'CHAT',
          prompt,
          response,
          metadata,
          tokensUsed: metadata.tokensUsed,
          cost: metadata.cost
        }])
    } catch (error) {
      console.error('Failed to log AI interaction:', error)
    }
  }

  private calculateCost(tokens: number): number {
    // GPT-4 Turbo pricing (approximate)
    const inputCostPerToken = 0.00001
    const outputCostPerToken = 0.00003
    // Rough estimate assuming 50/50 split
    return (tokens * inputCostPerToken + tokens * outputCostPerToken) / 2
  }
}

export const goonAI = new GoonAI()

// Voice processing utilities
export const voiceUtils = {
  // Speech-to-text would typically use a service like OpenAI Whisper
  transcribeAudio: async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('model', 'whisper-1')

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      })

      const result = await response.json()
      return result.text || ''
    } catch (error) {
      console.error('Speech transcription error:', error)
      return ''
    }
  },

  // Text-to-speech would typically use browser API or external service
  speakText: async (text: string): Promise<void> => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      
      // Try to use a natural-sounding voice
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Natural') || 
        voice.name.includes('Enhanced') ||
        voice.lang.startsWith('en')
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      speechSynthesis.speak(utterance)
    }
  }
}