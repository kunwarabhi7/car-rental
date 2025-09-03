import { useAuth } from "@/lib/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, userError, userLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!userLoading && !user && !userError) {
      router.push("/login");
    }
  }, [user, userLoading, userError, router]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user && userError) {
    return null;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
