import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  modelName: process.env.AI_MODEL || "meta/llama-3.1-8b-instruct",
  apiKey: process.env.NVDIA_KEY!,
  configuration: {
    baseURL: "https://integrate.api.nvidia.com/v1",
  },
  temperature: 0.3,
  topP: 0.9,
  maxTokens: 1024,
  maxRetries: 3,
  timeout: 60000,
});


