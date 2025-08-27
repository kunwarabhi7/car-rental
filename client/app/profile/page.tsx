"use client";

import { useAuth } from "@/lib/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Profile() {
  const { user, userLoading, userError, logout, fetchCurrentUser } = useAuth();
  console.log("User data:", user);
  // Debugging: Log errors
  useEffect(() => {
    if (userError) {
      console.error("User fetch error:", userError.message);
      toast.error(`Failed to load profile: ${userError.message}`, {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
    }
  }, [userError]);

  // Trigger fetchCurrentUser if no user and token exists
  useEffect(() => {
    if (!user && !userLoading && localStorage.getItem("token")) {
      fetchCurrentUser();
    }
  }, [user, userLoading, fetchCurrentUser]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (userError || !user) {
    const errorMessage =
      userError?.message || "Please log in to view your profile";
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <Card className="p-6 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl animate-fade-in">
          <p className="text-lg font-medium text-red-500">{errorMessage}</p>
          <Button
            variant="outline"
            className="mt-4 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={() => (window.location.href = "/auth/login")}
          >
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      <Card className="w-full max-w-md p-8 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl animate-fade-in">
        <CardHeader>
          <div className="flex flex-col items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-blue-600 dark:border-orange-500 rounded-full shadow-lg">
              <AvatarImage src={user.profilePic} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold text-2xl">
                {user.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                {user.username}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {user.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300 capitalize font-medium mt-1">
                {user.role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
            onClick={logout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
