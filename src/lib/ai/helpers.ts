import type {
  AiCallMeta,
  PlanSection,
  ResearchAgentUpdate,
  ResearchBundle,
  ResearchEventDraft,
  ResearchPlan,
  VerificationConfidence,
  VerificationResult,
  WrittenSection,
} from '../../types/ai';
import type { ResearchDepth, SourceCategory, SourceItem } from '../../types';
import { AiParseError } from './openrouter';
import { getMaxSectionsForDepth } from './prompts';
import { isPlanImproveAction } from './mappers';

export { isPlanImproveAction, planToUiSections, uiSectionsToPlan, writtenSectionToReportItem } from './mappers';

const SOURCE_CATEGORIES: SourceCategory[] = [
  'Academic Papers',
  'Official Sources',
  'Industry Reports',
  'News Publications',
  'Government Data',
];

const RESEARCHER_IDS = [
  'researcher-alpha',
  'researcher-beta',
  'researcher-gamma',
  'researcher-delta',
] as const;

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();

  const tryParse = (value: string): unknown | undefined => {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  };

  const direct = tryParse(trimmed);
  if (direct !== undefined) return direct;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    const parsedFence = tryParse(fenced[1].trim());
    if (parsedFence !== undefined) return parsedFence;
  }

  const start = trimmed.indexOf('{');
  if (start >= 0) {
    const end = trimmed.lastIndexOf('}');
    if (end > start) {
      const sliced = trimmed.slice(start, end + 1);
      const parsedSlice = tryParse(sliced);
      if (parsedSlice !== undefined) return parsedSlice;
    }

    // Repair truncated JSON objects from free models that hit max tokens.
    const repaired = repairTruncatedJsonObject(trimmed.slice(start));
    if (repaired !== undefined) return repaired;
  }

  throw new AiParseError('Unable to parse AI JSON response.');
}

function repairTruncatedJsonObject(fragment: string): unknown | undefined {
  let candidate = fragment.trim();

  // Drop trailing incomplete string/token junk after last complete value boundary.
  candidate = candidate.replace(/,\s*("[^"]*)?$/g, '');
  candidate = candidate.replace(/:\s*("[^"]*)?$/g, ': null');

  const opens = (candidate.match(/\{/g) || []).length;
  const closes = (candidate.match(/\}/g) || []).length;
  const openArr = (candidate.match(/\[/g) || []).length;
  const closeArr = (candidate.match(/\]/g) || []).length;

  // Close open strings if odd number of quotes.
  const quoteCount = (candidate.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    candidate += '"';
  }

  if (openArr > closeArr) {
    candidate += ']'.repeat(openArr - closeArr);
  }
  if (opens > closes) {
    candidate += '}'.repeat(opens - closes);
  }

  try {
    return JSON.parse(candidate);
  } catch {
    return undefined;
  }
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

export function normalizeResearchPlan(
  raw: unknown,
  depth: ResearchDepth,
  fallbackTopic: string
): ResearchPlan {
  if (!raw || typeof raw !== 'object') {
    throw new AiParseError('Research plan response was not an object.');
  }

  const data = raw as Record<string, unknown>;
  const maxSections = getMaxSectionsForDepth(depth);
  const sectionsRaw = Array.isArray(data.sections) ? data.sections : [];

  const sections: PlanSection[] = sectionsRaw
    .slice(0, maxSections)
    .map((section, index) => {
      const s = (section && typeof section === 'object' ? section : {}) as Record<
        string,
        unknown
      >;
      const subQuestions = asStringArray(s.subQuestions);
      return {
        id: asString(s.id, `section-${index + 1}`),
        title: asString(s.title, `Section ${index + 1}`),
        description: asString(s.description) || undefined,
        subQuestions:
          subQuestions.length > 0
            ? subQuestions.slice(0, 6)
            : ['What are the key facts in this area?', 'What evidence supports the main claims?'],
      };
    })
    .filter((section) => section.title.length > 0);

  if (sections.length === 0) {
    throw new AiParseError('Research plan did not include any valid sections.');
  }

  return {
    title: asString(data.title, fallbackTopic),
    summary: asString(
      data.summary,
      `A structured research plan exploring ${fallbackTopic}.`
    ),
    sections,
  };
}

export function normalizeWrittenSection(
  raw: unknown,
  fallbackTitle: string
): WrittenSection {
  if (!raw || typeof raw !== 'object') {
    throw new AiParseError('Writer response was not an object.');
  }

  const data = raw as Record<string, unknown>;
  const content = asString(data.content);
  if (!content) {
    throw new AiParseError('Writer response did not include content.');
  }

  return {
    sectionTitle: asString(data.sectionTitle, fallbackTitle),
    content,
    keyPoints: asStringArray(data.keyPoints).slice(0, 8),
  };
}

export function normalizeVerificationResult(raw: unknown): VerificationResult {
  if (!raw || typeof raw !== 'object') {
    throw new AiParseError('Verifier response was not an object.');
  }

  const data = raw as Record<string, unknown>;
  const confidenceRaw = asString(data.confidence, 'medium').toLowerCase();
  const confidence: VerificationConfidence =
    confidenceRaw === 'high' || confidenceRaw === 'low' ? confidenceRaw : 'medium';

  // Accept alternate key spellings some free models invent.
  const verifiedClaims = asStringArray(
    data.verifiedClaims ?? data.verified_claims ?? data.verified
  );
  const unverifiedClaims = asStringArray(
    data.unverifiedClaims ?? data.unverified_claims ?? data.unverified
  );
  const warnings = asStringArray(data.warnings ?? data.warning);
  const suggestions = asStringArray(data.suggestions ?? data.suggestion);

  return {
    confidence,
    verifiedClaims,
    unverifiedClaims,
    warnings,
    suggestions,
  };
}

export function fallbackVerificationResult(reason?: string): VerificationResult {
  return {
    confidence: 'medium',
    verifiedClaims: [],
    unverifiedClaims: [],
    warnings: [
      reason ||
        'Automatic verification was incomplete for this section. Review claims manually.',
    ],
    suggestions: ['Re-run verification later or spot-check key citations.'],
  };
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSourceCategory(value: unknown): SourceCategory {
  const raw = asString(value);
  const match = SOURCE_CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
  return match ?? 'Industry Reports';
}

function extractDomain(url: string, fallback: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '') || fallback;
  } catch {
    return fallback.replace(/^www\./, '') || 'source.org';
  }
}

export function normalizeResearchBundle(
  raw: unknown,
  depth: ResearchDepth,
  topic: string
): ResearchBundle {
  if (!raw || typeof raw !== 'object') {
    throw new AiParseError('Research response was not an object.');
  }

  const data = raw as Record<string, unknown>;
  const maxSources = depth === 'quick' ? 4 : depth === 'deep' ? 8 : 6;
  const today = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const sourcesRaw = Array.isArray(data.sources) ? data.sources : [];
  const sources: SourceItem[] = sourcesRaw.slice(0, maxSources).map((item, index) => {
    const s = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const name = asString(s.name, `Source ${index + 1}`);
    const title = asString(s.title, `Evidence related to ${topic}`);
    const url = asString(s.url, `https://example.org/research/${index + 1}`);
    const domain = asString(s.domain) || extractDomain(url, 'example.org');
    const quality = Math.min(98, Math.max(70, Math.round(asNumber(s.qualityScore, 85))));

    return {
      id: index + 1,
      domain,
      name,
      title,
      url,
      category: normalizeSourceCategory(s.category),
      qualityScore: quality,
      status: 'verified' as const,
      snippet: asString(
        s.snippet,
        `Relevant evidence for ${topic} from ${name}.`
      ).slice(0, 280),
      author: asString(s.author) || undefined,
      publishedYear: asString(s.publishedYear) || undefined,
      accessedDate: today,
    };
  });

  if (sources.length === 0) {
    throw new AiParseError('Research response did not include any sources.');
  }

  const findings = asStringArray(data.findings).slice(0, 12);
  if (findings.length === 0) {
    for (const s of sources.slice(0, 4)) {
      findings.push(`${s.name}: ${s.snippet}`);
    }
  }

  const eventsRaw = Array.isArray(data.events) ? data.events : [];
  const events: ResearchEventDraft[] = eventsRaw.slice(0, 10).map((item, index) => {
    const e = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const agentIdRaw = asString(e.agentId, RESEARCHER_IDS[index % RESEARCHER_IDS.length]);
    const agentId = RESEARCHER_IDS.includes(agentIdRaw as (typeof RESEARCHER_IDS)[number])
      ? agentIdRaw
      : RESEARCHER_IDS[index % RESEARCHER_IDS.length];
    const badgeRaw = asString(e.badgeType, 'search').toLowerCase();
    const badgeType =
      badgeRaw === 'read' || badgeRaw === 'finding' || badgeRaw === 'search'
        ? badgeRaw
        : 'search';

    return {
      agentId,
      agentName: asString(e.agentName, 'Researcher Agent'),
      title: asString(e.title, `Research step ${index + 1}`),
      badgeType,
      toolName: asString(e.toolName) || undefined,
      input: asString(e.input) || undefined,
      output: asString(e.output) || undefined,
      tokens: Math.max(0, Math.round(asNumber(e.tokens, 0))) || undefined,
    };
  });

  const updatesRaw = Array.isArray(data.agentUpdates) ? data.agentUpdates : [];
  const agentUpdates: ResearchAgentUpdate[] = RESEARCHER_IDS.map((id, index) => {
    const found = updatesRaw.find((item) => {
      const u = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
      return asString(u.agentId) === id;
    }) as Record<string, unknown> | undefined;

    const share = Math.max(1, Math.ceil(sources.length / RESEARCHER_IDS.length));
    return {
      agentId: id,
      currentAction: asString(
        found?.currentAction,
        `Indexed sources for ${topic.slice(0, 48)}`
      ),
      sourcesCount: Math.max(
        0,
        Math.round(asNumber(found?.sourcesCount, Math.min(share, sources.length - index)))
      ),
      findingsCount: Math.max(
        0,
        Math.round(asNumber(found?.findingsCount, Math.ceil(findings.length / RESEARCHER_IDS.length)))
      ),
    };
  });

  return { sources, findings, events, agentUpdates };
}

export function buildRouteMeta(input: {
  operation: AiCallMeta['operation'];
  meta: {
    requestedModel: string;
    model: string;
    usedFallback?: boolean;
    preview?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    costUsd?: number;
  };
  durationMs: number;
  message: string;
  ok?: boolean;
}): AiCallMeta {
  return {
    ok: input.ok ?? true,
    operation: input.operation,
    requestedModel: input.meta.requestedModel,
    model: input.meta.model,
    durationMs: input.durationMs,
    usedFallback: input.meta.usedFallback,
    preview: input.meta.preview,
    message: input.message,
    promptTokens: input.meta.promptTokens,
    completionTokens: input.meta.completionTokens,
    totalTokens: input.meta.totalTokens,
    costUsd: input.meta.costUsd,
  };
}

export function errorResponse(message: string, status = 500, code?: string): Response {
  return Response.json({ error: message, ...(code ? { code } : {}) }, { status });
}

export function mapAiErrorToResponse(error: unknown): Response {
  const anyErr = error as { code?: string; message?: string; status?: number };

  if (anyErr?.code === 'AI_CONFIG_ERROR') {
    return errorResponse(
      'AI is not configured correctly. Please try again later.',
      503,
      anyErr.code
    );
  }

  if (anyErr?.code === 'AI_TIMEOUT') {
    return errorResponse('The AI request timed out. Please try again.', 504, anyErr.code);
  }

  if (anyErr?.code === 'AI_PARSE_ERROR') {
    return errorResponse(
      'Unable to process the AI response. Please try again.',
      502,
      anyErr.code
    );
  }

  if (anyErr?.code === 'AI_PROVIDER_ERROR') {
    const status = typeof anyErr.status === 'number' ? anyErr.status : 502;
    return errorResponse(
      status === 429
        ? 'The AI service is busy. Please try again shortly.'
        : 'Unable to complete the AI request. Please try again.',
      status >= 400 && status < 600 ? status : 502,
      anyErr.code
    );
  }

  return errorResponse('Something went wrong. Please try again.', 500);
}
