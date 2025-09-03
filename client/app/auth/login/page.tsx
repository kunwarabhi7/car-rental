"use client";

import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import PublicRoute from "@/components/PublicRoute";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const {
    formData,
    errors,
    isPending,
    handleChange,
    handleLogin,
    handleGoogleAuth,
  } = useAuth(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 
      dark:from-gray-900 dark:via-gray-800 dark:to-black px-4"
    >
      <Card
        className="w-full max-w-md p-8 shadow-2xl rounded-2xl 
        bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl animate-fade-in"
      >
        <CardHeader>
          <CardTitle
            className="text-3xl font-bold text-center tracking-tight 
            bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
          >
            Sign In
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Identifier */}
            <div>
              <Label htmlFor="identifier" className="text-sm font-medium">
                Username or Email
              </Label>
              <Input
                id="identifier"
                name="identifier"
                value={formData.identifier || ""}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className="mt-2 rounded-lg border-gray-300 dark:border-gray-700 
                  dark:bg-gray-800/50 dark:text-white focus:ring-2 
                  focus:ring-orange-500 transition-all duration-200"
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {errors.identifier as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-2 rounded-lg border-gray-300 dark:border-gray-700 
                  dark:bg-gray-800/50 dark:text-white focus:ring-2 
                  focus:ring-orange-500 transition-all duration-200"
              />
              {errors.password && (
                <p className="error-text">{errors.password as string}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 
                dark:bg-orange-500 dark:hover:bg-orange-600 
                text-white rounded-lg py-2 font-medium 
                transition-all duration-200 hover:scale-[1.02]"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Sign In"}
            </Button>

            {errors.submit && (
              <p className="error-text">{errors.submit as string}</p>
            )}
          </form>

          {/* OR divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="mx-3 text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Google button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 
              border-gray-400 dark:border-gray-600 rounded-lg 
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
            }
          >
            <FcGoogle className="text-xl" /> Login with Google
          </Button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-[var(--foreground)]">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="link">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
