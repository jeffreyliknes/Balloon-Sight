export type AnalysisResult = {
  score: number;
  url: string;
  screenshot?: string;
  persona: {
    archetype: string;
    description: string;
  };
  categories: {
    accessibility: CategoryResult;
    structuredData: CategoryResult;
    semanticStructure: CategoryResult;
    contentPersona: CategoryResult;
  };
  rawJsonLd?: any[];
};

export type CategoryResult = {
  score: number;
  status: "pass" | "fail" | "warning";
  checks: CheckResult[];
};

export type CheckResult = {
  id: string;
  label: string;
  status: "pass" | "fail" | "warning";
  message: string;
  fix?: string;
};

