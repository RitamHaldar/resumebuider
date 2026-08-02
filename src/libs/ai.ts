import {ChatOpenAI} from "@langchain/openai"

export const model = new ChatOpenAI({
    model: "stepfun-ai/step-3.7-flash",
    apiKey: process.env.NVDIA_KEY!,
    configuration: {
        baseURL: "https://integrate.api.nvidia.com/v1"
    },
    temperature: 0.5,
})

