import { useState, type FormEvent } from 'react';
import type { InteractionInput, OutcomeType } from '../../types';
import { CheckCircle2, XCircle, Clock, HelpCircle } from 'lucide-react';
import styles from './Interactions.module.css';

interface Props {
  onSubmit: (input: InteractionInput) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<InteractionInput>;
  submitLabel?: string;
}

const outcomes: { value: OutcomeType; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'win', label: 'WIN', icon: CheckCircle2, color: 'var(--win)' },
  { value: 'loss', label: 'LOSS', icon: XCircle, color: 'var(--loss)' },
  { value: 'follow-up', label: 'FOLLOW-UP', icon: Clock, color: 'var(--followup)' },
  { value: 'pending', label: 'PENDING', icon: HelpCircle, color: 'var(--pending)' },
];

export default function InteractionForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'LOG INTERACTION',
}: Props) {
  const [objection, setObjection] = useState(initialData?.objection ?? '');
  const [response, setResponse] = useState(initialData?.response ?? '');
  const [outcome, setOutcome] = useState<OutcomeType>(initialData?.outcome ?? 'pending');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!objection.trim() || !response.trim()) {
      setError('Objection and response are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit({ objection: objection.trim(), response: response.trim(), outcome, notes: notes.trim() || undefined });
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.formError}>{error}</div>}

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          <span className={styles.labelNum}>01</span>
          CUSTOMER OBJECTION
        </label>
        <textarea
          value={objection}
          onChange={(e) => setObjection(e.target.value)}
          placeholder='"The price is too high for our budget right now."'
          rows={3}
          required
        />
        <span className={styles.fieldHint}>What the customer said verbatim or paraphrased</span>
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          <span className={styles.labelNum}>02</span>
          YOUR RESPONSE
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Explained 0% financing over 48 months, brought total cost below competitor..."
          rows={3}
          required
        />
        <span className={styles.fieldHint}>How you handled the objection</span>
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          <span className={styles.labelNum}>03</span>
          OUTCOME
        </label>
        <div className={styles.outcomeGrid}>
          {outcomes.map(({ value, label, icon: Icon, color }) => (
            <button
              key={value}
              type="button"
              className={`${styles.outcomeBtn} ${outcome === value ? styles.outcomeBtnActive : ''}`}
              style={{ '--outcome-color': color } as React.CSSProperties}
              onClick={() => setOutcome(value)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>
          <span className={styles.labelNum}>04</span>
          ADDITIONAL NOTES
          <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Context about the customer, deal size, follow-up date..."
          rows={2}
        />
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            CANCEL
          </button>
        )}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'SAVING...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
