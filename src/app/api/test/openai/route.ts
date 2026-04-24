const model = "gpt-5.4-mini";
const expectedOutput = "JOBPILOT_OPENAI_OK";

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      ok: false,
      error: "OPENAI_API_KEY is not configured.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: `Reply with exactly: ${expectedOutput}`,
      }),
    });

    if (!response.ok) {
      return Response.json({
        ok: false,
        error: "OpenAI request failed.",
        status: response.status,
      });
    }

    const data = (await response.json()) as Record<string, unknown>;
    const outputItems = Array.isArray(data.output) ? data.output : [];
    const assistantMessage = outputItems.find((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return false;
      }

      const candidate = item as Record<string, unknown>;
      return candidate.type === "message" && candidate.role === "assistant";
    });

    if (!assistantMessage || typeof assistantMessage !== "object" || Array.isArray(assistantMessage)) {
      return Response.json({
        ok: false,
        error: "Could not find assistant message.",
      });
    }

    const assistantMessageRecord = assistantMessage as Record<string, unknown>;
    const content = Array.isArray(assistantMessageRecord.content) ? assistantMessageRecord.content : [];
    const textItem = content.find((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return false;
      }

      const candidate = item as Record<string, unknown>;

      if (typeof candidate.text === "string") {
        return true;
      }

      if (!candidate.text || typeof candidate.text !== "object" || Array.isArray(candidate.text)) {
        return false;
      }

      const textObject = candidate.text as Record<string, unknown>;
      return typeof textObject.value === "string";
    });

    const outputText =
      textItem && typeof textItem === "object" && !Array.isArray(textItem)
        ? typeof (textItem as Record<string, unknown>).text === "string"
          ? ((textItem as Record<string, unknown>).text as string).trim()
          : (textItem as Record<string, unknown>).text &&
              typeof (textItem as Record<string, unknown>).text === "object" &&
              !Array.isArray((textItem as Record<string, unknown>).text) &&
              typeof ((textItem as Record<string, unknown>).text as Record<string, unknown>).value === "string"
            ? (((textItem as Record<string, unknown>).text as Record<string, unknown>).value as string).trim()
            : ""
        : "";

    if (!outputText) {
      return Response.json({
        ok: false,
        error: "Could not parse assistant text.",
      });
    }

    if (outputText !== expectedOutput) {
      return Response.json({
        ok: false,
        error: "OpenAI returned unexpected text.",
      });
    }

    return Response.json({
      ok: true,
      model: typeof data.model === "string" ? data.model : model,
      outputText,
    });
  } catch {
    return Response.json({
      ok: false,
      error: "OpenAI request could not be completed.",
    });
  }
}
