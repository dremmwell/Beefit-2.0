"use client"

import React, { useRef, useState } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveStepGoal } from "@/app/actions/db.actions/workout.actions";

function StepGoal({ userId, stepGoal }: { userId: string; stepGoal: number }) {
  const [goal, setGoal] = useState(stepGoal);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const timer = useRef<number | null>(null);

  function onClick(adjustment: number) {
    setGoal((prev) => Math.max(0, prev + adjustment));
  }

  function onMouseHold(adjustment: number) {
    if (timer.current) {
      window.clearInterval(timer.current);
    }

    timer.current = window.setInterval(() => {
      setGoal((prev) => Math.max(0, prev + adjustment));
    }, 200);
  }

  function timeoutClear() {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }

  async function onSave() {
    setLoading(true);
    try {
      await saveStepGoal(userId, goal);
      toast({
        title: "Daily step goal saved!",
        description: `Your target is ${goal.toLocaleString("en-US")} steps per day.`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to save step goal.",
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1 rounded-md border bg-background px-1.5 py-1 shadow-sm sm:gap-2 sm:px-2 sm:py-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-5 w-5 rounded-full sm:h-6 sm:w-6"
        onMouseLeave={timeoutClear}
        onMouseUp={timeoutClear}
        onMouseDown={() => onMouseHold(-1000)}
        onClick={() => onClick(-1000)}
        disabled={goal <= 0}
      >
        <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="sr-only">Decrease</span>
      </Button>

      <div className="min-w-[75px] text-center sm:min-w-[90px]">
        <div className="text-sm font-semibold leading-none sm:text-base">{goal.toLocaleString("en-US")}</div>
        <div className="text-[8px] uppercase tracking-wide text-muted-foreground sm:text-[9px]">steps/day</div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-5 w-5 rounded-full sm:h-6 sm:w-6"
        onMouseLeave={timeoutClear}
        onMouseUp={timeoutClear}
        onMouseDown={() => onMouseHold(1000)}
        onClick={() => onClick(1000)}
      >
        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="sr-only">Increase</span>
      </Button>

      <Button
        size="sm"
        onClick={onSave}
        disabled={loading}
        className="h-6 px-2 text-[10px] sm:h-7 sm:px-2.5"
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
        Save
      </Button>
    </div>
  );
}

export default StepGoal;
