import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, AlertCircle, ArrowLeft } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription>Something went wrong during authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  Error code: {params.error}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Please try again or contact support if the problem persists.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/auth/login">Try Again</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
