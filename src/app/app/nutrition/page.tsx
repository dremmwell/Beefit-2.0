import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CalendarDays,
  Beef,
  CheckCircle2,
  CircleDot,
  CookingPot,
  ListChecks,
  Sparkles,
  Target,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const tutorialSteps: {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Build your ingredient base",
    description:
      "Start by saving the nutritional values of the foods you use all the time so the rest of the app becomes faster and more accurate.",
    href: "/app/ingredients",
    cta: "Open ingredients",
    icon: Beef,
  },
  {
    title: "Craft recipes from your ingredients",
    description:
      "Turn your usual meals into reusable recipes. Every ingredient you already entered can be combined into recipes with automatic nutrition totals.",
    href: "/app/recipes",
    cta: "Create recipes",
    icon: CookingPot,
  },
  {
    title: "Set your objective",
    description:
      "Define your calorie and macro targets so the app knows what you are aiming for and can compare your daily intake against it.",
    href: "/app/objectives",
    cta: "Set objectives",
    icon: Target,
  },
  {
    title: "Track every day",
    description:
      "Log meals during the day, mix individual ingredients and recipes, and watch calories, protein, carbs, and fats move toward your target.",
    href: "/app/today",
    cta: "Track today",
    icon: Utensils,
  },
  {
    title: "Review the week",
    description:
      "Use the weekly overview to see your consistency, spot patterns, and decide what to adjust for the next few days.",
    href: "/app/overview",
    cta: "See overview",
    icon: CalendarDays,
  },
];

const quickLinks = [
  { label: "Ingredients", href: "/app/ingredients" },
  { label: "Recipes", href: "/app/recipes" },
  { label: "Objectives", href: "/app/objectives" },
  { label: "Today", href: "/app/today" },
  { label: "Overview", href: "/app/overview" },
];

const dailyPreview = [
  { label: "Calories", value: 78, helper: "1,950 / 2,500 kcal" },
  { label: "Protein", value: 84, helper: "168 / 200 g" },
  { label: "Carbs", value: 63, helper: "220 / 350 g" },
  { label: "Fats", value: 56, helper: "45 / 80 g" },
];

export default async function Page() { 

      // Validating Path if valid user // 
    const { user } = await validateRequest()
      if(!user) {
        return redirect("/")
      }
    
    return (
          <main className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <div className="border-b lg:text-3xl font-semibold tracking-tight first:mt-0">Welcome {user.username}, 
        <div className="lg:text-xl ml-auto">Lets start step by step with your fitness journey !</div></div>
        <Card className="relative rounded-md border shadow-sm h-full overflow-y-auto no-scrollbar">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_65%)]" />

          <CardHeader className="relative gap-4 border-b bg-background/90 backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full px-3 py-1" variant="secondary">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Nutrition walkthrough
              </Badge>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-3">
                <CardTitle className="text-3xl leading-tight tracking-tight sm:text-4xl">
                  One nutrition system, from ingredient setup to weekly review.
                </CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-7 sm:text-base">
                  {user.username}, this page now reads like one continuous walkthrough. Scroll through it once and you will understand how to save your usual ingredients, build your own recipes, track calories and macros against your objective every day, and review the full week afterward.
                </CardDescription>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <ListChecks className="h-4 w-4 text-primary" />
                  The full flow at a glance
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Ingredients give you reliable nutrition data.</p>
                  <p>Recipes turn repeated meals into reusable entries.</p>
                  <p>Objectives define what success looks like.</p>
                  <p>Today shows your live daily progress.</p>
                  <p>Overview tells you whether the week made sense.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app/oobjectives">
                  Start by setting your Objectives
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/app/today">Jump to today</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative max-h-[calc(100vh-12rem)] overflow-y-auto no-scrollbar p-5 sm:p-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <CircleDot className="h-4 w-4" />
                  Step-by-step flow
                </div>
                <div className="space-y-6">
                  {tutorialSteps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <Badge variant="outline" className="rounded-full px-2.5 py-0.5">
                            Step {index + 1}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold tracking-tight">{step.title}</h2>
                          <p className="text-sm leading-7 text-muted-foreground">{step.description}</p>

                          {step.href === "/app/ingredients" ? (
                            <p className="text-sm leading-7 text-muted-foreground">
                              Begin in <Link href="/app/ingredients" className="font-medium text-foreground underline underline-offset-4">Ingredients</Link> by entering the foods you use the most. The more accurate this base is, the more useful everything else becomes.
                            </p>
                          ) : null}

                          {step.href === "/app/recipes" ? (
                            <p className="text-sm leading-7 text-muted-foreground">
                              Move to <Link href="/app/recipes" className="font-medium text-foreground underline underline-offset-4">Recipes</Link> once you notice recurring meals. This lets you build meals from your saved ingredients instead of recreating them every time.
                            </p>
                          ) : null}

                          {step.href === "/app/objectives" ? (
                            <p className="text-sm leading-7 text-muted-foreground">
                              Set your calorie and macro targets in <Link href="/app/objectives" className="font-medium text-foreground underline underline-offset-4">Objectives</Link> so your nutrition has a clear target instead of being just a collection of numbers.
                            </p>
                          ) : null}

                          {step.href === "/app/today" ? (
                            <div className="space-y-4 pt-1">
                              <p className="text-sm leading-7 text-muted-foreground">
                                The <Link href="/app/today" className="font-medium text-foreground underline underline-offset-4">Today</Link> page is the center of daily use. This is where ingredients, recipes, and objectives finally meet in one place.
                              </p>
                              <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>Best daily workflow</AlertTitle>
                                <AlertDescription>
                                  Save ingredients first, convert repeat meals into recipes second, then log with as little friction as possible inside Today.
                                </AlertDescription>
                              </Alert>
                              <div className="grid gap-3 md:grid-cols-2">
                                {dailyPreview.map((item) => (
                                  <div key={item.label} className="space-y-2 rounded-xl border bg-muted/20 p-3">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="font-medium text-foreground">{item.label}</span>
                                      <span className="text-muted-foreground">{item.helper}</span>
                                    </div>
                                    <Progress value={item.value} className="h-2.5" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {step.href === "/app/overview" ? (
                            <div className="space-y-3 pt-1 text-sm leading-7 text-muted-foreground">
                              <p>
                                Open <Link href="/app/overview" className="font-medium text-foreground underline underline-offset-4">Overview</Link> to see whether the week actually matched the objective you set for yourself.
                              </p>
                              <div className="grid gap-2 sm:grid-cols-3">
                                <div className="rounded-xl border bg-muted/20 p-3">Check if calories stayed close to target over the week.</div>
                                <div className="rounded-xl border bg-muted/20 p-3">See whether protein, carbs, and fats stayed balanced.</div>
                                <div className="rounded-xl border bg-muted/20 p-3">Spot repeat meals worth saving as recipes.</div>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="sm:justify-self-end">
                          <Button asChild variant="ghost" className="px-0 text-primary hover:bg-transparent">
                            <Link href={step.href}>
                              {step.cta}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Quick navigation</h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      If you already know which part you want, use these direct links.
                    </p>
                  </div>

                  <div className="space-y-1 rounded-2xl border bg-muted/20 p-2">
                    {quickLinks.map((link, index) => (
                      <div key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-background"
                        >
                          <span className="font-medium">{link.label}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        {index !== quickLinks.length - 1 ? <Separator /> : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Common questions</h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      A few simple rules make the whole nutrition flow much easier to use.
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="w-full rounded-2xl border p-4">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Where should I begin if my account is empty?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Start on <Link href="/app/ingredients" className="font-medium text-foreground underline underline-offset-4">Ingredients</Link>. Enter the foods you eat most often first. You do not need everything on day one, just enough to cover your routine.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>When should I create a recipe instead of logging ingredients one by one?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Create a recipe in <Link href="/app/recipes" className="font-medium text-foreground underline underline-offset-4">Recipes</Link> as soon as a meal becomes something you repeat. That saves time and keeps your tracking consistent.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How do I know whether my tracking is actually working?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Use <Link href="/app/today" className="font-medium text-foreground underline underline-offset-4">Today</Link> for immediate feedback and <Link href="/app/overview" className="font-medium text-foreground underline underline-offset-4">Overview</Link> for pattern recognition. The first helps you react today, the second helps you improve next week.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
}


