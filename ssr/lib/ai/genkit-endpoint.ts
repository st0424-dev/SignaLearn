/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenerateStreamResponse, z } from "genkit";
import { NextRequest, NextResponse } from "next/server";
import { toReadableStream } from "./utils";
import { GenerateRequestSchema } from "./schema";

const ChatRequestSchema = GenerateRequestSchema.extend({
  context: z.record(z.any()).optional(),
});

export type ChatHandler<T = z.infer<typeof ChatRequestSchema>> = (
  data: T
) => GenerateStreamResponse<any> | Promise<GenerateStreamResponse<any>>;

export interface ChatEndpointOptions<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema?: T;
}

type Endpoint = (request: NextRequest) => Promise<NextResponse>;

function errorResponse(error: { message: string; status: number }) {
  return new NextResponse(JSON.stringify(error), {
    status: error.status,
    headers: { "content-type": "application/json" },
  });
}

export function simpleEndpoint<Input = any, Output = any>(
  handler: (input: Input) => Promise<Output>
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    const input: Input = await request.json();

    try {
      const output = await handler(input);
      return NextResponse.json(output);
    } catch (e) {
      return NextResponse.json(
        { error: { message: (e as Error).toString() } },
        { status: 500 }
      );
    }
  };
}

export default function genkitEndpoint(handler: ChatHandler): Endpoint;
export default function genkitEndpoint<T extends z.ZodTypeAny = z.ZodTypeAny>(
  options: ChatEndpointOptions<T>,
  handler: ChatHandler<z.infer<T>>
): Endpoint;

export default function genkitEndpoint<T extends z.ZodTypeAny = z.ZodTypeAny>(
  optionsOrHandler: ChatEndpointOptions<T> | ChatHandler<z.infer<T>>,
  handler?: ChatHandler<z.infer<T>>
): Endpoint {
  const options = handler ? (optionsOrHandler as ChatEndpointOptions) : {};
  handler = handler || (optionsOrHandler as ChatHandler);

  return async (request: NextRequest): Promise<NextResponse> => {
    const schema = options.schema || ChatRequestSchema;
    const data = schema.parse(await request.json());

    if (process.env.NODE_ENV === "development") {
      console.dir(data, { depth: null });
    }
    try {
      const response = await handler(data);
      return new NextResponse(toReadableStream(response), {
        headers: { "content-type": "text/event-stream" },
      });
    } catch (e) {
      return new NextResponse(
        `data: ${JSON.stringify({
          error: { message: (e as Error).message },
        })}\n\n`,
        {
          headers: { "content-type": "text/event-stream" },
        }
      );
    }
  };
}
