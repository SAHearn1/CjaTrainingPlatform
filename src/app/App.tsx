import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { router } from "./routes";
import { AuthProvider } from "./components/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

function RouteLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<RouteLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}