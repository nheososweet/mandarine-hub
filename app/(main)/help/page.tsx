"use client";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    { question: "How do I add a new agent?", answer: "Navigate to the Agents page and click on 'Create Agent'. You can then select a template or build from scratch." },
    { question: "What is the cost of vector storage?", answer: "Vector storage is calculated based on the total size of your indexed documents. Checking the Billing page for specific rates." },
    { question: "Can I self-host Mandarine?", answer: "Yes! Mandarine is open-core. Check the Documentation for self-hosting guides using Docker." },
    { question: "How do I revoke an API key?", answer: "Go to Settings > API Keys, find the key you want to revoke, click the actions menu, and select 'Revoke'." },
];

export default function HelpPage() {
  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
       <div className="text-center space-y-2 mb-10">
        <BlurText
          text="Help & Support"
          className="text-3xl font-bold tracking-tight"
          delay={10}
        />
        <p className="text-muted-foreground">
          Find answers to common questions or contact our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold">Community Chat</h3>
            <p className="text-sm text-muted-foreground">Join our Discord server to get help from the community.</p>
            <Button variant="outline" className="w-full">Join Discord</Button>
        </div>
        <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-green-500/10 rounded-full">
                <Mail className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-sm text-muted-foreground">For enterprise plans, get priority email support.</p>
            <Button variant="outline" className="w-full">Contact Us</Button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
                 <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                     {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
