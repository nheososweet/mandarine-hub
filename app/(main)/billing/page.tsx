"use client";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const invoices = [
    { id: "INV-001", date: "Jan 01, 2025", amount: "$29.00", status: "Paid" },
    { id: "INV-002", date: "Dec 01, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-003", date: "Nov 01, 2024", amount: "$29.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-5xl mx-auto">
      <div>
          <BlurText
            text="Billing & Plans"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Manage your subscription and billing history.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Current Plan */}
         <div className="p-6 rounded-xl border bg-card space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Plan</div>
                    <div className="text-3xl font-bold">Pro Plan</div>
                </div>
                <Badge className="bg-orange-500 hover:bg-orange-600">Active</Badge>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">$29</span>
                <span className="text-muted-foreground">/ month</span>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> Unlimited Agents
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> 10GB Vector Storage
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> Priority Support
                </div>
            </div>
            <Button className="w-full" variant="outline">Unsubscribe</Button>
         </div>

         {/* Payment Method */}
         <div className="p-6 rounded-xl border bg-card space-y-6">
            <div className="flex justify-between items-start">
                <div className="text-sm text-muted-foreground mb-1">Payment Method</div>
            </div>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-md border">
                    <CreditCard className="w-6 h-6" />
                </div>
                <div>
                    <div className="font-semibold">Visa ending in 4242</div>
                    <div className="text-xs text-muted-foreground">Expires 12/28</div>
                </div>
            </div>
             <Button className="w-full mt-auto" variant="outline">Update Payment Method</Button>
         </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
            <h3 className="font-semibold">Invoice History</h3>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.id}</TableCell>
                        <TableCell>{inv.date}</TableCell>
                        <TableCell>{inv.amount}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">{inv.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
