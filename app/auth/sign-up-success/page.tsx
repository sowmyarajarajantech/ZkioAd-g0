import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ZkioAd</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-2 text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to confirm your account and start your learning journey. The link will
                expire in 24 hours.
              </p>
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="font-medium mb-1">Didn&apos;t receive the email?</p>
                <p className="text-muted-foreground">
                  Check your spam folder or try signing up again with a different email.
                </p>
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/auth/login">
                  Go to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
