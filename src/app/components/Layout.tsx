import { useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router";
import {
  TreePine,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Award,
  Settings,
  LogOut,
  Menu,
  User,
  Volume2,
  Loader2,
  CreditCard,
  ShieldCheck,
  Users,
  FileText,
  Sun,
  Moon,
  Film,
  ClipboardCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { OnboardingGuide, HelpAssistant } from "./OnboardingGuide";
import { useAuth } from "./AuthContext";
import { SessionMonitor, LegalFooter, SecurityBadge } from "./SecurityBadge";
import { hasPermission, canAccessRoute, getAccessTier } from "./security";
import { ROLE_LABELS } from "./data";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "modules:read" as const },
  { to: "/modules", label: "Training Modules", icon: BookOpen, permission: "modules:read" as const },
  { to: "/certificates", label: "Certificates", icon: Award, permission: "certificates:generate" as const },
  { to: "/licensing", label: "Licensing", icon: CreditCard, permission: "security:manage" as const },
  { to: "/instructor", label: "Instructor View", icon: Users, permission: "reports:view" as const },
  { to: "/admin", label: "Admin Analytics", icon: BarChart3, permission: "admin:dashboard" as const },
  { to: "/admin/users", label: "User Management", icon: Users, permission: "admin:users" as const },
  { to: "/admin/audit", label: "Audit Log", icon: FileText, permission: "admin:audit" as const },
  { to: "/admin/agencies", label: "Agency Management", icon: BarChart3, permission: "admin:users" as const },
  { to: "/admin/videos", label: "Video Registry", icon: Film, permission: "admin:users" as const },
  { to: "/admin/review", label: "Content Review", icon: ClipboardCheck, permission: "security:manage" as const },
];

// Brand 5Rs colors
const fiveRsColors: Record<string, string> = {
  Root: "#0D3B22",
  Regulate: "#1C4D36",
  Reflect: "#1E3A5F",
  Restore: "#5C3200",
  Reconnect: "#3A1550",
};

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, user, loading, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainHeadingRef = useRef<HTMLDivElement>(null);

  // WCAG 2.1 SC 2.4.3 — move focus to main content area on every route change
  useEffect(() => {
    mainHeadingRef.current?.focus();
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C9A84C" }} />
      </div>
    );
  }

  const displayName = profile?.name || user?.user_metadata?.name || "Learner";
  const displayRole = profile?.role || "cpi";
  const userTier = getAccessTier(displayRole);

  // Filter nav items by RBAC permissions
  const visibleNavItems = navItems.filter((item) =>
    hasPermission(displayRole, item.permission)
  );

  return (
    <div className="h-screen flex overflow-hidden">
      {/* WCAG 2.1 SC 2.4.1 — skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-semibold focus:bg-background focus:text-foreground focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A84C]"
      >
        Skip to main content
      </a>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSidebarOpen(false); }}
        />
      )}

      {/* Sidebar — Evergreen + Gold Brand */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: "1px solid rgba(201,168,76,0.3)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
              <TreePine className="w-5 h-5" style={{ color: "#C9A84C" }} />
            </div>
            <div>
              <h3 className="text-sm" style={{ color: "#C9A84C", fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "0.06em" }}>RootWork</h3>
              <p className="text-xs" style={{ color: "rgba(242,244,202,0.5)" }}>Training Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation — RBAC filtered */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "text-gold-leaf"
                    : "hover:text-gold-leaf"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? "#C9A84C" : "rgba(242,244,202,0.75)",
                background: isActive ? "rgba(201,168,76,0.08)" : undefined,
                borderLeft: isActive ? "3px solid #C9A84C" : "3px solid transparent",
              })}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 5Rs Reference */}
        <div className="px-3 pb-3">
          <div className="rounded-lg p-3" style={{ background: "rgba(201,168,76,0.06)" }}>
            <p className="text-xs mb-2" style={{ color: "rgba(201,168,76,0.5)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "9px" }}>RootWork 5Rs</p>
            <div className="space-y-1">
              {(["Root", "Regulate", "Reflect", "Restore", "Reconnect"] as const).map((r) => (
                <div key={r} className="flex items-center gap-2 text-xs" style={{ color: "rgba(242,244,202,0.7)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: fiveRsColors[r] || "#C9A84C" }} />
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Access Tier Badge */}
        <div className="px-3 pb-3">
          <div className="rounded-lg p-3" style={{ background: "rgba(201,168,76,0.06)" }}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.5)" }} />
              <p className="text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>Security</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  background: userTier === "admin" || userTier === "superadmin"
                    ? "rgba(201,168,76,0.15)"
                    : "rgba(13,59,34,0.15)",
                  color: userTier === "admin" || userTier === "superadmin"
                    ? "#C9A84C"
                    : "rgba(242,244,202,0.6)",
                }}
              >
                {userTier}
              </div>
              <span className="text-[9px]" style={{ color: "rgba(242,244,202,0.35)" }}>
                CJIS Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="px-3 pb-3">
          <div className="rounded-lg p-3" style={{ background: "rgba(201,168,76,0.06)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.5)" }} />
              <p className="text-xs" style={{ color: "rgba(201,168,76,0.5)" }}>Audio Support</p>
            </div>
            <p className="text-[10px]" style={{ color: "rgba(242,244,202,0.4)" }}>
              Look for the speaker icon to listen to any content using text-to-speech
            </p>
          </div>
        </div>

        {/* User */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
              <User className="w-4 h-4" style={{ color: "#C9A84C" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: "#C9A84C" }}>{displayName}</p>
              <p className="text-xs truncate" style={{ color: "rgba(242,244,202,0.5)" }}>{ROLE_LABELS[displayRole] || displayRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="transition-colors"
              style={{ color: "rgba(242,244,202,0.4)" }}
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <SecurityBadge compact />
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
            }
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </NavLink>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto" ref={mainHeadingRef} tabIndex={-1} style={{ outline: "none" }}>
          <Outlet />
        </main>

        {/* Compact footer for inner pages */}
        <div className="bg-card border-t border-border">
          <LegalFooter variant="compact" />
        </div>
      </div>

      <OnboardingGuide />
      <HelpAssistant />

      {/* CJIS 5.5.5: Session inactivity monitor */}
      <SessionMonitor />
    </div>
  );
}