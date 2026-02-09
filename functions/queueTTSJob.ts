import { base44 } from "@/api/base44Client";

export async function queueTTSJob(meditationId) {
  return base44.entities.TTSJob.create({
    meditation_id: meditationId,
    status: "pending"
  });
}