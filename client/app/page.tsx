"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const fetchCars = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars`);
  return res.data;
};

export default function Home() {
  const {
    data: cars,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    retry: false,
    placeholderData: [
      {
        id: "1",
        name: "Toyota Camry",
        type: "Sedan",
        price: 40,
        image: "/cars/camry.jpg",
      },
      {
        id: "2",
        name: "BMW X5",
        type: "SUV",
        price: 80,
        image: "/cars/x5.jpg",
      },
      {
        id: "3",
        name: "Tesla Model 3",
        type: "Electric",
        price: 60,
        image: "/cars/tesla.jpg",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      {/* Hero Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight animate-fade-in bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Rent Your Dream Car
          </h1>
          <p className="text-lg md:text-xl mt-6 text-gray-600 dark:text-gray-300 animate-fade-in max-w-2xl mx-auto">
            Discover our premium fleet and drive in style. Book your ride today!
          </p>
          <Button
            asChild
            className="mt-8 px-10 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      </section>

      {/* Car Listings */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-12 text-center tracking-tight animate-fade-in">
            Featured Cars
          </h2>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center text-lg animate-fade-in">
              Failed to load cars. Please try again.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {cars?.map((car: any) => (
              <Card
                key={car.id}
                className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 animate-fade-in"
              >
                <CardHeader className="p-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-56 object-cover rounded-t-2xl transition-transform duration-200"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold text-gray-700 dark:text-gray-300 tracking-tight">
                    {car.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {car.type}
                  </p>
                  <p className="text-orange-500 font-bold mt-3 text-lg">
                    ${car.price}/day
                  </p>
                </CardContent>
                <CardFooter className="p-6">
                  <Button
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
                    asChild
                  >
                    <Link href={`/cars/${car.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
