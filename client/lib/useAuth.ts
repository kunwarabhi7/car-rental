"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthResponse, FormData } from "./interface";

export function useAuth(isSignup: boolean = false) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: isSignup ? "" : undefined,
    email: isSignup ? "" : undefined,
    identifier: isSignup ? undefined : "",
    password: "",
    confirmPassword: isSignup ? "" : undefined,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthMessage, setStrengthMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>(
    {}
  );

  const validatePassword = (password: string) => {
    const criteria = [
      {
        test: (pwd: string) => pwd.length >= 6,
        message: "At least 6 characters",
      },
      {
        test: (pwd: string) => /[A-Z]/.test(pwd),
        message: "At least one uppercase letter",
      },
      {
        test: (pwd: string) => /[a-z]/.test(pwd),
        message: "At least one lowercase letter",
      },
      {
        test: (pwd: string) => /[0-9]/.test(pwd),
        message: "At least one number",
      },
      {
        test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        message: "At least one special character",
      },
    ];

    const passedCriteria = criteria.filter((criterion) =>
      criterion.test(password)
    ).length;
    const strength = (passedCriteria / criteria.length) * 100;
    let message = "";
    if (passedCriteria === criteria.length) {
      message = "Strong";
    } else if (passedCriteria >= 3) {
      message = "Moderate";
    } else {
      message = "Weak";
    }
    const unmetCriteria = criteria
      .filter((criterion) => !criterion.test(password))
      .map((criterion) => criterion.message);

    return { strength, message, unmetCriteria };
  };

  useEffect(() => {
    if (formData.password) {
      const { strength, message, unmetCriteria } = validatePassword(
        formData.password
      );
      setPasswordStrength(strength);
      setStrengthMessage(message);
      setErrors((prev) => ({ ...prev, password: unmetCriteria }));
    } else {
      setPasswordStrength(0);
      setStrengthMessage("");
      setErrors((prev) => ({ ...prev, password: [] }));
    }
  }, [formData.password]);

  const signupMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: (form) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, form)
        .then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Registration successful!", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      router.push("/profile");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    },
  });

  const loginMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: (form) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, form)
        .then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Login successful!", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      router.push("/profile");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      setErrors({ submit: error.response?.data?.message || "Login failed" });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string | string[] } = {};

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

    signupMutation.mutate({
      username: formData.username!,
      email: formData.email!,
      password: formData.password,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.identifier)
      newErrors.identifier = "Username or email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    loginMutation.mutate({
      identifier: formData.identifier!,
      password: formData.password,
    });
  };

  return {
    formData,
    passwordStrength,
    strengthMessage,
    errors,
    isPending: signupMutation.isPending || loginMutation.isPending,
    handleChange,
    handleSignup,
    handleLogin,
  };
}
