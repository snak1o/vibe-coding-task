"use client";

import { useActionState } from "react";
import { createSlotAction, type ActionState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const initial: ActionState = { ok: false };

export default function CreateSlotForm() {
  const [state, formAction, pending] = useActionState(createSlotAction, initial);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create slot</CardTitle>
        <CardDescription>Pick a start and end time for the new slot.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="start">Start</Label>
            <Input id="start" name="start" type="datetime-local" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end">End</Label>
            <Input id="end" name="end" type="datetime-local" required />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create"}
          </Button>
          {state.message && (
            <p
              className={`sm:col-span-3 text-sm ${
                state.ok ? "text-emerald-600" : "text-destructive"
              }`}
            >
              {state.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
