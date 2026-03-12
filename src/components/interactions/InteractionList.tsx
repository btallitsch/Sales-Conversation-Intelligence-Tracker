import type { Interaction, InteractionInput, OutcomeType } from '../../types';
import InteractionCard from './InteractionCard';
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import styles from './InteractionList.module.css';

interface Props {
  interactions: Interaction[];
  onEdit: (id: string, updates: Partial<InteractionInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const filterOptions: { value: OutcomeType | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'win', label: 'WINS' },
  { value: 'loss', label: 'LOSSES' },
  { value: 'follow-up', label: 'FOLLOW-UPS' },
  { value: 'pending', label: 'PENDING' },
];

export default function InteractionList({ interactions, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<OutcomeType | 'all'>('all');

  const filtered = interactions.filter((i) => {
    const matchesFilter = filter === 'all' || i.outcome === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      i.objection.toLowerCase().includes(q) ||
      i.response.toLowerCase().includes(q) ||
      i.notes?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search objections, responses..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={13} className={styles.filterIcon} />
          {filterOptions.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.filterBtn} ${filter === value ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>NO INTERACTIONS FOUND</p>
          <p className={styles.emptySubtitle}>
            {search || filter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Log your first interaction to get started'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          <p className={styles.count}>
            {filtered.length} INTERACTION{filtered.length !== 1 ? 'S' : ''}
          </p>
          {filtered.map((interaction, i) => (
            <div
              key={interaction.id}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <InteractionCard
                interaction={interaction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
