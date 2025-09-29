import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Management from "./pages/Management";
import USSDActivation from "./pages/USSDActivation";
import Devices from "./pages/Devices";
import SimCards from "./pages/SimCards";
import Users from "./pages/Users";
import Activation from "./pages/Activation";
import Topup from "./pages/Topup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col w-full">
                <header className="h-14 flex items-center border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
                  <SidebarTrigger className="ml-3" />
                  <div className="ml-4">
                    <h2 className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      USSD Manager
                    </h2>
                  </div>
                </header>
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/ussd-activation" element={<USSDActivation />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/simcards" element={<SimCards />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/activation" element={<Activation />} />
                    <Route path="/topup" element={<Topup />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
