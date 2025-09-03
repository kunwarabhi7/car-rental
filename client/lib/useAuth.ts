"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthResponse, FormData, User } from "./interface";

interface UpdateFormData {
  username: string;
  email: string;
  profilePic?: string;
}

export function useAuth(isSignup: boolean = false) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    username: isSignup ? "" : undefined,
    email: isSignup ? "" : undefined,
    identifier: isSignup ? undefined : "",
    password: "",
    confirmPassword: isSignup ? "" : undefined,
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    username: "",
    email: "",
    profilePic: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthMessage, setStrengthMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>(
    {}
  );
  const [updateErrors, setUpdateErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      console.log("useAuth: Token on mount:", token ? "Present" : "Missing");
    }
  }, []);

  // Fetch current user
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    isFetching,
  } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const token = isClient ? localStorage.getItem("token") : null;
      if (!token) throw new Error("Not authenticated");
      try {
        console.log(
          "useAuth: Fetching user with token:",
          token.substring(0, 10) + "..."
        );
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("useAuth: User fetched:", res.data.user);
        return res.data.user;
      } catch (error: any) {
        console.error(
          "useAuth: User fetch error:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          if (isClient) {
            localStorage.removeItem("token");
            queryClient.setQueryData(["user"], null);
            console.log("useAuth: Token removed due to 401");
          }
          throw new Error("Session expired. Please log in again.");
        }
        // Don't remove token for 404, keep it for retry
        throw new Error(
          error.response?.data?.message || "Failed to fetch user"
        );
      }
    },
    retry: (failureCount, error) => {
      // Retry up to 2 times for non-401 errors
      if (error.message.includes("Session expired")) return false;
      return failureCount < 2;
    },
    enabled: isClient && !!localStorage?.getItem("token"),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
  });

  // Pre-fill update form with user data
  useEffect(() => {
    if (user) {
      setUpdateFormData({
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  // Debug userError
  useEffect(() => {
    if (userError) {
      console.error("useAuth: User fetch error:", userError.message);
      toast.error(userError.message, {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
    }
  }, [userError]);

  // Password strength logic
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
    const passed = criteria.filter((c) => c.test(password)).length;
    const strength = (passed / criteria.length) * 100;
    const message =
      passed === criteria.length ? "Strong" : passed >= 3 ? "Moderate" : "Weak";
    const unmetCriteria = criteria
      .filter((c) => !c.test(password))
      .map((c) => c.message);
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

  // Signup mutation
  const signupMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: (form) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, form)
        .then((res) => res.data),
    onSuccess: (data) => {
      if (isClient) {
        localStorage.setItem("token", data.token);
        console.log(
          "useAuth: Token set after signup:",
          data.token.substring(0, 10) + "..."
        );
      }
      queryClient.setQueryData(["user"], data.user);
      toast.success("Registration successful!", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      router.push("/profile");
    },
    onError: (error: any) => {
      console.error(
        "useAuth: Signup error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Registration failed", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: (form) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, form)
        .then((res) => res.data),
    onSuccess: (data) => {
      if (isClient) {
        localStorage.setItem("token", data.token);
        console.log(
          "useAuth: Token set after login:",
          data.token.substring(0, 10) + "..."
        );
      }
      queryClient.setQueryData(["user"], data.user);
      toast.success("Login successful!", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      router.push("/profile");
    },
    onError: (error: any) => {
      console.error(
        "useAuth: Login error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Login failed", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      setErrors({ submit: error.response?.data?.message || "Login failed" });
    },
  });

  // Update profile mutation
  const updateMutation = useMutation<AuthResponse, Error, UpdateFormData>({
    mutationFn: (data) =>
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/users/${user?._id}`, data, {
          headers: {
            Authorization: `Bearer ${
              isClient ? localStorage.getItem("token") : ""
            }`,
          },
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success("Profile updated successfully!", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
    },
    onError: (error: any) => {
      console.error(
        "useAuth: Update error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Update failed", {
        style: { background: "#1E3A8A", color: "#FFFFFF" },
      });
      setUpdateErrors({
        submit: error.response?.data?.message || "Update failed",
      });
    },
  });

  // Handle input change for auth forms
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle input change for update form
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    setUpdateErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle signup
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string | string[] } = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = ["Password is required"];
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (passwordStrength < 100)
      newErrors.password = errors.password || [
        "Password does not meet all requirements",
      ];
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

  // Handle login
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

  // Handle Google OAuth
  const handleGoogleAuth = () => {
    if (isClient) {
      console.log("useAuth: Initiating Google OAuth redirect");
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    }
  };

  // Handle profile update
  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!updateFormData.username) newErrors.username = "Username is required";
    if (!updateFormData.email) newErrors.email = "Email is required";
    if (Object.keys(newErrors).length > 0) {
      setUpdateErrors(newErrors);
      return;
    }
    if (!user?._id) {
      setUpdateErrors({ submit: "User not authenticated" });
      return;
    }
    console.log("useAuth: Updating profile for user:", user._id);
    updateMutation.mutate(updateFormData);
  };

  // Logout
  const logout = () => {
    if (isClient) {
      localStorage.removeItem("token");
      console.log("useAuth: Token removed on logout");
    }
    queryClient.setQueryData(["user"], null);
    toast.success("Logged out successfully!", {
      style: { background: "#1E3A8A", color: "#FFFFFF" },
    });
    router.push("/auth/login");
  };

  // Fetch current user
  const fetchCurrentUser = () => {
    console.log("useAuth: Invalidating user query");
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    formData,
    passwordStrength,
    strengthMessage,
    errors,
    updateFormData,
    updateErrors,
    isPending: signupMutation.isPending || loginMutation.isPending,
    isUpdatePending: updateMutation.isPending,
    handleChange,
    handleSignup,
    handleLogin,
    handleGoogleAuth,
    handleUpdateChange,
    updateProfile,
    user,
    userLoading,
    userError,
    logout,
    fetchCurrentUser,
  };
}
