import type { ReactNode } from 'react';
import styles from './Dashboard.module.css';

interface Props {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  accent?: 'gold' | 'win' | 'loss' | 'followup' | 'teal';
  trend?: 'up' | 'down' | 'flat';
}

const accentMap = {
  gold: 'var(--accent-gold)',
  win: 'var(--win)',
  loss: 'var(--loss)',
  followup: 'var(--followup)',
  teal: 'var(--accent-teal)',
};

export default function StatsCard({ label, value, subValue, icon, accent = 'gold', trend }: Props) {
  const color = accentMap[accent];

  return (
    <div className={styles.statsCard} style={{ '--card-accent': color } as React.CSSProperties}>
      <div className={styles.statsTop}>
        <span className={styles.statsLabel}>{label}</span>
        {icon && <div className={styles.statsIcon}>{icon}</div>}
      </div>
      <div className={styles.statsValue}>{value}</div>
      {(subValue || trend) && (
        <div className={styles.statsBottom}>
          {trend && (
            <span
              className={styles.trendIndicator}
              data-trend={trend}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              {trend === 'up' ? ' TRENDING UP' : trend === 'down' ? ' TRENDING DOWN' : ' STABLE'}
            </span>
          )}
          {subValue && <span className={styles.subValue}>{subValue}</span>}
        </div>
      )}
    </div>
  );
}
