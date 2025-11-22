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
        return "text-secondary border-secondary bg-secondary/10 hover:bg-secondary/20";
      case "fail":
        return "text-primary border-primary bg-primary/10 hover:bg-primary/20";
      default:
        return "text-accent border-accent bg-accent/10 hover:bg-accent/20";
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary/20" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-primary fill-primary/20" />;
      default:
        return <AlertCircle className="w-5 h-5 text-accent fill-accent/20" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20 border-b-2 border-muted">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-background rounded-lg shadow-sm text-foreground">
            {icon}
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            {title}
          </CardTitle>
        </div>
        <Badge variant="outline" className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${getStatusColor(category.status)}`}>
          {category.score}/100
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          {category.checks.map((check) => (
            <AccordionItem key={check.id} value={check.id} className="border-b border-muted last:border-0">
              <AccordionTrigger className="hover:no-underline py-4 px-2 hover:bg-muted/20 rounded-lg transition-colors">
                <div className="flex items-center space-x-3 text-left">
                  <StatusIcon status={check.status} />
                  <span className="text-base font-medium text-foreground">{check.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2">
                <FixRecommendation check={check} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
