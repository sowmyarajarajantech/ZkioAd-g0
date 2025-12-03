"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { LandingNav } from "@/components/landing/nav"
import { LandingFooter } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Target, Users, Handshake, Send, CheckCircle, Sparkles, Globe, Award } from "lucide-react"

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Roadmaps Completed", value: "120K+", icon: CheckCircle },
  { label: "Countries", value: "80+", icon: Globe },
  { label: "Badges Earned", value: "500K+", icon: Award },
]

const partners = [
  { name: "TechCorp", logo: "/techcorp-logo.png" },
  { name: "EduLearn", logo: "/generic-education-logo.png" },
  { name: "CodeAcademy", logo: "/codeacademy-logo.jpg" },
  { name: "DevHub", logo: "/devhub-logo.jpg" },
  { name: "SkillForge", logo: "/skillforge-logo.jpg" },
]

export default function AboutPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({ name: "", email: "", message: "" })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
                  About <span className="text-primary">ZkioAd</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  ZkioAd is a revolutionary gamified learning platform designed specifically for students. We believe
                  that learning should be engaging, rewarding, and fun. Our platform transforms traditional education
                  into an interactive journey where every milestone brings you closer to mastery.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Founded in 2024, ZkioAd has quickly become the go-to platform for students worldwide who want to track
                  their progress, earn achievements, and connect with a community of like-minded learners. Whether
                  you&apos;re diving into Data Structures, exploring AI, or mastering Web Development, ZkioAd is your
                  companion for success.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border">
                  <Image
                    src="/team-of-students-learning-together-with-laptops-in.jpg"
                    alt="ZkioAd Team"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">50K+</p>
                      <p className="text-sm text-muted-foreground">Active Learners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
                <Target className="h-4 w-4" />
                <span>Our Vision</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-balance">
                Empowering Every Student to Reach Their Full Potential
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a world where every student has access to structured, engaging, and personalized learning
                paths. ZkioAd aims to bridge the gap between traditional education and modern learning needs by
                combining gamification, community support, and AI-powered recommendations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To make learning accessible, engaging, and rewarding for students everywhere through gamified
                    roadmaps and community-driven growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We continuously evolve our platform with AI-powered suggestions, personalized learning paths, and
                    cutting-edge gamification techniques.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Building a supportive global community where students motivate each other, share knowledge, and
                    celebrate achievements together.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">ZkioAd by the Numbers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students worldwide who are transforming their learning journey with ZkioAd.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center border-2">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Collaborations */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
                <Handshake className="h-4 w-4" />
                <span>Our Partners</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by Industry Leaders</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We collaborate with top educational institutions and tech companies to bring you the best learning
                experience.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
                >
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
                  <Send className="h-4 w-4" />
                  <span>Get in Touch</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you.
                </p>
              </div>

              <Card className="border-2">
                <CardContent className="pt-6">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-4">
                        Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          rows={5}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
