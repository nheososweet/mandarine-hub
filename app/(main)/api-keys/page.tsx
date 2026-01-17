"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Key, Check, Copy } from "lucide-react"; // Removed Toast
import { toast } from "sonner"; // Use sonner directly
import { faker } from "@faker-js/faker";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { GenerateKeyDialog } from "./_components/GenerateKeyDialog";

// --- Types ---
type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  created: Date;
  lastUsed: Date;
  status: "Active" | "Revoked";
};

// --- Fake Data ---
const generateData = (count: number): ApiKey[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.finance.accountName() + " Key",
    prefix: "sk-" + faker.string.alphanumeric(8),
    created: faker.date.past(),
    lastUsed: faker.date.recent(),
    status: faker.helpers.arrayElement(["Active", "Active", "Revoked"]),
  }));
};

const data = generateData(12);

// --- Columns ---
const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "prefix",
    header: "Key Prefix",
    cell: ({ row }) => (
      <div className="font-mono text-xs bg-muted/50 px-2 py-1 rounded inline-block">
        {row.getValue("prefix")}...
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.created.toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "lastUsed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Used" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.lastUsed.toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(row.original.prefix);
                toast.success("Copied key to clipboard");
            }}>
              <Copy className="mr-2 h-4 w-4" /> Copy Key
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Revoke Key</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ApiKeysPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <BlurText
            text="API Keys"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Manage API tokens for accessing the Mandarine programmatic interface.
          </p>
        </div>
<GenerateKeyDialog />
      </div>
      <div className="flex-1 bg-card rounded-xl border p-4">
        <DataTable columns={columns} data={data} filterKey="name" filterPlaceholder="Search keys..." />
      </div>
    </div>
  );
}
