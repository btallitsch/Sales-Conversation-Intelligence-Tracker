import { useState, useEffect, useCallback } from 'react';
import {
  getUserInteractions,
  createInteraction,
  updateInteraction,
  deleteInteraction,
} from '../lib/firestore';
import type { Interaction, InteractionInput } from '../types';

export function useInteractions(userId: string | undefined) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInteractions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserInteractions(userId);
      setInteractions(data);
    } catch (err) {
      setError('Failed to load interactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  async function addInteraction(input: InteractionInput) {
    if (!userId) return;
    setError(null);
    try {
      await createInteraction(userId, input);
      await fetchInteractions();
    } catch (err) {
      setError('Failed to save interaction.');
      throw err;
    }
  }

  async function editInteraction(id: string, updates: Partial<InteractionInput>) {
    setError(null);
    try {
      await updateInteraction(id, updates);
      await fetchInteractions();
    } catch (err) {
      setError('Failed to update interaction.');
      throw err;
    }
  }

  async function removeInteraction(id: string) {
    setError(null);
    try {
      await deleteInteraction(id);
      setInteractions((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError('Failed to delete interaction.');
      throw err;
    }
  }

  return {
    interactions,
    loading,
    error,
    addInteraction,
    editInteraction,
    removeInteraction,
    refresh: fetchInteractions,
  };
}
