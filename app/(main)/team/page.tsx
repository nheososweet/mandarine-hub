"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Shield } from "lucide-react";
import { faker } from "@faker-js/faker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import BlurText from "@/components/BlurText";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { InviteMemberDialog } from "./_components/InviteMemberDialog";
import { TeamActions } from "./_components/TeamActions";


// --- Types ---
type Member = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  avatar: string;
  status: "Active" | "Pending";
  joined: Date;
};

// --- Fake Data ---
const generateData = (count: number): Member[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["Admin", "Editor", "Viewer"]),
    avatar: faker.image.avatar(),
    status: faker.helpers.arrayElement(["Active", "Active", "Pending"]),
    joined: faker.date.past(),
  }));
};

const data = generateData(20);

// --- Columns ---
const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>{row.original.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <span className="font-medium">{row.getValue("name")}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
            <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span>{role}</span>
            </div>
        )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "outline" : "secondary"} className={status === "Pending" ? "opacity-50" : ""}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joined",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.joined.toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <TeamActions member={row.original} />,
  },
];

export default function TeamPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BlurText
            text="Team Members"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Invite and manage team members and their permissions.
          </p>
        </div>
<InviteMemberDialog />
      </div>
      <div className="flex-1 bg-card rounded-xl border p-4">
        <DataTable columns={columns} data={data} filterKey="name" filterPlaceholder="Search members..." />
      </div>
    </div>
  );
}
