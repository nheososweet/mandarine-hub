"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, FileText, Calendar, HardDrive } from "lucide-react";
import { faker } from "@faker-js/faker";
import Link from "next/link";

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

// --- Types ---
export type KnowledgeBase = {
  id: string;
  name: string;
  description: string;
  documents: number;
  size: string;
  updatedAt: Date;
  status: "Active" | "Indexing" | "Error";
};

// --- Fake Data ---
const generateData = (count: number): KnowledgeBase[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.department() + " Knowledge",
    description: faker.company.catchPhrase(),
    documents: faker.number.int({ min: 5, max: 200 }),
    size: faker.number.int({ min: 10, max: 900 }) + " MB",
    updatedAt: faker.date.recent(),
    status: faker.helpers.arrayElement(["Active", "Active", "Indexing", "Error"]),
  }));
};

const data = generateData(20);

// --- Columns ---
export const columns: ColumnDef<KnowledgeBase>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <Link 
            href={`/knowledge/${row.original.id}`}
            className="font-medium hover:text-orange-500 transition-colors"
          >
            {row.getValue("name")}
          </Link>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {row.original.description}
          </span>
        </div>
      );
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
        <Badge
          variant="outline"
          className={
            status === "Active"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : status === "Indexing"
              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "documents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documents" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-muted-foreground">
          <FileText className="mr-2 h-4 w-4 opacity-50" />
          {row.getValue("documents")}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-muted-foreground">
          <HardDrive className="mr-2 h-4 w-4 opacity-50" />
          {row.getValue("size")}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 opacity-50" />
          {row.original.updatedAt.toLocaleDateString()}
        </div>
      );
    },
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/knowledge/${row.original.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function KnowledgeList() {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      filterKey="name" 
      filterPlaceholder="Search knowledge bases..." 
    />
  );
}
