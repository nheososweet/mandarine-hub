"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const workflowFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  triggerType: z.enum(["manual", "scheduled", "event"]),
});

export function CreateWorkflowSheet() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof workflowFormSchema>>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: "",
      description: "",
      triggerType: "manual",
    },
  });

  function onSubmit(values: z.infer<typeof workflowFormSchema>) {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setLoading(false);
      setOpen(false);
      form.reset();
      toast.success("Workflow Created", {
        description: "You can now open the Visual Designer to add nodes."
      });
    }, 1500);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Workflow
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create Workflow</SheetTitle>
          <SheetDescription>
            Initialize a new automation pipeline. You can configure nodes later.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4 px-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Workflow Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Daily Digest" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="What does this workflow do?"
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="space-y-3">
                    <FormLabel>Trigger Type</FormLabel>
                    <div className="flex gap-2">
                        {["manual", "scheduled", "event"].map((type) => (
                            <Badge
                                key={type}
                                variant={form.watch("triggerType") === type ? "default" : "outline"}
                                className="cursor-pointer capitalize px-3 py-1"
                                onClick={() => form.setValue("triggerType", type as any)}
                            >
                                {type}
                            </Badge>
                        ))}
                    </div>
                    <FormDescription>
                        {form.watch("triggerType") === "manual" && "Run this workflow manually from the dashboard or API."}
                        {form.watch("triggerType") === "scheduled" && "Run this workflow on a recurring Cron schedule."}
                        {form.watch("triggerType") === "event" && "Trigger this workflow via Webhook or internal event."}
                    </FormDescription>
                </div>

                <div className="pt-4 mt-auto">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create & Open Designer
                    </Button>
                </div>
            </form>
            </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
