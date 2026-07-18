import { Menu } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

export default function MobileNavMenu() {

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="p-2 border border-input rounded-md">
          <Menu className="size-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Links de la aplicación</DrawerTitle>
        </DrawerHeader>
        hi
      </DrawerContent>
    </Drawer>
  )
}
