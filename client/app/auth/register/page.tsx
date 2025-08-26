"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const {
    formData,
    passwordStrength,
    strengthMessage,
    errors,
    isPending,
    handleChange,
    handleSignup,
  } = useAuth(true);

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
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                placeholder="Enter your username"
                className="mt-2 rounded-lg border-gray-300 dark:border-gray-700 
                  dark:bg-gray-800/50 dark:text-white focus:ring-2 
                  focus:ring-orange-500 transition-all duration-200"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {errors.username as string}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-2 rounded-lg border-gray-300 dark:border-gray-700 
                  dark:bg-gray-800/50 dark:text-white focus:ring-2 
                  focus:ring-orange-500 transition-all duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {errors.email as string}
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
              <div className="mt-3">
                {/* Strength bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      passwordStrength === 100
                        ? "bg-green-500"
                        : passwordStrength >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  {strengthMessage || "Enter a password to check strength"}
                </p>
                {errors.password &&
                  (errors.password as string[]).length > 0 && (
                    <ul className="text-red-500 text-sm mt-2 list-disc list-inside">
                      {(errors.password as string[]).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="mt-2 rounded-lg border-gray-300 dark:border-gray-700 
                  dark:bg-gray-800/50 dark:text-white focus:ring-2 
                  focus:ring-orange-500 transition-all duration-200"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                  {errors.confirmPassword as string}
                </p>
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
              {isPending ? "Registering..." : "Sign Up"}
            </Button>

            {errors.submit && (
              <p className="text-red-500 text-sm mt-2 animate-fade-in">
                {errors.submit as string}
              </p>
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
            <FcGoogle className="text-xl" /> Sign Up with Google
          </Button>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-700 dark:text-orange-400 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
