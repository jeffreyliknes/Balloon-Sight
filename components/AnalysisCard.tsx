"use client";

import { CategoryResult } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FixRecommendation } from "./FixRecommendation";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface AnalysisCardProps {
  title: string;
  category: CategoryResult;
  icon: React.ReactNode;
}

export function AnalysisCard({ title, category, icon }: AnalysisCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-secondary border-secondary bg-secondary/10";
      case "fail":
        return "text-destructive border-destructive bg-destructive/10";
      default:
        return "text-accent border-accent bg-accent/10";
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-secondary" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-brand-primary/10 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-5 px-6 bg-brand-primary/5 border-b border-brand-primary/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white rounded-xl border border-brand-primary/10 text-brand-primary shadow-sm">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold text-brand-primary font-serif">
            {title}
          </CardTitle>
        </div>
        <Badge variant="outline" className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${getStatusColor(category.status)}`}>
          {category.score}/100
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {category.checks.map((check) => (
            <AccordionItem key={check.id} value={check.id} className="border-b border-brand-primary/5 last:border-0">
              <AccordionTrigger className="hover:no-underline py-4 px-6 hover:bg-brand-primary/5 transition-colors">
                <div className="flex items-center space-x-3 text-left">
                  <StatusIcon status={check.status} />
                  <span className="text-base font-bold text-brand-primary/80">{check.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <FixRecommendation check={check} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
