"use client"

import React from "react"
import { motion } from "framer-motion"
import { ChatInterface } from "@/components/chat/chat-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Heart, 
  Target, 
  Calendar,
  Users,
  MessageCircle,
  HelpCircle
} from "lucide-react"

const helpTopics = [
  {
    icon: Heart,
    title: "Recovery Support",
    description: "Get motivation and coping strategies",
    examples: ["I'm struggling today", "Celebrate my milestone", "Need accountability"]
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Plan and track your objectives",
    examples: ["Set daily goals", "Track my progress", "Long-term planning"]
  },
  {
    icon: Calendar,
    title: "Activity Planning",
    description: "Organize your day and schedule events",
    examples: ["Plan my day", "Schedule workout", "Free time ideas"]
  },
  {
    icon: Users,
    title: "Social Connection",
    description: "Find friends and plan meetups",
    examples: ["Meet new people", "Plan group activities", "Social anxiety help"]
  }
]

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-title flex items-center justify-center gap-2">
                <MessageCircle className="h-8 w-8 text-primary" />
                Chat with Goon
              </h1>
              <p className="text-subtitle">
                Your AI companion for recovery, growth, and building an amazing life
              </p>
            </div>
            
            <ChatInterface />
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <Card variant="gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Days Clean</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">25</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                View Full Stats
              </Button>
            </CardContent>
          </Card>

          {/* Help Topics */}
          <Card variant="flat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                What can Goon help with?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {helpTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-3 rounded-xl neu-subtle hover:neu-flat transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg neu-flat flex items-center justify-center">
                      <topic.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{topic.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{topic.description}</p>
                      <div className="space-y-1">
                        {topic.examples.map((example, i) => (
                          <div key={i} className="text-xs text-muted-foreground bg-muted/20 rounded px-2 py-1">
                            "{example}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-sm">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p>• Use voice input for hands-free chatting</p>
                <p>• Ask for specific daily plans and activities</p>
                <p>• Share your mood for personalized support</p>
                <p>• Request accountability check-ins</p>
                <p>• Get help planning social events</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}