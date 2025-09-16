import { NextResponse } from "next/server";

/**
 * Proxy endpoint to forward chat messages from the web app to the local Eliza agent
 * running via Docker Compose. This avoids CORS and lets us keep the agent port private.
 *
 * Default agent name is "Eliza" which matches [agent/src/character.ts](agent/src/character.ts:9).
 * Default agent port is 3001 (configured in docker-compose).
 *
 * POST body shape (mirrors agent's DirectClient API):
 * {
 *   "text": string,
 *   "userId": string,
 *   "userName": string
 * }
 */
const DEFAULT_AGENT_NAME = process.env.ELIZA_AGENT_NAME || "Eliza";
const DEFAULT_AGENT_PORT = process.env.ELIZA_AGENT_PORT || "3001";
const DEFAULT_AGENT_HOST = process.env.ELIZA_AGENT_HOST || "http://localhost";

function buildAgentUrl(agent = DEFAULT_AGENT_NAME) {
  return `${DEFAULT_AGENT_HOST}:${DEFAULT_AGENT_PORT}/${encodeURIComponent(agent)}/message`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { text, userId = "user", userName = "User", agent = DEFAULT_AGENT_NAME } = body || {};

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' in request body" }, { status: 400 });
    }

    const url = buildAgentUrl(agent);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, userId, userName }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Agent request failed", status: res.status, data },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy error", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    info: "POST to this endpoint to proxy chat to the Eliza agent.",
    example: {
      url: "/api/agent/message",
      method: "POST",
      body: { text: "Hello", userId: "user", userName: "User" }
    },
    agentTarget: {
      name: DEFAULT_AGENT_NAME,
      url: buildAgentUrl(DEFAULT_AGENT_NAME),
    },
  });
}