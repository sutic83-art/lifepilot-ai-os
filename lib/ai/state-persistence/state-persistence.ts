import { db } from "@/lib/db";
import { generateUnifiedOrchestrator } from "@/lib/ai/orchestrator/unified-orchestrator";

export type StateSnapshotRecord = {
  id: string;
  snapshotType: string;
  summary: string;
  executiveMode: string | null;
  energyLevel: string | null;
  burnoutRisk: string | null;
  payload: string;
  createdAt: Date;
};

export async function saveOrchestratorSnapshot(userId: string) {
  const snapshot = await generateUnifiedOrchestrator(userId);

  return db.aIStateSnapshot.create({
    data: {
      userId,
      snapshotType: "orchestrator",
      summary: snapshot.summary,
      executiveMode: snapshot.executiveMode,
      energyLevel: snapshot.energyLevel,
      burnoutRisk: snapshot.burnoutRisk,
      payload: JSON.stringify(snapshot),
    },
  });
}

export async function getRecentStateSnapshots(userId: string): Promise<StateSnapshotRecord[]> {
  return db.aIStateSnapshot.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}