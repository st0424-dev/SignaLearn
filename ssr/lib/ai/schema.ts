import { z, MessageSchema, PartSchema } from "genkit";
import { ToolRequestPartSchema, ToolResponsePartSchema } from "genkit/model";

export const GenerateRequestSchema = z.object({
  system: z.array(PartSchema).optional(),
  messages: z.array(MessageSchema).optional(),
  prompt: z.array(PartSchema).optional(),
  resume: z
    .object({
      respond: z.array(ToolResponsePartSchema).optional(),
      restart: z.array(ToolRequestPartSchema).optional(),
    })
    .optional(),
});
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
