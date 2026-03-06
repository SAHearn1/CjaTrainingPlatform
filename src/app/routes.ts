import { createBrowserRouter } from "react-router";
import { Landing } from "./components/Landing";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { ModuleList } from "./components/ModuleList";
import { ModuleDetail } from "./components/ModuleDetail";
import { Assessment } from "./components/Assessment";
import { Simulation } from "./components/Simulation";
import { Certificate } from "./components/Certificate";
import { AdminDashboard } from "./components/AdminDashboard";
import { Licensing } from "./components/Licensing";
import { LicensingSuccess } from "./components/LicensingSuccess";
import { RootWrapper } from "./components/RootWrapper";
import { UserManagement } from "./components/UserManagement";
import { AuditLog } from "./components/AuditLog";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootWrapper,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        Component: Layout,
        children: [
          { path: "dashboard", Component: Dashboard },
          { path: "modules", Component: ModuleList },
          { path: "modules/:moduleId", Component: ModuleDetail },
          { path: "modules/:moduleId/assessment/:type", Component: Assessment },
          { path: "modules/:moduleId/simulation", Component: Simulation },
          { path: "certificates", Component: Certificate },
          { path: "admin", Component: AdminDashboard },
          { path: "admin/users", Component: UserManagement },
          { path: "admin/audit", Component: AuditLog },
          { path: "licensing", Component: Licensing },
          { path: "licensing/success", Component: LicensingSuccess },
        ],
      },
    ],
  },
]);
