import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});

export const taskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  category: z.string().trim().min(1).max(60),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime().optional().or(z.literal('')).or(z.null())
});

export const goalSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  area: z.string().trim().min(1).max(60),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  targetDate: z.string().datetime().optional().or(z.literal('')).or(z.null())
});

export const habitSchema = z.object({
  title: z.string().trim().min(1).max(120),
  frequency: z.string().trim().min(1).max(40).default('daily'),
  streak: z.coerce.number().int().min(0).max(999).default(0),
  status: z.enum(['GOOD', 'WARNING', 'GREAT']).default('GOOD')
});

export const journalSchema = z.object({
  title: z.string().trim().max(120).optional().or(z.literal('')),
  content: z.string().trim().min(1).max(5000),
  mood: z.string().trim().max(40).optional().or(z.literal(''))
});

export const onboardingSchema = z.object({
  focusArea: z.string().trim().max(80).optional().or(z.literal('')),
  topGoal: z.string().trim().max(140).optional().or(z.literal('')),
  wakeTime: z.string().trim().max(20).optional().or(z.literal('')),
  sleepTime: z.string().trim().max(20).optional().or(z.literal('')),
  planningStyle: z.string().trim().max(40).optional().or(z.literal('')),
  budgetStyle: z.string().trim().max(40).optional().or(z.literal('')),
  wantsAiCoaching: z.boolean().default(true)
});
