import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInteractions } from '../hooks/useInteractions';
import InteractionForm from '../components/interactions/InteractionForm';
import InteractionList from '../components/interactions/InteractionList';
import { Plus, X } from 'lucide-react';
import styles from './Pages.module.css';

export default function InteractionsPage() {
  const { user } = useAuth();
  const { interactions, loading, error, addInteraction, editInteraction, removeInteraction } =
    useInteractions(user?.uid);
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(input: Parameters<typeof addInteraction>[0]) {
    await addInteraction(input);
    setShowForm(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>INTERACTIONS</h1>
          <p className={styles.pageSubtitle}>
            {interactions.length} conversation{interactions.length !== 1 ? 's' : ''} logged
          </p>
        </div>
        <button
          className={`${styles.ctaBtn} ${showForm ? styles.ctaBtnDanger : ''}`}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <>
              <X size={16} />
              CANCEL
            </>
          ) : (
            <>
              <Plus size={16} />
              LOG INTERACTION
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <span className={styles.formCardTitle}>NEW INTERACTION</span>
          </div>
          <div className={styles.formCardBody}>
            <InteractionForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}>Loading interactions...</div>
      ) : (
        <InteractionList
          interactions={interactions}
          onEdit={editInteraction}
          onDelete={removeInteraction}
        />
      )}
    </div>
  );
}
