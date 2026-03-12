import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Interaction, InteractionInput } from '../types';

const COLLECTION = 'interactions';

function docToInteraction(id: string, data: Record<string, unknown>): Interaction {
  return {
    id,
    userId: data.userId as string,
    objection: data.objection as string,
    response: data.response as string,
    outcome: data.outcome as Interaction['outcome'],
    notes: data.notes as string | undefined,
    tags: data.tags as string[] | undefined,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export async function createInteraction(
  userId: string,
  input: InteractionInput
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserInteractions(userId: string): Promise<Interaction[]> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  const interactions = snapshot.docs.map((d) =>
    docToInteraction(d.id, d.data() as Record<string, unknown>)
  );
  // Sort client-side: avoids needing a composite Firestore index on (userId + createdAt)
  return interactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateInteraction(
  interactionId: string,
  updates: Partial<InteractionInput>
): Promise<void> {
  const ref = doc(db, COLLECTION, interactionId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteInteraction(interactionId: string): Promise<void> {
  const ref = doc(db, COLLECTION, interactionId);
  await deleteDoc(ref);
}
