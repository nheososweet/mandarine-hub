"use client";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="h-full flex-1 p-8 max-w-3xl mx-auto space-y-8">
       <div>
          <BlurText
            text="My Profile"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Manage your personal information.
          </p>
      </div>
      <Separator />

      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
            <Button variant="outline" size="sm">Change Avatar</Button>
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" placeholder="Your name" defaultValue="Antigravity User" />
        </div>
        
        <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email" defaultValue="user@mandarine.hub" disabled />
            <p className="text-[0.8rem] text-muted-foreground">Email change requires verification.</p>
        </div>

        <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself" className="resize-none" rows={4} />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
