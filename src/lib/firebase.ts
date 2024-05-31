import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_MEASUREMENT_ID, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET, PUBLIC_MODE } from "$env/static/public";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { collection, connectFirestoreEmulator, doc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";
import type { UserData, UserItem } from "./customtypes";

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

interface ItemWithUpdatedAt {
    updatedAt: Date;
}

// use emulators on dev
if (PUBLIC_MODE == "dev") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

// TODO there is an unsubscribing error when signing out

/**
 * @returns a store with the current firebase user
 */
function userStore() {
    let unsubscribe: () => void;
    // if auth object isn't here or if we are on the server
    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe,
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        });

        return () => unsubscribe();
    })

    return {
        subscribe
    };
}

export const user = userStore();

/**
 * @param  {string} path document path or reference
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(path: string) {
    let unsubscribe: () => void;

    const docRef = doc(db, path);

    // listening for new documents with the uid of the current signed in user
    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });

        return () => unsubscribe;
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id
    }
}

// derived store from $user
export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
});

/**
 * @param  {string} firebase user id
 * @returns a store with realtime updates on items data
 */
export function itemsStore<T extends ItemWithUpdatedAt>(uid: string) {
    let unsubscribe: () => void;

    const collectionRef = collection(db, 'items');
    const q = query(collectionRef, where('uid', '==', uid));

    const { subscribe } = writable<{ id: string, data: T }[] | null>(null, (set) => {
        unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() as T }));
            set(items);
        });

        return () => unsubscribe;
    })

    return {
        subscribe,
    };
}

// derived store form $user to get all items associated with $user
export const userItems: Readable<{ id: string, data: UserItem }[] | null> = derived(user, ($user, set) => {
    if ($user) {
        return itemsStore<UserItem>($user.uid).subscribe(set);
    } else {
        set(null);
    }
})