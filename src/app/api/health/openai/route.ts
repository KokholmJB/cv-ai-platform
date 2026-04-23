export function GET() {
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

  return Response.json({
    ok: hasOpenAIKey,
    hasOpenAIKey,
  });
}
