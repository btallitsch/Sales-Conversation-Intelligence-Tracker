import { useState } from 'react';
import { format } from 'date-fns';
import type { Interaction, InteractionInput } from '../../types';
import InteractionForm from './InteractionForm';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Interactions.module.css';

interface Props {
  interaction: Interaction;
  onEdit: (id: string, updates: Partial<InteractionInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const outcomeConfig = {
  win: { label: 'WIN', className: styles.badgeWin },
  loss: { label: 'LOSS', className: styles.badgeLoss },
  'follow-up': { label: 'FOLLOW-UP', className: styles.badgeFollowup },
  pending: { label: 'PENDING', className: styles.badgePending },
};

export default function InteractionCard({ interaction, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const config = outcomeConfig[interaction.outcome];

  async function handleEdit(input: InteractionInput) {
    await onEdit(interaction.id, input);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await onDelete(interaction.id);
  }

  if (editing) {
    return (
      <div className={`${styles.card} ${styles.cardEditing}`}>
        <div className={styles.editHeader}>
          <span className={styles.editLabel}>EDITING INTERACTION</span>
        </div>
        <InteractionForm
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
          initialData={interaction}
          submitLabel="SAVE CHANGES"
        />
      </div>
    );
  }

  return (
    <div className={`${styles.card} animate-in`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={`${styles.badge} ${config.className}`}>
            {config.label}
          </span>
          <span className={styles.cardDate}>
            {format(interaction.createdAt, 'MMM d, yyyy · HH:mm')}
          </span>
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.iconBtn}
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            className={`${styles.iconBtn} ${confirmDelete ? styles.iconBtnDanger : ''}`}
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          >
            <Trash2 size={14} />
            {confirmDelete && <span className={styles.confirmText}>CONFIRM?</span>}
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.objectionSection}>
          <span className={styles.sectionTag}>OBJECTION</span>
          <p className={styles.objectionText}>"{interaction.objection}"</p>
        </div>

        <div className={styles.dividerLine} />

        <div className={styles.responseSection}>
          <span className={styles.sectionTag}>RESPONSE</span>
          <p className={styles.responseText}>{interaction.response}</p>
        </div>

        {interaction.notes && (
          <>
            <button
              className={styles.expandBtn}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              <span>{expanded ? 'Hide notes' : 'Show notes'}</span>
            </button>
            {expanded && (
              <div className={styles.notesSection}>
                <span className={styles.sectionTag}>NOTES</span>
                <p className={styles.notesText}>{interaction.notes}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
