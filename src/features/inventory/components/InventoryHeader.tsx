import { Tabs, TabsList, TabsTrigger } from "@/shared/components/animate-ui/components/animate/tabs";
import AddProduct from "@/features/inventory/components/AddProduct";
import { ListDashesIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { Box } from "lucide-react";

interface HeaderProps {
  view: string;
  handleChange: (value: string) => void;
}

export default function InventoryHeader({ view, handleChange }: HeaderProps) {

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between">
      <div className="flex items-center gap-3">
        <Box size={30} />
        <h1 className="text-3xl font-semibold">Inventario</h1>
      </div>
      <div className="flex items-center gap-4">
        <Tabs value={view} onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="table">
              <ListDashesIcon />
              Tabla
            </TabsTrigger>
            <TabsTrigger value="card">
              <SquaresFourIcon />
              Tarjetas
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <AddProduct />
      </div>
    </div>
  )
}
