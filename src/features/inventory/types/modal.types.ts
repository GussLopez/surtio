import { Product } from "@/shared/types";

export type ModalState =
  | { type: "edit"; product: Product }
  | { type: "view"; product: Product }
  | { type: "delete"; product: Product }
  | { type: "adjust"; product: Product }
  | null;