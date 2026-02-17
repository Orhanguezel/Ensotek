export type AiProvider = "openai" | "anthropic" | "grok";

export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiReplyResult = {
  text: string;
  provider: AiProvider;
  model: string;
};

type GenerateArgs = {
  preferredProvider?: "auto" | AiProvider;
  systemPrompt: string;
  messages: AiChatMessage[];
};

function getEnv(name: string): string {
  return (process.env[name] || "").trim();
}

function resolveProviderOrder(preferredProvider?: "auto" | AiProvider): AiProvider[] {
  const defaultOrder = ["openai", "anthropic", "grok"] as AiProvider[];
  const configured = getEnv("AI_PROVIDER_ORDER")
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter((v): v is AiProvider => v === "openai" || v === "anthropic" || v === "grok");

  const base = configured.length ? configured : defaultOrder;
  if (!preferredProvider || preferredProvider === "auto") return [...new Set(base)];
  return [preferredProvider, ...base.filter((p) => p !== preferredProvider)];
}

async function callOpenAiLike(args: {
  apiBase: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: AiChatMessage[];
}): Promise<string | null> {
  if (!args.apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${args.apiBase.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${args.apiKey}`,
      },
      body: JSON.stringify({
        model: args.model,
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          { role: "system", content: args.systemPrompt },
          ...args.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const data = (await res.json()) as any;
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string") return null;
    const clean = text.trim();
    return clean || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function callAnthropic(args: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: AiChatMessage[];
}): Promise<string | null> {
  if (!args.apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": args.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: args.model,
        max_tokens: 500,
        system: args.systemPrompt,
        messages: args.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const data = (await res.json()) as any;
    const text = data?.content?.find?.((c: any) => c?.type === "text")?.text;
    if (typeof text !== "string") return null;
    const clean = text.trim();
    return clean || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAiSupportReply(args: GenerateArgs): Promise<AiReplyResult | null> {
  const order = resolveProviderOrder(args.preferredProvider);

  for (const provider of order) {
    if (provider === "openai") {
      const text = await callOpenAiLike({
        apiBase: getEnv("OPENAI_API_BASE") || "https://api.openai.com/v1",
        apiKey: getEnv("OPENAI_API_KEY"),
        model: getEnv("OPENAI_MODEL") || "gpt-4o-mini",
        systemPrompt: args.systemPrompt,
        messages: args.messages,
      });
      if (text) return { text, provider, model: getEnv("OPENAI_MODEL") || "gpt-4o-mini" };
      continue;
    }

    if (provider === "anthropic") {
      const model = getEnv("ANTHROPIC_MODEL") || "claude-3-5-haiku-latest";
      const text = await callAnthropic({
        apiKey: getEnv("ANTHROPIC_API_KEY"),
        model,
        systemPrompt: args.systemPrompt,
        messages: args.messages,
      });
      if (text) return { text, provider, model };
      continue;
    }

    const groqApiKey = getEnv("GROQ_API_KEY");
    if (groqApiKey) {
      const groqModel = getEnv("GROQ_MODEL") || "llama-3.3-70b-versatile";
      const text = await callOpenAiLike({
        apiBase: getEnv("GROQ_API_BASE") || "https://api.groq.com/openai/v1",
        apiKey: groqApiKey,
        model: groqModel,
        systemPrompt: args.systemPrompt,
        messages: args.messages,
      });
      if (text) return { text, provider, model: groqModel };
    }

    const xaiModel = getEnv("XAI_MODEL") || getEnv("GROK_MODEL") || "grok-2-latest";
    const text = await callOpenAiLike({
      apiBase: getEnv("XAI_API_BASE") || "https://api.x.ai/v1",
      apiKey: getEnv("XAI_API_KEY") || getEnv("GROK_API_KEY"),
      model: xaiModel,
      systemPrompt: args.systemPrompt,
      messages: args.messages,
    });
    if (text) return { text, provider, model: xaiModel };
  }

  return null;
}
