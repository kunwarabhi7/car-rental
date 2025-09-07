"use client";

import CarCard from "./CarCard";

const mockCars = [
  {
    id: "1",
    name: "Toyota Camry",
    type: "Sedan",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1704340142770-b52988e5b6eb?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "BMW X5",
    type: "SUV",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    name: "Tesla Model 3",
    type: "Electric",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=60",
  },
];

export default function CarList() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-12 text-center tracking-tight">
          Featured Cars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {mockCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
