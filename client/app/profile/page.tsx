"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
};

const fetchBookings = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.bookings;
};

export default function Profile() {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    retry: false,
    placeholderData: [
      { id: 1, car: "Toyota Camry", date: "2025-09-01", price: 120 },
      { id: 2, car: "BMW X5", date: "2025-09-05", price: 240 },
    ],
  });

  if (userLoading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (userError || bookingsError) {
    toast.error("Failed to load profile or bookings", {
      style: { background: "#1E3A8A", color: "#FFFFFF" },
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
        <Card className="p-6 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl animate-fade-in">
          <p className="text-lg font-medium text-red-500">
            Error loading profile or bookings
          </p>
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
      <Card className="w-full max-w-3xl p-8 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl animate-fade-in">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-blue-600 dark:border-orange-500 rounded-full shadow-lg">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-orange-500 text-white font-bold text-2xl">
                {user?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                {user?.username}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {user?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300 capitalize font-medium mt-1">
                {user?.role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 tracking-tight animate-fade-in">
            Booking History
          </h2>
          {bookings?.length ? (
            <ul className="space-y-4">
              {bookings.map((booking: any) => (
                <li
                  key={booking.id}
                  className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 animate-fade-in"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-lg">
                    {booking.car}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Date: {booking.date}
                  </p>
                  <p className="text-orange-500 font-bold mt-1 text-lg">
                    ${booking.price}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-lg animate-fade-in">
              No bookings yet.{" "}
              <Link
                href="/cars"
                className="text-blue-700 dark:text-orange-400 hover:underline font-medium"
              >
                Book a car now!
              </Link>
            </p>
          )}
          <Button
            variant="outline"
            className="mt-8 w-full border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-2 font-medium transition-all duration-200 hover:scale-[1.02]"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth/login";
            }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
