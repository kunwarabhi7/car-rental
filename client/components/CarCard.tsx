"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Car {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
}

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Card className="w-full max-w-sm h-[450px] bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 animate-fade-in flex flex-col">
      <CardHeader className="p-0 flex-shrink-0">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-56 object-cover rounded-t-2xl transition-transform duration-200 aspect-[4/3]"
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-gray-700 dark:text-gray-300 tracking-tight line-clamp-1">
            {car.name}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
            {car.type}
          </p>
        </div>
        <p className="text-orange-500 font-bold mt-3 text-lg">
          ${car.price}/day
        </p>
      </CardContent>
      <CardFooter className="p-6 flex-shrink-0">
        <Button
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
          asChild
        >
          <Link href={`/cars/${car.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
