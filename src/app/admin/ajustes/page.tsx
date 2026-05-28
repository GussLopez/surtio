import MyProfile from "@/features/settings/components/MyProfile";
import MyStore from "@/features/settings/components/MyStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Receipt, Route, Settings2, SquareUserRound, Store } from "lucide-react";

export default function AjustesPage() {
  const tabsList = [
    { value: 'store', name: 'Mi tienda', icon: Store },
    { value: 'profile', name: 'Perfil', icon: SquareUserRound },
    { value: 'password', name: 'Seguridad', icon: Lock },
    { value: 'billing', name: 'Facturación', icon: Receipt },
    { value: 'plan', name: 'Plan', icon: Route },
  ]
  return (
    <div>
      <div className="flex items-center gap-3">
        <Settings2 size={30} />
        <h1 className="text-3xl font-semibold">Ajustes</h1>
      </div>

      <Tabs className="gap-4 mt-5" defaultValue="store">
        <TabsList className="bg-muted rounded-none border-b p-0 w-full">
          {tabsList.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="bg-muted py-4.5 data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none!"
            >
              <item.icon />
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="store">
          <MyStore />
        </TabsContent>
        <TabsContent value="profile">
          <MyProfile />
        </TabsContent>
        <TabsContent value="password">
          <div>Content3</div>
        </TabsContent>
        <TabsContent value="billing">
          <div>Content4</div>
        </TabsContent>
        <TabsContent value="plan">
          <div>Content5</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
