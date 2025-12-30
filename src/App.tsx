import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/ui/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThemeInitializer from "@/components/ThemeInitializer";
import Notifications from "./pages/Notifications";
import WritingAssistant from "./pages/ai/WritingAssistant";
import GrammarCheck from "./pages/ai/GrammarCheck";
import AllAITools from "./pages/ai/AllTools";
import Settings from "./pages/Settings";
import UsageAnalytics from "./pages/UsageAnalytics";
import HelpSupport from "./pages/HelpSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInitializer />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Index />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ai/all-tools" element={<AllAITools />} />
          <Route path="/ai/writing-assistant" element={<WritingAssistant />} />
          <Route path="/ai/grammar-check" element={<GrammarCheck />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<UsageAnalytics />} />
          <Route path="/help" element={<HelpSupport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
