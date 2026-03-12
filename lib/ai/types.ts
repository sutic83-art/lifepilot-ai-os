export type EnergyLevel = "low" | "medium" | "high";

export type UserContext = {
  userId: string;
  userName: string;
  energy: EnergyLevel;
  openTasks: number;
  highPriorityTasks: number;
  risks: string[];
};

export type DraftDailyPlan = {
  summary: string;
  priorities: string[];
  risks: string[];
};

export type FinalDailyPlan = DraftDailyPlan & {
  safe: boolean;
  constitutionalNotes: string[];
};