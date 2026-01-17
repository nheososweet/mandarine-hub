import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// Import ClickSpark hoặc Background Effects nếu muốn App cũng lung linh như Landing
import Squares from "@/components/Squares";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Particles from "@/components/Particles";
import { AppHeader } from "@/components/AppHeader";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 bg-background text-foreground flex w-full">
        <AppSidebar />

        <SidebarInset className="bg-background flex flex-col flex-1 h-full overflow-hidden relative">
          {/* Background chung cho App (nhẹ nhàng hơn Landing) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
            <Particles
              particleColors={["#ffffff", "#ffaa40"]}
              particleCount={200}
              particleSpread={10}
              speed={0.2}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={true}
            />
          </div>

          {/* Dynamic App Header */}
          <AppHeader />

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden relative z-10 scrollbar-thin scrollbar-thumb-zinc-800">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
