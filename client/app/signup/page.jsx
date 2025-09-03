"use client";

import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import PublicRoute from "@/components/PublicRoute";
export default function Register() {
  const {
    formData,
    passwordStrength,
    strengthMessage,
    errors,
    handleChange,
    handleSignup,
  } = useAuth(true);

  return (
    <PublicRoute>
      <div className="gradient-bg">
        <div className="card-glass p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-[var(--foreground)] animate-fade-in">
            Sign Up
          </h2>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
              />
              <div className="mt-2">
                <div className="strength-bar">
                  <div
                    className={`strength-bar-inner ${
                      passwordStrength === 100
                        ? "strength-strong"
                        : passwordStrength >= 60
                        ? "strength-moderate"
                        : "strength-weak"
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1 text-[var(--foreground)]">
                  {strengthMessage || "Enter a password to check strength"}
                </p>
                {errors.password &&
                  Array.isArray(errors.password) &&
                  errors.password.length > 0 && (
                    <ul className="error-text list-disc list-inside">
                      {errors.password.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="button-primary">
              Sign Up
            </button>
            {errors.submit && <p className="error-text">{errors.submit}</p>}

            {/* Link to Login */}
            <p className="mt-4 text-center text-sm text-[var(--foreground)]">
              Already have an account?{" "}
              <Link href="/auth/login" className="link">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PublicRoute>
  );
}
