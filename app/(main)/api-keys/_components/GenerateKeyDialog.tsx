"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Key, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const keyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export function GenerateKeyDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const form = useForm<z.infer<typeof keyFormSchema>>({
    resolver: zodResolver(keyFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof keyFormSchema>) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGeneratedKey("sk-mandarine_" + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7));
      toast.success("API Key Generated");
    }, 1000);
  }

  function handleCopy() {
    if (generatedKey) {
        navigator.clipboard.writeText(generatedKey);
        toast.success("Copied to clipboard");
    }
  }

  function handleClose() {
      setOpen(false);
      setTimeout(() => {
        setGeneratedKey(null);
        form.reset();
      }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
            <Key className="mr-2 h-4 w-4" /> Generate New Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Generate API Key</DialogTitle>
          <DialogDescription>
            Create a new key for server-side access.
          </DialogDescription>
        </DialogHeader>

        {!generatedKey ? (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Key Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Production Server" {...field} />
                    </FormControl>
                    <FormDescription>
                        A descriptive name to identify this key.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Key
                </Button>
                </DialogFooter>
            </form>
            </Form>
        ) : (
            <div className="space-y-4">
                <div className="p-4 bg-muted/50 border rounded-lg space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Your secret key</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 bg-background p-2 rounded border font-mono text-sm break-all">
                            {generatedKey}
                        </code>
                        <Button size="icon" variant="outline" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-amber-500 text-xs bg-amber-500/10 p-3 rounded border border-amber-500/20">
                    Warning: This key will only be shown once. Please save it securely.
                </div>
                <DialogFooter>
                    <Button onClick={handleClose} className="w-full">
                        Done
                    </Button>
                </DialogFooter>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
