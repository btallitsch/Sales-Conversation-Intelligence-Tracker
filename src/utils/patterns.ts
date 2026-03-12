import type { Interaction, Pattern, ResponsePattern, DashboardStats } from '../types';

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function groupByObjection(interactions: Interaction[]): Map<string, Interaction[]> {
  const map = new Map<string, Interaction[]>();
  for (const interaction of interactions) {
    const key = normalizeText(interaction.objection);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(interaction);
  }
  return map;
}

function buildResponsePattern(responses: Interaction[]): ResponsePattern[] {
  const responseMap = new Map<string, Interaction[]>();
  for (const i of responses) {
    const key = normalizeText(i.response);
    if (!responseMap.has(key)) responseMap.set(key, []);
    responseMap.get(key)!.push(i);
  }

  const patterns: ResponsePattern[] = [];
  for (const [, items] of responseMap) {
    const wins = items.filter((i) => i.outcome === 'win').length;
    const losses = items.filter((i) => i.outcome === 'loss').length;
    const followUps = items.filter((i) => i.outcome === 'follow-up').length;
    const count = items.length;
    patterns.push({
      response: items[0].response,
      count,
      wins,
      losses,
      followUps,
      winRate: count > 0 ? Math.round((wins / count) * 100) : 0,
    });
  }

  return patterns.sort((a, b) => b.winRate - a.winRate || b.count - a.count);
}

export function analyzePatterns(interactions: Interaction[]): Pattern[] {
  const grouped = groupByObjection(interactions);
  const patterns: Pattern[] = [];

  for (const [objectionKey, items] of grouped) {
    const wins = items.filter((i) => i.outcome === 'win').length;
    const responsePatterns = buildResponsePattern(items);

    // Use original (non-normalized) objection text from the most recent entry
    const sortedByDate = [...items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    patterns.push({
      objection: sortedByDate[0].objection,
      responses: responsePatterns,
      totalCount: items.length,
      winRate: items.length > 0 ? Math.round((wins / items.length) * 100) : 0,
    });
  }

  return patterns.sort((a, b) => b.totalCount - a.totalCount);
}

export function computeStats(interactions: Interaction[]): DashboardStats {
  const total = interactions.length;
  const wins = interactions.filter((i) => i.outcome === 'win').length;
  const losses = interactions.filter((i) => i.outcome === 'loss').length;
  const followUps = interactions.filter((i) => i.outcome === 'follow-up').length;

  const patterns = analyzePatterns(interactions);
  const topPattern = patterns[0];

  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Trend: compare last 5 vs previous 5
  const recent = interactions.slice(0, 5);
  const previous = interactions.slice(5, 10);
  const recentWins = recent.filter((i) => i.outcome === 'win').length;
  const previousWins = previous.filter((i) => i.outcome === 'win').length;

  let recentTrend: 'up' | 'down' | 'flat' = 'flat';
  if (previous.length > 0) {
    if (recentWins > previousWins) recentTrend = 'up';
    else if (recentWins < previousWins) recentTrend = 'down';
  }

  return {
    totalInteractions: total,
    winRate,
    winCount: wins,
    lossCount: losses,
    followUpCount: followUps,
    mostCommonObjection: topPattern?.objection ?? '—',
    bestResponse: topPattern?.responses[0]?.response ?? '—',
    recentTrend,
  };
}

export function getObjectionKeywords(interactions: Interaction[]): Array<{ word: string; count: number }> {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'this',
    'that', 'these', 'those', 'and', 'but', 'or', 'nor', 'for', 'yet',
    'so', 'to', 'of', 'in', 'on', 'at', 'by', 'up', 'as', 'into', 'not',
    'just', 'too', 'very', 'also',
  ]);

  const wordCount = new Map<string, number>();
  for (const interaction of interactions) {
    const words = interaction.objection
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
    for (const word of words) {
      wordCount.set(word, (wordCount.get(word) ?? 0) + 1);
    }
  }

  return [...wordCount.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}
