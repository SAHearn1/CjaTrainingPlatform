import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Landing } from "./components/Landing";
import { Layout } from "./components/Layout";
import { RootWrapper } from "./components/RootWrapper";
import { ResetPassword } from "./components/ResetPassword";
import { CertificateVerify } from "./components/CertificateVerify";

// Lazy-loaded route components for code splitting
const Dashboard = lazy(() => import("./components/Dashboard").then(m => ({ default: m.Dashboard })));
const ModuleList = lazy(() => import("./components/ModuleList").then(m => ({ default: m.ModuleList })));
const ModuleDetail = lazy(() => import("./components/ModuleDetail").then(m => ({ default: m.ModuleDetail })));
const Assessment = lazy(() => import("./components/Assessment").then(m => ({ default: m.Assessment })));
const Simulation = lazy(() => import("./components/Simulation").then(m => ({ default: m.Simulation })));
const Certificate = lazy(() => import("./components/Certificate").then(m => ({ default: m.Certificate })));
const AdminDashboard = lazy(() => import("./components/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const Licensing = lazy(() => import("./components/Licensing").then(m => ({ default: m.Licensing })));
const LicensingSuccess = lazy(() => import("./components/LicensingSuccess").then(m => ({ default: m.LicensingSuccess })));
const UserManagement = lazy(() => import("./components/UserManagement").then(m => ({ default: m.UserManagement })));
const AuditLog = lazy(() => import("./components/AuditLog").then(m => ({ default: m.AuditLog })));
const Settings = lazy(() => import("./components/Settings").then(m => ({ default: m.Settings })));
const InstructorDashboard = lazy(() => import("./components/InstructorDashboard").then(m => ({ default: m.InstructorDashboard })));
const AgencyManagement = lazy(() => import("./components/AgencyManagement").then(m => ({ default: m.AgencyManagement })));
const AdminVideos = lazy(() => import("./components/AdminVideos").then(m => ({ default: m.AdminVideos })));

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
        path: "reset-password",
        Component: ResetPassword,
      },
      {
        path: "verify/:certId",
        Component: CertificateVerify,
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
          { path: "settings", Component: Settings },
          { path: "instructor", Component: InstructorDashboard },
          { path: "admin/agencies", Component: AgencyManagement },
          { path: "admin/videos", Component: AdminVideos },
        ],
      },
    ],
  },
]);
