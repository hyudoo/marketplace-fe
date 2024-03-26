import { create } from "zustand";

export type ModalType =
  | "openCrowdSale"
  | "processing"
  | "success"
  | "listProduct"
  | "unlistProduct"
  | "transitHistory";

interface ModalData {
  id?: number;
  title?: String;
  hash?: String;
  render?: () => void;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
