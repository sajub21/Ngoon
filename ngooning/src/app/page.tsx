"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  Map, 
  Heart, 
  Target, 
  Trophy,
  Sparkles,
  Send,
  Mic,
  Smile
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: MessageCircle,
    title: "Goon AI Assistant",
    description: "24/7 support and motivation from your personal AI companion",
    color: "text-blue-500"
  },
  {
    icon: Calendar,
    title: "Smart Planning",
    description: "Sync with Google & Apple Calendar for seamless scheduling",
    color: "text-green-500"
  },
  {
    icon: Users,
    title: "Social Recovery",
    description: "Connect with verified groups and plan real-world meetups",
    color: "text-purple-500"
  },
  {
    icon: Map,
    title: "Trip Planner",
    description: "Book flights, hotels, and discover activities with friends",
    color: "text-orange-500"
  },
  {
    icon: Heart,
    title: "Habit Tracking",
    description: "Build better habits and track your recovery journey",
    color: "text-red-500"
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set and achieve meaningful life goals with AI guidance",
    color: "text-indigo-500"
  }
]

const chatMessages = [
  {
    id: 1,
    type: "assistant",
    content: "Hey! I'm Goon, your AI companion. Ready to start building a better life together? 🌟",
    time: "now"
  },
  {
    id: 2,
    type: "user",
    content: "I'm struggling today. Can you help me stay motivated?",
    time: "1m ago"
  },
  {
    id: 3,
    type: "assistant",
    content: "Of course! Remember why you started this journey. You've already come so far - 12 days clean! Let's plan something fun for today. Want to explore some local activities or connect with your support group?",
    time: "1m ago"
  }
]

export default function HomePage() {
  const [message, setMessage] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleSendMessage = () => {
    if (!message.trim()) return
    // TODO: Implement AI chat functionality
    setMessage("")
  }

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // TODO: Implement voice recognition
  }

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Recovery Platform
          </motion.div>
          
          <h1 className="text-hero bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Rebuild Your Life with
            <br />
            <span className="text-accent-foreground">NGooning</span>
          </h1>
          
          <p className="text-subtitle max-w-2xl mx-auto">
            Stop watching porn, make real friends, and plan amazing experiences with your AI companion Goon. 
            Join thousands already transforming their lives.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="w-full sm:w-auto">
            Start Free Trial
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Chat with Goon
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8"
        >
          <Card variant="glass" className="text-center p-4">
            <div className="text-2xl font-bold text-primary">12K+</div>
            <div className="text-sm text-muted-foreground">Members</div>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="text-2xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </Card>
          <Card variant="glass" className="text-center p-4">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </Card>
        </motion.div>
      </motion.section>

      {/* Goon AI Chat Demo */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <Card variant="glass" className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              Chat with Goon
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.type === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex",
                    msg.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      msg.type === "user"
                        ? "neu-pressed bg-primary text-primary-foreground ml-4"
                        : "neu-flat bg-secondary text-secondary-foreground mr-4"
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Ask Goon anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full"
                  />
                </div>
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "secondary"}
                  onClick={handleVoiceInput}
                >
                  <Mic className={cn("h-4 w-4", isListening && "animate-pulse")} />
                </Button>
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-title">Everything You Need to Rebuild</h2>
          <p className="text-subtitle">Comprehensive tools for recovery and growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <Card variant="flat" hover interactive className="h-full">
                <CardContent className="p-6 space-y-4">
                  <div className={cn("w-12 h-12 rounded-2xl neu-flat flex items-center justify-center", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="text-center py-16"
      >
        <Card variant="gradient" className="max-w-2xl mx-auto">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <Trophy className="h-16 w-16 mx-auto text-primary animate-float" />
              <h2 className="text-title">Ready to Transform Your Life?</h2>
              <p className="text-muted-foreground">
                Join thousands who've already started their journey to a better life. 
                30-day free trial, cancel anytime.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
              <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}
