import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/ProjectsPage";
import ModelsPage from "./pages/ModelsPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import ServicesPage from "./pages/ServicesPage";
import CreateServicePage from "./pages/CreateServicePage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import FineTunePage from "./pages/FineTunePage";
import DatasetsPage from "./pages/DatasetsPage";
import EvaluationPage from "./pages/EvaluationPage";
import UsagePage from "./pages/UsagePage";
import QuotaAlertsPage from "./pages/QuotaAlertsPage";
import AuditPage from "./pages/AuditPage";
import MembersPage from "./pages/MembersPage";
import PlatformPlaceholder from "./pages/PlatformPlaceholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/projects" element={<AppLayout><ProjectsPage /></AppLayout>} />
            <Route path="/models" element={<AppLayout><ModelsPage /></AppLayout>} />
            <Route path="/models/:id" element={<AppLayout><ModelDetailPage /></AppLayout>} />
            <Route path="/datasets" element={<AppLayout><DatasetsPage /></AppLayout>} />
            <Route path="/services" element={<AppLayout><ServicesPage /></AppLayout>} />
            <Route path="/services/create" element={<AppLayout><CreateServicePage /></AppLayout>} />
            <Route path="/services/:id" element={<AppLayout><ServiceDetailPage /></AppLayout>} />
            <Route path="/finetune" element={<AppLayout><FineTunePage /></AppLayout>} />
            <Route path="/evaluation" element={<AppLayout><EvaluationPage /></AppLayout>} />
            <Route path="/api-keys" element={<AppLayout><ApiKeysPage /></AppLayout>} />
            <Route path="/usage" element={<AppLayout><UsagePage /></AppLayout>} />
            <Route path="/quota" element={<AppLayout><QuotaAlertsPage /></AppLayout>} />
            <Route path="/alerts" element={<AppLayout><QuotaAlertsPage /></AppLayout>} />
            <Route path="/members" element={<AppLayout><MembersPage /></AppLayout>} />
            <Route path="/audit" element={<AppLayout><AuditPage /></AppLayout>} />
            <Route path="/platform/models" element={<AppLayout><PlatformPlaceholder title="系统模型管理" /></AppLayout>} />
            <Route path="/platform/resources" element={<AppLayout><PlatformPlaceholder title="GPU 资源池" /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
