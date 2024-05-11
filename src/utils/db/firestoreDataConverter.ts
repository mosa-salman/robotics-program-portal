import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export function createConverter<T>(): FirestoreDataConverter<T, DocumentData> {
    return {
        toFirestore(data: T): DocumentData {
            return { ...(data as DocumentData) };
        },

        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options: SnapshotOptions
        ): T {
            const data = snapshot.data(options)!;
            return { ...data } as T;
        }
    };
}