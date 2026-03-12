import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInteractions } from '../hooks/useInteractions';
import { analyzePatterns, getObjectionKeywords } from '../utils/patterns';
import PatternCard from '../components/insights/PatternCard';
import { Brain, Plus } from 'lucide-react';
import styles from './Pages.module.css';

export default function InsightsPage() {
  const { user } = useAuth();
  const { interactions, loading } = useInteractions(user?.uid);

  const patterns = useMemo(() => analyzePatterns(interactions), [interactions]);
  const keywords = useMemo(() => getObjectionKeywords(interactions), [interactions]);

  const maxKeywordCount = keywords[0]?.count ?? 1;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>PATTERNS</h1>
          <p className={styles.pageSubtitle}>
            Intelligence derived from {interactions.length} logged interaction
            {interactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Analyzing patterns...</div>
      ) : patterns.length === 0 ? (
        <div className={styles.emptyDashboard}>
          <Brain size={32} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>NO PATTERNS YET</h2>
          <p className={styles.emptyText}>
            Log at least a few interactions to start seeing patterns and insights emerge.
          </p>
          <Link to="/interactions" className={styles.emptyBtn}>
            <Plus size={16} />
            LOG AN INTERACTION
          </Link>
        </div>
      ) : (
        <div className={styles.insightsLayout}>
          <div className={styles.patternsSection}>
            <h2 className={styles.sectionTitle}>OBJECTION PATTERNS</h2>
            <p className={styles.sectionDescription}>
              Ranked by frequency. Expand each to see which responses win most.
            </p>
            <div className={styles.patternsList}>
              {patterns.map((pattern, i) => (
                <PatternCard key={pattern.objection} pattern={pattern} rank={i} />
              ))}
            </div>
          </div>

          {keywords.length > 0 && (
            <div className={styles.keywordsSection}>
              <h2 className={styles.sectionTitle}>OBJECTION KEYWORDS</h2>
              <p className={styles.sectionDescription}>Most frequent words in objections</p>
              <div className={styles.keywordList}>
                {keywords.map(({ word, count }) => (
                  <div key={word} className={styles.keywordRow}>
                    <span className={styles.keywordWord}>{word}</span>
                    <div className={styles.keywordBar}>
                      <div
                        className={styles.keywordBarFill}
                        style={{ width: `${(count / maxKeywordCount) * 100}%` }}
                      />
                    </div>
                    <span className={styles.keywordCount}>{count}</span>
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
