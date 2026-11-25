import { z } from "zod";

export const rsvpFields = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100),
  attending: z.boolean(),
  adults: z.number().int().min(0).max(100),
  children: z.number().int().min(0).max(100),
  message: z.string().trim().max(500),
}).refine(({ attending, adults, children }) => attending ? adults + children > 0 : adults + children === 0, {
  message: "Enter the number of adults and children attending.",
});

export type RsvpFields = z.infer<typeof rsvpFields>;
export interface RsvpEntry extends RsvpFields {
  id: string;
  source: "invitation" | "manual";
  createdAt: string;
  updatedAt: string;
}
