"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, File, FileText, Trash2, Download } from "lucide-react";
import { faker } from "@faker-js/faker";

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
export type KnowledgeFile = {
  id: string;
  name: string;
  type: string; // pdf, docx, txt
  size: string;
  uploadedAt: Date;
  status: "Indexed" | "Processing" | "Pending";
};

// --- Fake Data ---
const generateData = (count: number): KnowledgeFile[] => {
  return Array.from({ length: count }).map(() => {
    const type = faker.helpers.arrayElement(["pdf", "docx", "txt", "md"]);
    return {
      id: faker.string.uuid(),
      name: `${faker.system.fileName()}.${type}`,
      type: type,
      size: faker.number.int({ min: 100, max: 5000 }) + " KB",
      uploadedAt: faker.date.recent(),
      status: faker.helpers.arrayElement(["Indexed", "Indexed", "Processing"]),
    };
  });
};

const data = generateData(30);

// --- Columns ---
export const columns: ColumnDef<KnowledgeFile>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-blue-500" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="uppercase text-[10px]">
          {row.getValue("type")}
        </Badge>
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
        <div className={`flex items-center text-xs ${
          status === "Indexed" ? "text-green-500" :
          status === "Processing" ? "text-yellow-500" : "text-muted-foreground"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
            status === "Indexed" ? "bg-green-500" :
            status === "Processing" ? "bg-yellow-500 animate-pulse" : "bg-muted-foreground"
          }`} />
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
  },
  {
    accessorKey: "uploadedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded" />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.uploadedAt.toLocaleDateString()}
        </span>
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
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function FileList() {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      filterKey="name" 
      filterPlaceholder="Search files..." 
    />
  );
}
