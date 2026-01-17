"use client";

import { useState } from "react";
import { MoreHorizontal, Mail, Shield, User, Pencil, Ban, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  avatar: string;
  status: "Active" | "Pending";
  joined: Date;
};

interface TeamActionsProps {
  member: Member;
}

export function TeamActions({ member }: TeamActionsProps) {
  const [open, setOpen] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(member.role);

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.id);
    toast.success("User ID copied to clipboard");
  };

  const handleEditRole = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowEditRole(false);
    toast.success("Role Updated", {
        description: `${member.name} is now a ${role}`
    });
  };

  const handleSuspend = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowSuspend(false);
    toast.success("Member Suspended", {
        description: `${member.name} has been suspended.`
    });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowDelete(false);
    toast.success("Member Removed", {
        description: `${member.name} has been removed from the team.`
    });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowViewProfile(true)}>
            <User className="mr-2 h-4 w-4 text-muted-foreground" /> View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`mailto:${member.email}`)}>
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email User
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditRole(true)}>
            <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Role
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-amber-500 focus:text-amber-500 focus:bg-amber-100/10"
            onClick={() => setShowSuspend(true)}
          >
            <Ban className="mr-2 h-4 w-4" /> Suspend Access
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600 focus:bg-red-100/10"
            onClick={() => setShowDelete(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Profile Dialog */}
      <Dialog open={showViewProfile} onOpenChange={setShowViewProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
             <DialogDescription>
                View detailed information about {member.name}.
             </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
             <Avatar className="h-20 w-20">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-lg">{member.name[0]}</AvatarFallback>
             </Avatar>
             <div className="text-center">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.email}</p>
             </div>
             
             <div className="grid w-full grid-cols-2 gap-4 border-t pt-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">User ID</span>
                    <code className="text-xs bg-muted p-1 rounded cursor-pointer" onClick={handleCopyId}>{member.id.substring(0, 18)}...</code>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Role</span>
                    <span className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-3 w-3" /> {member.role}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <span className="text-sm font-medium">{member.status}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Joined</span>
                    <span className="text-sm font-medium">{member.joined.toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRole} onOpenChange={setShowEditRole}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Change the role for {member.name}. This will affect their permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRole(false)}>Cancel</Button>
            <Button onClick={handleEditRole} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
       <Dialog open={showSuspend} onOpenChange={setShowSuspend}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suspend Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {member.name}? They will no longer be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspend(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspend} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Remove User Dialog */}
       <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {member.name} from the team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
