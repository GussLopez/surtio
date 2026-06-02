import { Product } from "@/shared/types";
import { useState } from "react";
import { ModalState } from "../types/modal.types";

export function useInventoryModals() {
  const [modal, setModal] = useState<ModalState>(null);

  return {
    modal,

    openEdit: (product: Product) => setModal({ type: "edit", product }),

    openView: (product: Product) => setModal({ type: "view", product }),

    openDelete: (product: Product) => setModal({ type: "delete", product }),

    openAdjust: (product: Product) => setModal({ type: "adjust", product }),

    closeModal: () => setModal(null),
  };
}
