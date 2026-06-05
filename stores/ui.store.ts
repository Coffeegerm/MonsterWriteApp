import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  toasts: Toast[];
  activeModal: string | null;
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  openModal: (name: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  toasts: [],
  activeModal: null,
  showToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}));
