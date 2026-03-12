import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInteractions } from '../hooks/useInteractions';
import { computeStats } from '../utils/patterns';
import StatsCard from '../components/dashboard/StatsCard';
import {
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Plus,
  Zap,
} from 'lucide-react';
import styles from './Pages.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { interactions, loading } = useInteractions(user?.uid);

  const stats = useMemo(() => computeStats(interactions), [interactions]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'GOOD MORNING';
    if (h < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const recentInteractions = interactions.slice(0, 5);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.pageGreeting}>{greeting()},</p>
          <h1 className={styles.pageTitle}>
            {user?.displayName ?? user?.email?.split('@')[0] ?? 'AGENT'}
          </h1>
          <p className={styles.pageSubtitle}>
            Your sales intelligence briefing —{' '}
            <span className={styles.accentText}>{stats.totalInteractions} interactions logged</span>
          </p>
        </div>
        <Link to="/interactions" className={styles.ctaBtn}>
          <Plus size={16} />
          LOG INTERACTION
        </Link>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Loading your data...</div>
      ) : stats.totalInteractions === 0 ? (
        <div className={styles.emptyDashboard}>
          <Zap size={32} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>START LOGGING INTERACTIONS</h2>
          <p className={styles.emptyText}>
            Log your first sales conversation to begin surfacing patterns and insights.
          </p>
          <Link to="/interactions" className={styles.emptyBtn}>
            <Plus size={16} />
            LOG YOUR FIRST INTERACTION
          </Link>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <StatsCard
              label="WIN RATE"
              value={`${stats.winRate}%`}
              accent="win"
              icon={<TrendingUp size={18} />}
              trend={stats.recentTrend}
            />
            <StatsCard
              label="TOTAL LOGGED"
              value={stats.totalInteractions}
              accent="gold"
              icon={<Activity size={18} />}
              subValue="All time"
            />
            <StatsCard
              label="WINS"
              value={stats.winCount}
              accent="win"
              icon={<CheckCircle2 size={18} />}
            />
            <StatsCard
              label="LOSSES"
              value={stats.lossCount}
              accent="loss"
              icon={<XCircle size={18} />}
            />
            <StatsCard
              label="FOLLOW-UPS"
              value={stats.followUpCount}
              accent="followup"
              icon={<Clock size={18} />}
            />
          </div>

          {/* Intel summary */}
          <div className={styles.intelGrid}>
            <div className={styles.intelCard}>
              <div className={styles.intelLabel}>
                <Zap size={12} />
                MOST COMMON OBJECTION
              </div>
              <p className={styles.intelValue}>"{stats.mostCommonObjection}"</p>
            </div>
            <div className={styles.intelCard}>
              <div className={styles.intelLabel}>
                <TrendingUp size={12} />
                BEST PERFORMING RESPONSE
              </div>
              <p className={styles.intelValue}>{stats.bestResponse}</p>
            </div>
          </div>

          {/* Recent interactions */}
          {recentInteractions.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>RECENT INTERACTIONS</h2>
                <Link to="/interactions" className={styles.sectionLink}>
                  View all
                  <ChevronRight size={14} />
                </Link>
              </div>
              <div className={styles.recentList}>
                {recentInteractions.map((i) => (
                  <div key={i.id} className={styles.recentRow}>
                    <span className={`${styles.recentBadge} ${styles[`badge_${i.outcome.replace('-', '')}`]}`}>
                      {i.outcome.toUpperCase()}
                    </span>
                    <p className={styles.recentObjection}>"{i.objection}"</p>
                    <p className={styles.recentResponse}>{i.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
