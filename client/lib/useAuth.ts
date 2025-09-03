"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthResponse, FormData, UpdateFormData, User } from "./interface";

// ------------------ Hook ------------------
export function useAuth(isSignup: boolean = false) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Auth forms state
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
  const [loading, setLoading] = useState(true);
  // ------------------ Setup ------------------
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ------------------ Fetch current user ------------------
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User | null, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const token = isClient ? localStorage.getItem("token") : null;
      if (!token) {
        setLoading(false); // important, warna stuck loader hoga
        return null; // ❌ error throw mat karna
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return res.data.user;
      } catch (error: any) {
        if (error.response?.status === 401) {
          if (isClient) {
            localStorage.removeItem("token");
            queryClient.setQueryData(["user"], null);
            router.push("/auth/login");
          }
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(
          error.response?.data?.message || "Failed to fetch user"
        );
      } finally {
        setLoading(false);
      }
    },
    enabled: isClient, // ✅ token check ab queryFn ke andar ho raha
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ------------------ Prefill update form ------------------
  useEffect(() => {
    if (user) {
      setUpdateFormData({
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  // ------------------ Password strength ------------------
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
        test: (pwd: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd),
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

  // ------------------ Mutations ------------------
  const signupMutation = useMutation<AuthResponse, Error, FormData>({
    mutationFn: (form) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, form)
        .then((res) => res.data),
    onSuccess: (data) => {
      if (isClient) localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);
      toast.success("Registration successful!");
      router.push("/profile");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
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
      if (isClient) localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);
      toast.success("Login successful!");
      router.push("/profile");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
      setErrors({ submit: error.response?.data?.message || "Login failed" });
    },
  });

  const updateMutation = useMutation<AuthResponse, Error, UpdateFormData>({
    mutationFn: (data) =>
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/${user?._id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed");
      setUpdateErrors({
        submit: error.response?.data?.message || "Update failed",
      });
    },
  });

  // ------------------ Handlers ------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    setUpdateErrors((prev) => ({ ...prev, [name]: "" }));
  };

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

  const handleGoogleAuth = () => {
    if (isClient) {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    }
  };

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
    updateMutation.mutate(updateFormData);
  };

  const logout = () => {
    if (isClient) localStorage.removeItem("token");
    queryClient.setQueryData(["user"], null);
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  const fetchCurrentUser = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  // ------------------ Return ------------------
  return {
    formData,
    updateFormData,
    passwordStrength,
    strengthMessage,
    errors,
    updateErrors,
    isPending: signupMutation.isPending || loginMutation.isPending,
    isUpdatePending: updateMutation.isPending,
    handleChange,
    handleUpdateChange,
    handleSignup,
    handleLogin,
    handleGoogleAuth,
    updateProfile,
    logout,
    fetchCurrentUser,
    user,
    userLoading,
    userError,
    loading,
  };
}
