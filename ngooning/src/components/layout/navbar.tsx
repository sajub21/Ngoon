"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  Calendar, 
  Users, 
  Map, 
  MessageCircle, 
  User, 
  Menu, 
  X,
  Settings,
  Heart,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Calendar", href: "/calendar", icon: Calendar, badge: 3 },
  { name: "Social", href: "/social", icon: Users, badge: 12 },
  { name: "Explore", href: "/explore", icon: Map },
  { name: "Chat", href: "/chat", icon: MessageCircle, badge: 2 },
]

const userMenuItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Habits", href: "/habits", icon: Heart },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("/")

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <Card 
          variant="glass" 
          className="flex items-center gap-2 p-2 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.href)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                activeItem === item.href
                  ? "neu-pressed text-primary"
                  : "hover:neu-flat text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden lg:block">{item.name}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </Card>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16">
          <Card 
            variant="glass" 
            className="flex items-center justify-between p-4 m-4 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-gray-900/10"
          >
            <Link href="/" className="text-2xl font-bold text-primary">
              NGooning
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </Card>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-80 max-w-[85vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <Card variant="flat" className="h-full w-full rounded-none rounded-l-3xl p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 pt-16">
                      <h2 className="text-xl font-semibold">Menu</h2>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h3>
                        {navItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                              setActiveItem(item.href)
                              setIsMobileMenuOpen(false)
                            }}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 relative",
                              activeItem === item.href
                                ? "neu-pressed text-primary"
                                : "hover:neu-flat text-foreground"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto h-6 w-6 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Account</h3>
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:neu-flat text-foreground transition-all duration-200"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-4 left-4 right-4 z-50">
          <Card 
            variant="glass" 
            className="flex items-center justify-around p-2 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20"
          >
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                  activeItem === item.href
                    ? "neu-pressed text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </Card>
        </nav>
      </div>
    </>
  )
}