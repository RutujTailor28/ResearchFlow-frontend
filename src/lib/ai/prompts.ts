import type { PlanImproveAction, ResearchPlan } from '../../types/ai';
import type { ResearchDepth } from '../../types';

const DEPTH_SECTION_LIMITS: Record<ResearchDepth, number> = {
  quick: 3,
  standard: 5,
  deep: 8,
};

export function getMaxSectionsForDepth(depth: ResearchDepth): number {
  return DEPTH_SECTION_LIMITS[depth] ?? 5;
}

export function createPlannerPrompt(input: {
  topic: string;
  depth: ResearchDepth;
  audience?: string;
  tone?: string;
  targetLength?: string;
  preferredSources?: string[];
}): { system: string; user: string } {
  const maxSections = getMaxSectionsForDepth(input.depth);

  const system = `You are the Planner Agent for ResearchFlow, a multi-agent research report generator.
Your ONLY job is to create a structured research plan. Do NOT perform web research and do NOT write the final report.

Return ONLY valid JSON matching this schema:
{
  "title": string,
  "summary": string,
  "sections": [
    {
      "id": string,
      "title": string,
      "description": string,
      "subQuestions": string[]
    }
  ]
}

Rules:
- Create at most ${maxSections} sections for depth "${input.depth}".
- Prefer exactly ${maxSections} high-quality sections unless the topic is extremely narrow.
- Each section needs 2–4 focused sub-questions.
- Section ids must be unique strings like "section-1".
- Keep titles concise and research-ready.
- Do not wrap the JSON in markdown fences.`;

  const user = `Create a research plan for this brief:

Topic: ${input.topic}
Depth: ${input.depth} (max ${maxSections} sections)
Audience: ${input.audience ?? 'General'}
Tone: ${input.tone ?? 'Professional'}
Target length: ${input.targetLength ?? 'Medium'}
Preferred sources: ${(input.preferredSources ?? []).join(', ') || 'Any reputable sources'}

Remember: plan only — no research findings yet.`;

  return { system, user };
}

const IMPROVE_ACTION_INSTRUCTIONS: Record<PlanImproveAction, string> = {
  improve:
    'Improve clarity, structure, and coverage while preserving the topic and overall intent.',
  'more-detailed':
    'Make the plan more detailed with richer section descriptions and sharper sub-questions.',
  'more-technical':
    'Make the plan more technical and domain-specific without abandoning the original topic.',
  simplify:
    'Simplify the plan for broader accessibility while keeping research usefulness.',
  'add-questions':
    'Keep existing sections and add stronger, more specific sub-questions under each section.',
};

export function createPlanImprovementPrompt(input: {
  topic: string;
  depth: ResearchDepth;
  action: PlanImproveAction;
  plan: ResearchPlan;
  audience?: string;
  tone?: string;
  targetLength?: string;
  preferredSources?: string[];
}): { system: string; user: string } {
  const maxSections = getMaxSectionsForDepth(input.depth);

  const system = `You are the Planner Agent for ResearchFlow.
Improve an existing research plan. Preserve the user's topic. Do NOT invent an unrelated plan.
Do NOT perform web research.

Return ONLY valid JSON with this schema:
{
  "title": string,
  "summary": string,
  "sections": [
    {
      "id": string,
      "title": string,
      "description": string,
      "subQuestions": string[]
    }
  ]
}

Rules:
- Keep at most ${maxSections} sections for depth "${input.depth}".
- Preserve useful existing structure when possible.
- Action focus: ${IMPROVE_ACTION_INSTRUCTIONS[input.action]}
- Do not wrap the JSON in markdown fences.`;

  const user = `Topic: ${input.topic}
Depth: ${input.depth}
Audience: ${input.audience ?? 'General'}
Tone: ${input.tone ?? 'Professional'}
Target length: ${input.targetLength ?? 'Medium'}
Preferred sources: ${(input.preferredSources ?? []).join(', ') || 'Any reputable sources'}
Improvement action: ${input.action}

Current plan JSON:
${JSON.stringify(input.plan, null, 2)}`;

  return { system, user };
}

export function createWriterPrompt(input: {
  topic: string;
  sectionTitle: string;
  subQuestions: string[];
  findings?: string[];
  sources?: Array<{ id: number; name: string; title: string; snippet: string; category: string }>;
  audience?: string;
  tone?: string;
  targetLength?: string;
}): { system: string; user: string } {
  const system = `You are the Writer Agent for ResearchFlow.
Write ONE report section from the provided findings/sources.
Do not invent unsupported statistics.

Return ONLY compact valid JSON (no markdown, no thinking):
{
  "sectionTitle": string,
  "content": string,
  "keyPoints": string[]
}

Rules:
- content: 2 short paragraphs max
- keyPoints: 3 bullets max
- Keep the whole JSON under ~1200 characters
- Optional citations like [1] only for provided source ids`;

  const user = `Research topic: ${input.topic}
Section title: ${input.sectionTitle}
Sub-questions:
${input.subQuestions.slice(0, 4).map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None provided'}

Audience: ${input.audience ?? 'General'}
Tone: ${input.tone ?? 'Professional'}

Findings:
${(input.findings ?? []).slice(0, 5).map((f) => `- ${f}`).join('\n') || '- Limited findings; write carefully.'}

Sources:
${(input.sources ?? [])
  .slice(0, 5)
  .map((s) => `[${s.id}] ${s.name} — ${s.title}: ${s.snippet}`)
  .join('\n') || 'No sources provided.'}

Respond with JSON only.`;

  return { system, user };
}

export function createVerifierPrompt(input: {
  topic: string;
  sectionTitle: string;
  content: string;
  findings?: string[];
  sources?: Array<{ id: number; name: string; title: string; snippet: string; category: string }>;
}): { system: string; user: string } {
  const system = `You are the Verifier Agent for ResearchFlow.
Analyze one report section against findings/sources.

Return ONLY a compact valid JSON object (no markdown, no thinking, no prose):
{
  "confidence": "high" | "medium" | "low",
  "verifiedClaims": string[],
  "unverifiedClaims": string[],
  "warnings": string[],
  "suggestions": string[]
}

Hard limits:
- Max 3 items in each array
- Each string under 140 characters
- Keep the entire JSON under 900 characters
- confidence must be exactly high, medium, or low`;

  const clippedContent =
    input.content.length > 1800 ? `${input.content.slice(0, 1800)}…` : input.content;

  const user = `Topic: ${input.topic}
Section: ${input.sectionTitle}

Section content:
${clippedContent}

Findings:
${(input.findings ?? []).slice(0, 6).map((f) => `- ${f}`).join('\n') || '- None'}

Sources:
${(input.sources ?? [])
  .slice(0, 6)
  .map((s) => `[${s.id}] ${s.name}: ${s.title} — ${s.snippet}`)
  .join('\n') || 'None'}

Respond with JSON only.`;

  return { system, user };
}

export function createResearcherPrompt(input: {
  topic: string;
  depth: ResearchDepth;
  planSections: Array<{ id: string; title: string; subQuestions: string[] }>;
  audience?: string;
  tone?: string;
  preferredSources?: string[];
}): { system: string; user: string } {
  const sourceCount =
    input.depth === 'quick' ? 4 : input.depth === 'deep' ? 8 : 6;
  const findingCount =
    input.depth === 'quick' ? 5 : input.depth === 'deep' ? 10 : 7;
  const eventCount =
    input.depth === 'quick' ? 4 : input.depth === 'deep' ? 8 : 6;

  const system = `You are the Research Agent team for ResearchFlow.
Gather research evidence for a report plan using your trained knowledge of reputable sources.
Do NOT invent fake statistics with false precision. Prefer well-known orgs, papers, and reports.
This is knowledge-based research (not live web crawl). Use real-looking source names and URLs when known; otherwise use official domain paths.

Return ONLY compact valid JSON (no markdown, no thinking):
{
  "sources": [
    {
      "domain": string,
      "name": string,
      "title": string,
      "url": string,
      "category": "Academic Papers" | "Official Sources" | "Industry Reports" | "News Publications" | "Government Data",
      "qualityScore": number,
      "snippet": string,
      "author": string,
      "publishedYear": string
    }
  ],
  "findings": string[],
  "events": [
    {
      "agentId": "researcher-alpha" | "researcher-beta" | "researcher-gamma" | "researcher-delta",
      "agentName": string,
      "title": string,
      "badgeType": "search" | "read" | "finding",
      "toolName": string,
      "input": string,
      "output": string,
      "tokens": number
    }
  ],
  "agentUpdates": [
    {
      "agentId": string,
      "currentAction": string,
      "sourcesCount": number,
      "findingsCount": number
    }
  ]
}

Rules:
- Exactly ${sourceCount} sources
- ${findingCount} findings (short factual bullets tied to the plan)
- ${eventCount} timeline events describing research steps
- agentUpdates for all four researcher agents
- qualityScore between 70 and 98
- snippets under 220 characters
- Keep total JSON under ~4500 characters`;

  const planBlock = input.planSections
    .slice(0, 8)
    .map(
      (s, i) =>
        `${i + 1}. ${s.title}\n   Qs: ${s.subQuestions.slice(0, 3).join(' | ') || 'n/a'}`
    )
    .join('\n');

  const user = `Topic: ${input.topic}
Depth: ${input.depth}
Audience: ${input.audience ?? 'General'}
Tone: ${input.tone ?? 'Professional'}
Preferred source types: ${(input.preferredSources ?? []).join(', ') || 'Any reputable'}

Approved plan sections:
${planBlock}

Produce the research bundle JSON now.`;

  return { system, user };
}
