"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Smile, 
  Sparkles,
  Heart,
  Target,
  Calendar,
  Users,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn, formatTime } from "@/lib/utils"
import { voiceUtils } from "@/lib/ai"

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: 'motivation',
    label: 'Daily Motivation',
    icon: Sparkles,
    action: 'motivation',
    color: 'text-yellow-500'
  },
  {
    id: 'goals',
    label: 'Set Goals',
    icon: Target,
    action: 'goals',
    color: 'text-blue-500'
  },
  {
    id: 'activities',
    label: 'Find Activities',
    icon: Heart,
    action: 'activities',
    color: 'text-red-500'
  },
  {
    id: 'plan',
    label: 'Plan Day',
    icon: Calendar,
    action: 'plan',
    color: 'text-green-500'
  },
  {
    id: 'social',
    label: 'Social Events',
    icon: Users,
    action: 'social',
    color: 'text-purple-500'
  }
]

const quickResponses = [
  "I'm feeling motivated today!",
  "I need some support right now",
  "What should I do today?",
  "I'm struggling with urges",
  "Help me plan something fun"
]

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! I'm Goon, your AI companion. I'm here to support your journey and help you build an amazing life. How are you feeling today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowQuickActions(false)

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }]
      })

      // Speak the response if enabled
      if (speechEnabled) {
        await voiceUtils.speakText(data.message)
      }

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm having trouble responding right now. Please try again in a moment!",
          timestamp: new Date()
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    const actionMessages = {
      motivation: "Give me some daily motivation!",
      goals: "Help me set some goals for today",
      activities: "What activities should I do today?",
      plan: "Help me plan my day",
      social: "Suggest some social activities for me"
    }

    const message = actionMessages[action as keyof typeof actionMessages] || `Help me with ${action}`
    await sendMessage(message)
  }

  const handleQuickResponse = async (response: string) => {
    await sendMessage(response)
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const transcription = await voiceUtils.transcribeAudio(audioBlob)
        
        if (transcription) {
          setInput(transcription)
          inputRef.current?.focus()
        }
        
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsListening(true)
    } catch (error) {
      console.error('Microphone error:', error)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <Card variant="glass" className="h-[600px] flex flex-col">
      <CardHeader className="flex-none bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Smile className="h-6 w-6 text-primary animate-pulse-soft" />
            </div>
            <div>
              <h3 className="font-semibold">Goon AI</h3>
              <p className="text-sm text-muted-foreground">Your recovery companion</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={cn(speechEnabled && "text-primary")}
          >
            {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    message.role === "user"
                      ? "neu-pressed bg-primary text-primary-foreground ml-4"
                      : "neu-flat bg-secondary text-secondary-foreground mr-4"
                  )}
                >
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Goon is thinking...</span>
                    </div>
                  ) : (
                    <>
                      <div>{message.content}</div>
                      <div className="text-xs opacity-70 mt-2">
                        {formatTime(message.timestamp)}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border-t border-border"
            >
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="flex flex-col gap-1 h-auto p-3 neu-subtle hover:neu-flat"
                    >
                      <action.icon className={cn("h-4 w-4", action.color)} />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground">Quick Responses</h5>
                  <div className="flex flex-wrap gap-2">
                    {quickResponses.map((response, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickResponse(response)}
                        className="text-xs neu-subtle hover:neu-flat"
                      >
                        {response}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="flex-none p-4 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Ask Goon anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <Button
              size="icon"
              variant={isListening ? "destructive" : "secondary"}
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={cn(isListening && "animate-pulse")}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              size="icon" 
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}