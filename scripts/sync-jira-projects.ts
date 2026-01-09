import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import type { Ship } from '../src/types';

type JiraIssue = {
  key: string;
  link?: string;
  url?: string;
  summary?: string;
  title?: string;
  status?: string;
  priority?: string;
  area?: string;
  product?: string;
  onePagerStatus?: string;
  labels?: string[];
  components?: Array<{ name: string } | string>;
  issueType?: string;
  reporter?: string;
  assignee?: string;
};

type JiraPayload =
  | JiraIssue[]
  | { issues: JiraIssue[] }
  | { data: { issues: JiraIssue[] } };

type Options = {
  quarter: string;
  input?: string;
  out?: string;
  includeNonEpics?: boolean;
  jiraBaseUrl: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readStdin = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

const parseArgs = (argv: string[]): Options => {
  const out: Partial<Options> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--quarter') {
      out.quarter = argv[++i] ?? '';
      continue;
    }
    if (arg === '--input') {
      out.input = argv[++i];
      continue;
    }
    if (arg === '--out') {
      out.out = argv[++i];
      continue;
    }
    if (arg === '--include-non-epics') {
      out.includeNonEpics = true;
      continue;
    }
    if (arg === '--jira-base-url') {
      out.jiraBaseUrl = argv[++i] ?? '';
      continue;
    }
  }

  if (!out.quarter) {
    throw new Error('Missing required --quarter');
  }

  const jiraBaseUrl = out.jiraBaseUrl?.trim() || 'https://jira.cfdata.org';

  return {
    quarter: out.quarter,
    input: out.input,
    out: out.out,
    includeNonEpics: out.includeNonEpics ?? false,
    jiraBaseUrl,
  };
};

const normalizeComponents = (components: JiraIssue['components']): string[] => {
  if (!components) return [];
  return components
    .map((c) => (typeof c === 'string' ? c : c?.name))
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
};

const normalizeLabels = (labels: JiraIssue['labels']): string[] =>
  (labels ?? []).map((l) => String(l).trim()).filter(Boolean);

const normalizeQuarter = (q: string): string => {
  const raw = q.trim();

  let m = raw.match(/^Q([1-4])[-_\s]?(\d{4})$/i);
  if (m) return `Q${m[1]} ${m[2]}`;

  m = raw.match(/^(\d{4})[-_\s]?Q([1-4])$/i);
  if (m) return `Q${m[2]} ${m[1]}`;

  return raw;
};

const quarterToSlug = (quarter: string): string => normalizeQuarter(quarter).toLowerCase().replace(/\s+/g, '-');

const mapJiraStatusToShipStatus = (status?: string): Ship['status'] => {
  const s = (status ?? '').toLowerCase();

  if (['in review', 'review', 'qa', 'testing'].some((k) => s.includes(k))) return 'In Review';
  if (['planning', 'planned', 'ready'].some((k) => s.includes(k))) return 'Planned';
  if (['committed', 'in progress', 'doing', 'implementing', 'done', 'closed'].some((k) => s.includes(k))) {
    return 'Committed';
  }
  return 'Backlog';
};

const mapJiraPriorityToShipPriority = (priority?: string): Ship['priority'] | undefined => {
  if (!priority) return undefined;
  const p = priority.toUpperCase();
  if (p.includes('P1')) return 'P1';
  if (p.includes('P2')) return 'P2';
  if (p.includes('P3')) return 'P3';
  if (p.includes('P4')) return 'P4';

  const pl = priority.toLowerCase();
  if (['highest', 'blocker', 'critical', 'urgent'].some((k) => pl.includes(k))) return 'P1';
  if (pl.includes('high')) return 'P2';
  if (['medium', 'normal'].some((k) => pl.includes(k))) return 'P3';
  if (['low', 'lowest'].some((k) => pl.includes(k))) return 'P4';
  return undefined;
};

const parseQuarterFromLabels = (labels: string[]): string | undefined => {
  for (const raw of labels) {
    const l = raw.trim();

    let m = l.match(/^Q([1-4])[-_\s]?(\d{4})$/i);
    if (m) return `Q${m[1]} ${m[2]}`;

    m = l.match(/^([0-9]{4})Q([1-4])$/i);
    if (m) return `Q${m[2]} ${m[1]}`;

    m = l.match(/^([0-9]{4}).*Q([1-4])$/i);
    if (m) return `Q${m[2]} ${m[1]}`;
  }
  return undefined;
};

const parseOnePagerStatusFromLabels = (labels: string[]): Ship['onePagerStatus'] => {
  const normalized = labels.map((l) => l.toLowerCase());

  if (normalized.some((l) => l.includes('onepager-approved'))) return 'approved';
  if (normalized.some((l) => l.includes('onepager-ready_for_review'))) return 'ready_for_review';
  if (normalized.some((l) => l.includes('onepager-in_progress'))) return 'in_progress';
  if (normalized.some((l) => l.includes('onepager-missing'))) return 'missing';

  return 'missing';
};

const normalizeOnePagerStatus = (value?: string): Ship['onePagerStatus'] | undefined => {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  if (!v) return undefined;

  if (v === 'approved') return 'approved';
  if (v === 'ready_for_review' || v === 'ready for review') return 'ready_for_review';
  if (v === 'in_progress' || v === 'in progress') return 'in_progress';

  if (
    v === 'missing' ||
    v === 'none' ||
    v === 'not started' ||
    v === 'n/a' ||
    v === '-' ||
    v === '—' ||
    v === 'null' ||
    v.includes('missing')
  ) {
    return 'missing';
  }

  return undefined;
};

const deriveAreaAndProduct = (labels: string[], components: string[]): { area: string; product: string } => {
  const areaLabel = labels.find((l) => l.toLowerCase().startsWith('area:'));
  const area = areaLabel ? areaLabel.split(':').slice(1).join(':').trim() : '';

  const product = components[0] ?? '';

  return {
    area: area || '—',
    product: product || '—',
  };
};

const mapJiraIssueToProject = (issue: JiraIssue, opts: Options): Ship => {
  const labels = normalizeLabels(issue.labels);
  const components = normalizeComponents(issue.components);

  const { area: derivedArea, product: derivedProduct } = deriveAreaAndProduct(labels, components);
  const area = issue.area?.trim() || derivedArea;
  const product = issue.product?.trim() || derivedProduct;

  const title = (issue.summary ?? issue.title ?? issue.key ?? '').trim() || issue.key;

  const targetQuarter = parseQuarterFromLabels(labels) ?? normalizeQuarter(opts.quarter);

  const onePagerStatus =
    normalizeOnePagerStatus(issue.onePagerStatus) ?? parseOnePagerStatusFromLabels(labels);

  const priority = mapJiraPriorityToShipPriority(issue.priority);

  const mustHave = priority === 'P1' || priority === 'P2';

  const jiraUrl =
    issue.link ??
    issue.url ??
    `${opts.jiraBaseUrl.replace(/\/$/, '')}/browse/${encodeURIComponent(issue.key)}`;

  return {
    id: issue.key,
    jiraKey: issue.key,
    jiraUrl,
    title,
    area,
    product,
    pmNames: issue.reporter ? [issue.reporter] : [],
    targetQuarter,
    tshirtSizeByRole: {},
    status: mapJiraStatusToShipStatus(issue.status),
    priority,
    mustHave,
    onePagerStatus,
  };
};

const extractIssues = (payload: JiraPayload): JiraIssue[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    if (Array.isArray((payload as any).issues)) return (payload as any).issues;
    if ((payload as any).data && Array.isArray((payload as any).data.issues)) return (payload as any).data.issues;
  }
  throw new Error('Unsupported input JSON shape; expected an array of issues or an object with { issues: [...] }.');
};

const isEpicOrInitiative = (issue: JiraIssue): boolean => {
  if (!issue.issueType) return true;
  const t = (issue.issueType ?? '').toLowerCase();
  return t === 'epic' || t === 'initiative';
};

const main = async () => {
  const opts = parseArgs(process.argv.slice(2));

  const raw = opts.input
    ? await fs.readFile(path.resolve(__dirname, '..', opts.input), 'utf8')
    : await readStdin();

  if (!raw.trim()) {
    throw new Error('No input provided. Pass --input <file.json> or pipe JSON to stdin.');
  }

  const parsed = JSON.parse(raw) as JiraPayload;
  const issues = extractIssues(parsed);

  const filtered = opts.includeNonEpics ? issues : issues.filter(isEpicOrInitiative);

  const projects = filtered.map((issue) => mapJiraIssueToProject(issue, opts));

  const outFile =
    opts.out ??
    path.resolve(__dirname, '..', 'src', 'data', `projects.${quarterToSlug(opts.quarter)}.json`);

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(projects, null, 2) + '\n', 'utf8');

  process.stdout.write(`${projects.length} projects written to ${outFile}\n`);
};

main().catch((err) => {
  process.stderr.write(String(err?.stack ?? err) + '\n');
  process.exitCode = 1;
});
