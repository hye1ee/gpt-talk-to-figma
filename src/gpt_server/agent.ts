import { OpenAI } from "openai";
import { createTools } from "./utils/tools";

class Agent {
  private static instance: Agent;
  private static apiKey: string;
  private openai: OpenAI;

  private constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  public static init(apiKey: string) {
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY must be provided to Agent.init()");
    }
    Agent.apiKey = apiKey;
  }

  public static getInstance(): Agent {
    if (!Agent.apiKey) {
      throw new Error("Agent.init(apiKey) must be called before getInstance()");
    }
    if (!Agent.instance) {
      Agent.instance = new Agent(Agent.apiKey);
    }
    return Agent.instance;
  }

  public async getResponsesWithTools(message: string): Promise<OpenAI.Responses.ResponseOutputItem[]> {
    try {
      const response = await this.openai.responses.create({
        model: "gpt-3.5-turbo",
        input: [
          { role: "user", content: message }
        ],
        tools: createTools
      });
      return response.output;
    } catch (err) {
      throw err;
    }
  }
}

export default Agent; 