# VENDOR ABSTRACTION DESIGN

Defines the interface layer that hides AI model providers from business logic. This is an M2 prerequisite before pipeline migration can start (Fase 0 dependency).

**Status**: Design document. No implementation yet. Target: M2.

---

## Problem

All AI calls in the current codebase are direct `fetch()` calls to Anthropic's API with hardcoded model IDs, endpoint URLs, and header formats. This creates three risks:

1. Changing provider requires touching business logic across all four pipeline layers.
2. Model mix decisions (Opus for Lag 2-3, faster model for Lag 1) are not enforced — any call can use any model.
3. Cost tracking is impossible without instrumenting individual call sites.

---

## Provider interface

```typescript
type ModelTier = "opus" | "sonnet" | "haiku";

type CompletionRequest = {
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
  toolSchema?: ToolSchema;           // optional structured output contract
  toolName?: string;                 // force tool_use for structured JSON
};

type CompletionResponse = {
  content: string | null;
  toolResult: unknown | null;        // parsed tool_use JSON if toolSchema was supplied
  inputTokens: number;
  outputTokens: number;
  modelId: string;                   // actual model used (for cost logging)
  durationMs: number;
};

type ToolSchema = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;  // JSON Schema object
};

interface AIProvider {
  complete(tier: ModelTier, request: CompletionRequest): Promise<CompletionResponse>;
  name(): string;                    // "anthropic" | "openai" | "stub"
}
```

Business logic calls `provider.complete(tier, request)`. It never imports an SDK, calls `fetch` directly to an AI API, or references a model ID string.

---

## Lag 1-4 model assignments

| Layer | Role | Default tier | Rationale |
|-------|------|-------------|-----------|
| Lag 1 | Interview question generation | `sonnet` | Latency-sensitive, conversational, does not require deep reasoning |
| Lag 2 | Profile pattern analysis (completion) | `opus` | Complex multi-field inference; quality is load-bearing for all downstream layers |
| Lag 3 | Authenticity + value synthesis | `opus` | Requires nuanced interpretation of implicit signals; low tolerance for false positives |
| Lag 4 | Profile text generation | `sonnet` | Template-driven output; quality is guided by Lag 3 input, not raw reasoning |

Tier assignments are config, not code. A single env var can downgrade the whole pipeline to `sonnet` for cost testing:

```
LAG2_MODEL_TIER=sonnet   # default: opus
LAG3_MODEL_TIER=opus     # default: opus
LAG4_MODEL_TIER=sonnet   # default: sonnet
LAG1_MODEL_TIER=sonnet   # default: sonnet
```

---

## Env var structure

```
# Provider selection
AI_PROVIDER=anthropic          # anthropic | openai | stub

# Anthropic
ANTHROPIC_API_KEY=...

# Model tier overrides (optional — defaults per table above)
LAG1_MODEL_TIER=sonnet
LAG2_MODEL_TIER=opus
LAG3_MODEL_TIER=opus
LAG4_MODEL_TIER=sonnet

# Feature flags
ENABLE_AI_COMPLETION_ANALYSIS=false   # Lag 2 AI path (already implemented)
ENABLE_AI_LAG3=false                  # Lag 3 AI path (M2)
ENABLE_AI_LAG4=false                  # Lag 4 AI path (M2)
```

The `stub` provider returns deterministic canned responses and is used in tests that do not need real AI output.

---

## Anthropic implementation sketch

```typescript
class AnthropicProvider implements AIProvider {
  private readonly tierToModelId: Record<ModelTier, string> = {
    opus: "claude-opus-4-7",
    sonnet: "claude-sonnet-4-6",
    haiku: "claude-haiku-4-5-20251001",
  };

  async complete(tier: ModelTier, req: CompletionRequest): Promise<CompletionResponse> {
    const modelId = this.tierToModelId[tier];
    const start = Date.now();

    const body: Record<string, unknown> = {
      model: modelId,
      max_tokens: req.maxTokens,
      system: req.systemPrompt,
      messages: [{ role: "user", content: req.userMessage }],
    };

    if (req.toolSchema && req.toolName) {
      body.tools = [{ name: req.toolSchema.name, description: req.toolSchema.description, input_schema: req.toolSchema.inputSchema }];
      body.tool_choice = { type: "tool", name: req.toolName };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // ... parse response, extract content or tool_result, measure tokens and duration
    // ... return CompletionResponse
  }

  name() { return "anthropic" as const; }
}
```

---

## Cost tracking interface

All provider implementations must emit a cost record per call. Tracking is fire-and-forget (does not block the response):

```typescript
type CostRecord = {
  layer: "lag1" | "lag2" | "lag3" | "lag4";
  provider: string;
  modelId: string;
  tier: ModelTier;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  timestamp: string;
  sessionId?: string;
};

interface CostTracker {
  record(entry: CostRecord): void;
}
```

In development: `console.log("[cost]", entry)`.
In production (M2): write to a cost log table (schema TBD in persistence design).

---

## Fallback chain

Each layer has a defined fallback if the AI call fails:

| Layer | Fallback |
|-------|---------|
| Lag 1 | Return a pre-written generic follow-up question from a pool |
| Lag 2 | `buildCompletionAnalysis()` — current rule-based implementation |
| Lag 3 | Return `authenticityConfidence: "low"` with empty arrays |
| Lag 4 | Return raw Lag 3 output formatted as plain text |

Fallback activation is logged with `[lag{N}] ai fallback: {reason}`. The fallback must never throw — it is the final safety net.

---

## Adding a new provider

1. Implement `AIProvider` interface.
2. Map `ModelTier` to provider-specific model IDs.
3. Register under `AI_PROVIDER=<name>` in env var docs.
4. Add a stub entry in the test provider factory.
5. Run benchmark suite (see BENCHMARK_SUITE_DESIGN.md) against the new provider before using it in production.

Do not add a provider without completing step 5.

---

## Versionering

- **v0.1** (2026-05-14): Initialudkast. Interface-design og env-var-struktur. Ingen implementation.
