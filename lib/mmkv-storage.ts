import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({ id: 'monsterwrite-store' });

export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
