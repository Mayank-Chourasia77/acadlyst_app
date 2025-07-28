
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import Lectures from "./pages/Lectures";
import Placement from "./pages/Placement";
import Groups from "./pages/Groups";
import About from "./pages/About";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import AiChat from "./pages/AiChat";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Auth } from "./components/Auth";
import { Navigation } from "./components/Navigation";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import SupportUs from "./pages/SupportUs";

const queryClient = new QueryClient();

const AppLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPublicProfileView = location.pathname === '/profile' && searchParams.has('username');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user && !isPublicProfileView) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navigation />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route element={<AppLayout />}>
              <Route path="/notes" element={<Notes />} />
              <Route path="/lectures" element={<Lectures />} />
              <Route path="/placement" element={<Placement />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/about" element={<About />} />
              <Route path="/support-us" element={<SupportUs />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai-chat" element={<AiChat />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
