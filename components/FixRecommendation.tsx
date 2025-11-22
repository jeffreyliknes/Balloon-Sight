import { AlertTriangle, Check, X } from "lucide-react";
import { CheckResult } from "@/lib/types";

export function FixRecommendation({ check }: { check: CheckResult }) {
  if (check.status === "pass") {
    return (
      <div className="flex items-center space-x-2 text-secondary font-semibold text-sm">
        <Check size={18} className="stroke-[3px]" />
        <span>{check.message}</span>
      </div>
    );
  }

  const icon = check.status === "fail" ? <X size={18} className="stroke-[3px]" /> : <AlertTriangle size={18} className="stroke-[3px]" />;
  const colorClass = check.status === "fail" ? "text-primary" : "text-accent";

  return (
    <div className="mt-2 space-y-2">
      <div className={`flex items-center space-x-2 ${colorClass} text-sm font-bold`}>
        {icon}
        <span>{check.message}</span>
      </div>
      {check.fix && (
        <div className="ml-6 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border-2 border-muted">
          <span className="font-bold text-foreground block mb-1">How to fix: </span>
          {check.fix}
        </div>
      )}
    </div>
  );
}
