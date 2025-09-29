import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TopNavbar } from "@/components/TopNavbar";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
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
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen w-full">
            <Routes>
              {/* Public routes */}
              <Route element={<PublicRoute />}>
                <Route path="/auth" element={<Auth />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  element={
                    <>
                      <TopNavbar />
                      <Outlet />
                    </>
                  }
                >
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ussd-activation" element={<USSDActivation />} />
                  <Route path="/management" element={<Management />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/simcards" element={<SimCards />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/activation" element={<Activation />} />
                  <Route path="/topup" element={<Topup />} />
                </Route>
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
