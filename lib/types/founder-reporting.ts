export type FounderReportingResult = {
    summary: string;
    totalTasks: number;
    totalGoals: number;
    totalHabits: number;
    totalReviews: number;
    totalSnapshots: number;
    actionFeedbackCount: number;
    helpfulFeedbackCount: number;
    neutralFeedbackCount: number;
    unhelpfulFeedbackCount: number;
    systemHealth: "low" | "medium" | "high";
    signals: string[];
  };