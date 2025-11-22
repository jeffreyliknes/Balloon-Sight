import { AlertTriangle, Check, X } from "lucide-react";
import { CheckResult } from "@/lib/types";

export function FixRecommendation({ check }: { check: CheckResult }) {
  if (check.status === "pass") {
    return (
      <div className="flex items-center space-x-2 text-secondary font-bold text-sm bg-secondary/5 p-3 rounded-lg border border-secondary/10">
        <Check size={18} className="stroke-[3px]" />
        <span>{check.message}</span>
      </div>
    );
  }

  const icon = check.status === "fail" ? <X size={18} className="stroke-[3px]" /> : <AlertTriangle size={18} className="stroke-[3px]" />;
  const colorClass = check.status === "fail" ? "text-destructive" : "text-accent";
  const bgClass = check.status === "fail" ? "bg-destructive/5 border-destructive/10" : "bg-accent/5 border-accent/10";

  return (
    <div className="mt-2 space-y-3">
      <div className={`flex items-center space-x-2 ${colorClass} ${bgClass} p-3 rounded-lg border text-sm font-bold`}>
        {icon}
        <span>{check.message}</span>
      </div>
      {check.fix && (
        <div className="ml-2 text-sm text-brand-primary/80 pl-4 border-l-2 border-brand-primary/20">
          <span className="font-bold text-brand-primary block mb-1 text-xs uppercase tracking-wide">Recommendation</span>
          {check.fix}
        </div>
      )}
    </div>
  );
}
