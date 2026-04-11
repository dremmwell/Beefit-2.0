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
  ArrowUpWideNarrow,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Dumbbell,
  ListChecks,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";

function BicepsFlexedIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1" />
      <path d="M15 14a5 5 0 0 0-7.584 2" />
      <path d="M9.964 6.825C8.019 7.977 9.5 13 8 15" />
    </svg>
  );
}

type TutorialIcon = LucideIcon | ComponentType<{ className?: string }>;

const workoutSteps: {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: TutorialIcon;
}[] = [
  {
    title: "Set your split goals first",
    description:
      "Define your focus groups and priorities, then set target sets per muscle group. You can keep them grouped or tune each label with custom sets.",
    href: "/app/goals",
    cta: "Open split goals",
    icon: BicepsFlexedIcon,
  },
  {
    title: "Build your exercise library",
    description:
      "Create the exercises you actually perform, group them however you want, and link each exercise to the muscle labels it targets.",
    href: "/app/exercises",
    cta: "Manage exercises",
    icon: Dumbbell,
  },
  {
    title: "Log each gym session",
    description:
      "After every workout, save what you performed with sets, reps, weights, and notes so every effort is counted toward your split.",
    href: "/app/exercises",
    cta: "Log today session",
    icon: ListChecks,
  },
  {
    title: "Track split progress",
    description:
      "Follow progress by muscle and by priority groups over your split duration to see if you are actually hitting the planned volume.",
    href: "/app/progress",
    cta: "View progress",
    icon: ArrowUpWideNarrow,
  },
];

const quickLinks = [
  { label: "Split Goals", href: "/app/goals", icon: BicepsFlexedIcon },
  { label: "Exercises", href: "/app/exercises", icon: Dumbbell },
  { label: "Split Progress", href: "/app/progress", icon: ArrowUpWideNarrow },
  { label: "Workout Home", href: "/app/workout", icon: Zap },
];

const splitPreview = [
  { label: "Priority groups", helper: "Chest + Back + Delts", value: 76 },
  { label: "Maintenance groups", helper: "Legs + Arms", value: 58 },
  { label: "Global split completion", helper: "Day 5 of 7", value: 71 },
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
                Workout walkthrough
              </Badge>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-3">
                <CardTitle className="text-3xl leading-tight tracking-tight sm:text-4xl">
                  One workout flow, from split planning to progress tracking.
                </CardTitle>
                <CardDescription className="max-w-3xl text-sm leading-7 sm:text-base">
                  {user.username}, this page explains the full workout system in order: set target sets for your muscle priorities, build and group your exercise list, log every session with sets, reps, weights and notes, define split duration, and then validate your consistency in split progress.
                </CardDescription>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                  <ListChecks className="h-4 w-4 text-primary" />
                  The full flow at a glance
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Plan: priorities, focus groups, custom sets.</p>
                  <p>Prepare: exercise library and exercise groups.</p>
                  <p>Execute: log sessions with complete performance data.</p>
                  <p>Review: check split progress by muscle and by focus.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app/goals">
                  Start with Split Goals
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/app/progress">Go to split progress</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative max-h-[calc(100vh-12rem)] overflow-y-auto no-scrollbar p-5 sm:p-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <CircleDot className="h-4 w-4" />
                  Step-by-step workout flow
                </div>

                <div className="space-y-6">
                  {workoutSteps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div key={`${step.title}-${index}`} className="grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-start">
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

                          {step.href === "/app/goals" ? (
                            <div className="space-y-3 pt-1 text-sm leading-7 text-muted-foreground">
                              <p>
                                In <Link href="/app/goals" className="font-medium text-foreground underline underline-offset-4">Split Goals</Link>, you can prioritize muscle groups, keep them in focus groups, or tailor individual labels with custom set targets.
                              </p>
                              <p>
                                You also define your split duration there, which sets the timeframe within which your required sets should be completed.
                              </p>
                              <div className="rounded-xl border bg-muted/20 p-3">
                                <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                                  <CalendarClock className="h-4 w-4 text-primary" />
                                  Split duration idea
                                </div>
                                <p className="text-muted-foreground">
                                  Example: if your split length is 7 days, your set targets should be reached inside that 7-day cycle before it resets.
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {step.href === "/app/exercises" && step.cta === "Manage exercises" ? (
                            <p className="text-sm leading-7 text-muted-foreground">
                              Use <Link href="/app/exercises" className="font-medium text-foreground underline underline-offset-4">Exercises</Link> to create your own list and organize exercises by day (program-like) or by broader body-part groups. Each exercise can be linked to the muscle labels it focuses on.
                            </p>
                          ) : null}

                          {step.href === "/app/exercises" && step.cta === "Log today session" ? (
                            <div className="space-y-3 pt-1 text-sm leading-7 text-muted-foreground">
                              <p>
                                After each gym session, log performed exercises with sets, reps, weights, and notes. These entries are what feed your progress and make split tracking meaningful.
                              </p>
                              <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>Session logging tip</AlertTitle>
                                <AlertDescription>
                                  Keep notes short but useful: effort level, form cues, or pain flags. This makes your next progression decisions easier.
                                </AlertDescription>
                              </Alert>
                            </div>
                          ) : null}

                          {step.href === "/app/progress" ? (
                            <div className="space-y-3 pt-1 text-sm leading-7 text-muted-foreground">
                              <p>
                                In <Link href="/app/progress" className="font-medium text-foreground underline underline-offset-4">Split Progress</Link>, review progress for each muscle and for your global priority focus groups to verify your actual volume against planned volume.
                              </p>
                              <div className="grid gap-3 md:grid-cols-3">
                                {splitPreview.map((item) => (
                                  <div key={item.label} className="space-y-2 rounded-xl border bg-muted/20 p-3">
                                    <div className="space-y-0.5 text-sm">
                                      <p className="font-medium text-foreground">{item.label}</p>
                                      <p className="text-muted-foreground">{item.helper}</p>
                                    </div>
                                    <Progress value={item.value} className="h-2.5" />
                                  </div>
                                ))}
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
                      Jump to the exact step you want to work on.
                    </p>
                  </div>

                  <div className="space-y-1 rounded-2xl border bg-muted/20 p-2">
                    {quickLinks.map((link, index) => {
                      const Icon = link.icon;

                      return (
                        <div key={link.href}>
                          <Link
                            href={link.href}
                            className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors hover:bg-background"
                          >
                            <span className="flex items-center gap-2 font-medium">
                              <Icon className="h-4 w-4 text-primary" />
                              {link.label}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </Link>
                          {index !== quickLinks.length - 1 ? <Separator /> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Common questions</h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Key points to keep your split planning and tracking reliable.
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="w-full rounded-2xl border p-4">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How should I set goals for priority vs maintenance muscles?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Use <Link href="/app/goals" className="font-medium text-foreground underline underline-offset-4">Split Goals</Link> to assign more sets to priority groups and lower targets for maintenance groups. You can also use custom set values on individual labels for precise control.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>Should I group exercises by day or by body part?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Either works. In <Link href="/app/exercises" className="font-medium text-foreground underline underline-offset-4">Exercises</Link>, group by day if you think in program sessions, or by body part if you think in movement libraries. The important part is attaching the right muscle labels.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>What exactly should I log after each gym session?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Log performed sets, reps, weight, and notes for each exercise. This session data is what powers your results in <Link href="/app/progress" className="font-medium text-foreground underline underline-offset-4">Split Progress</Link>.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>How does split duration affect my progress?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Split duration defines your tracking window. If your split is 7 days, your target set totals are evaluated within that 7-day cycle before the next cycle begins.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="rounded-2xl border bg-primary/5 p-4 text-sm">
                <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Recommended order for new users
                </div>
                <p className="leading-7 text-muted-foreground">
                  Start in <Link href="/app/goals" className="font-medium text-foreground underline underline-offset-4">Split Goals</Link>, continue with <Link href="/app/exercises" className="font-medium text-foreground underline underline-offset-4">Exercises</Link>, log each session right away, and review consistency in <Link href="/app/progress" className="font-medium text-foreground underline underline-offset-4">Split Progress</Link> at least once per split cycle.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    )
}