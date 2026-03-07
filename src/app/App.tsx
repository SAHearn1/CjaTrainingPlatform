import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { Loader2 } from "lucide-react";
import { router } from "./routes";
import { AuthProvider } from "./components/AuthContext";

function RouteLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C9A84C" }} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}