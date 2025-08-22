"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignupPage() {
  // State for form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthMessage, setStrengthMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Password validation criteria
  const validatePassword = (password) => {
    const criteria = [
      { test: (pwd) => pwd.length >= 6, message: "At least 6 characters" },
      {
        test: (pwd) => /[A-Z]/.test(pwd),
        message: "At least one uppercase letter (A-Z)",
      },
      {
        test: (pwd) => /[a-z]/.test(pwd),
        message: "At least one lowercase letter (a-z)",
      },
      {
        test: (pwd) => /[0-9]/.test(pwd),
        message: "At least one number (0-9)",
      },
      {
        test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        message: "At least one special character (@, #, etc.)",
      },
    ];

    const passedCriteria = criteria.filter((criterion) =>
      criterion.test(password)
    ).length;
    const strength = (passedCriteria / criteria.length) * 100;

    // Determine strength message
    let message = "";
    if (passedCriteria === criteria.length) {
      message = "Strong password";
    } else if (passedCriteria >= 3) {
      message = "Moderate password";
    } else {
      message = "Weak password";
    }

    // Collect unmet criteria for feedback
    const unmetCriteria = criteria
      .filter((criterion) => !criterion.test(password))
      .map((criterion) => criterion.message);

    return { strength, message, unmetCriteria };
  };

  // Update password strength whenever password changes
  useEffect(() => {
    const { strength, message, unmetCriteria } = validatePassword(
      formData.password
    );
    setPasswordStrength(strength);
    setStrengthMessage(message);
    setErrors((prev) => ({ ...prev, password: unmetCriteria }));
  }, [formData.password]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic validation
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = ["Password is required"];
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (passwordStrength < 100) {
      newErrors.password = errors.password || [
        "Password does not meet all requirements",
      ];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with signup (e.g., API call)
    try {
      console.log("Form data:", formData);
      // Example: await fetch('/api/signup', { method: 'POST', body: JSON.stringify(formData) });
      alert("Signup successful! (Placeholder)");
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Signup failed. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {/* Password Strength Indicator */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    passwordStrength === 100
                      ? "bg-green-500"
                      : passwordStrength >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">
                {strengthMessage || "Enter a password to check strength"}
              </p>
              {errors.password && errors.password.length > 0 && (
                <ul className="text-red-500 text-sm mt-1 list-disc list-inside">
                  {errors.password.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
          {errors.submit && (
            <p className="text-red-500 text-sm mt-2">{errors.submit}</p>
          )}
        </form>

        {/* Link to Login */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
