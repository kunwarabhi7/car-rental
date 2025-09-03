"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const {
    user,
    userLoading,
    userError,
    logout,
    updateFormData,
    updateErrors,
    isUpdatePending,
    handleUpdateChange,
    updateProfile,
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <Card className="p-6 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl animate-fade-in">
          <p className="text-lg font-medium text-red-500">
            {userError?.message || "Please log in to view your profile"}
          </p>
          <Button
            variant="outline"
            className="mt-4 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={() => router.push("/auth/login")}
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
            <Avatar
              className="w-24 h-24 border-4 border-blue-600 dark:border-orange-500 rounded-full shadow-lg"
              key={user.profilePic}
            >
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
        <CardContent className="space-y-4">
          {isEditing ? (
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={updateFormData.username}
                  onChange={handleUpdateChange}
                  className="mt-1 border-gray-300 dark:border-gray-600"
                  disabled={isUpdatePending}
                />
                {updateErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.username}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={updateFormData.email}
                  onChange={handleUpdateChange}
                  className="mt-1 border-gray-300 dark:border-gray-600"
                  disabled={isUpdatePending}
                />
                {updateErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateErrors.email}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="profilePic"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Profile Picture URL
                </Label>
                <Input
                  id="profilePic"
                  name="profilePic"
                  value={updateFormData.profilePic}
                  onChange={handleUpdateChange}
                  className="mt-1 border-gray-300 dark:border-gray-600"
                  disabled={isUpdatePending}
                />
              </div>
              {updateErrors.submit && (
                <p className="text-red-500 text-sm">{updateErrors.submit}</p>
              )}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
                  disabled={isUpdatePending}
                >
                  {isUpdatePending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
