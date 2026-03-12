import { useState } from 'react';
import type { Pattern } from '../../types';
import { ChevronDown, ChevronUp, Trophy, TrendingUp, BarChart2 } from 'lucide-react';
import styles from './Insights.module.css';

interface Props {
  pattern: Pattern;
  rank: number;
}

export default function PatternCard({ pattern, rank }: Props) {
  const [expanded, setExpanded] = useState(rank === 0);

  const bestResponse = pattern.responses[0];
  const winRateColor =
    pattern.winRate >= 60
      ? 'var(--win)'
      : pattern.winRate >= 35
      ? 'var(--followup)'
      : 'var(--loss)';

  return (
    <div className={styles.patternCard} style={{ animationDelay: `${rank * 50}ms` }}>
      <div className={styles.patternHeader} onClick={() => setExpanded((v) => !v)}>
        <div className={styles.rankBadge}>#{rank + 1}</div>
        <div className={styles.patternMeta}>
          <p className={styles.objectionText}>"{pattern.objection}"</p>
          <div className={styles.patternStats}>
            <span className={styles.statChip}>
              <BarChart2 size={11} />
              {pattern.totalCount} logged
            </span>
            <span className={styles.statChip} style={{ color: winRateColor }}>
              <TrendingUp size={11} />
              {pattern.winRate}% win rate
            </span>
          </div>
        </div>
        <button className={styles.expandIcon} aria-label="toggle">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className={styles.patternBody}>
          {bestResponse && (
            <div className={styles.bestResponse}>
              <div className={styles.bestResponseLabel}>
                <Trophy size={12} />
                BEST PERFORMING RESPONSE
              </div>
              <p className={styles.bestResponseText}>{bestResponse.response}</p>
              <div className={styles.responseStats}>
                <span className={styles.winStat}>
                  {bestResponse.wins}W
                </span>
                <span className={styles.lossStat}>
                  {bestResponse.losses}L
                </span>
                <span className={styles.followupStat}>
                  {bestResponse.followUps} F/U
                </span>
                <span className={styles.winRateStat} style={{ color: winRateColor }}>
                  {bestResponse.winRate}% win rate
                </span>
              </div>
            </div>
          )}

          {pattern.responses.length > 1 && (
            <div className={styles.allResponses}>
              <p className={styles.allResponsesLabel}>ALL RESPONSES TRIED</p>
              <div className={styles.responseList}>
                {pattern.responses.map((r, i) => (
                  <div key={i} className={styles.responseRow}>
                    <div className={styles.responseRowText}>
                      <span className={styles.responseRank}>{i + 1}</span>
                      <span>{r.response}</span>
                    </div>
                    <div className={styles.responseRowStats}>
                      <span>{r.count}x</span>
                      <span
                        className={styles.responseWinRate}
                        style={{
                          color:
                            r.winRate >= 60
                              ? 'var(--win)'
                              : r.winRate >= 35
                              ? 'var(--followup)'
                              : 'var(--loss)',
                        }}
                      >
                        {r.winRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
