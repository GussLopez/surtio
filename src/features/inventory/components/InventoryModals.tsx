import EditProductModal from "./EditProductModal";
import ViewProductModal from "./ViewPrductModal";
import { DeleteProduct } from "./DeleteProduct";
import AdjustStock from "./AdjustStock";
import { ModalState } from "../types/modal.types";


interface InventoryModalsProps {
  modal: ModalState;
  onClose: () => void;
}

export default function InventoryModals({
  modal,
  onClose
}: InventoryModalsProps) {
  if (!modal) return null;

  switch (modal.type) {
    case "edit":
      return (
        <EditProductModal
          open
          product={modal.product}
          onClose={onClose}
        />
      );

    case "view":
      return (
        <ViewProductModal
          open
          product={modal.product}
          onClose={onClose}
        />
      );

    case "delete":
      return (
        <DeleteProduct
          open
          productId={modal.product.id}
          onClose={onClose}
        />
      );

    case "adjust":
      return (
        <AdjustStock
          open
          product={modal.product}
          onClose={onClose}
        />
      );

    default:
      return null;
  }
}