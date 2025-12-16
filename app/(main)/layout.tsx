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

          {/* Header Mobile Trigger */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 bg-background/80 backdrop-blur-md z-10 sticky top-0">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              Dashboard Console
            </span>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden relative z-10 scrollbar-thin scrollbar-thumb-zinc-800">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
