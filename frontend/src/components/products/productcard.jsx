



import React, { useRef, useState, useEffect } from "react";

import "font-awesome/css/font-awesome.min.css";
import "./product.css";

const services = [
  {
    title: "Water Purifier & RO",
    description: "Haircuts, facials, waxing, and more",
    rating: "4.8",
    reviews: "2.4k",
    image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_96,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752476639421-112dfa.jpeg",
    stars: 4.5,
  },
  {
    title: "Smart Door Locks",
    description: "Home deep cleaning and pest control",
    rating: "4.9",
    reviews: "3.1k",
    image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_96,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1723808286533-2d276b.jpeg",
    stars: 5,
  },
  {
    title: "Smart Speaker For Home",
    description: "Gardening and waterproofing solutions",
    rating: "4.7",
    reviews: "1.8k",
    image:
"https://images.unsplash.com/photo-1594419015530-4676f41c4bb9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnQlMjBzcGVha2VyJTIwZm9yJTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D",
    stars: 4.5,
  },
  {
    title: "Thermo Meter For Home",
    description: "Haircuts, shaves, and massages",
    rating: "4.9",
    reviews: "2.8k",
    image:
"https://media.istockphoto.com/id/474100096/photo/energy-automation-system-fahrenheit-temperature-multimedia-system.webp?a=1&b=1&s=612x612&w=0&k=20&c=1c2YvggWRs9L1yA0mDyQ1nSmG4ciHrfwgybZ_EB0Ujs=",
    stars: 5,
  },
  {
    title: "Smart Doorbell",
    description: "Expert technicians for home repair",
    rating: "4.8",
    reviews: "4.2k",
    image:
      "https://media.istockphoto.com/id/1353428273/photo/shallow-focus-of-a-homeowner-seen-testing-a-newly-installed-wifi-smart-doorbell.webp?a=1&b=1&s=612x612&w=0&k=20&c=8B5BgEbBS5Ie__2FyKUqe7i83o0iTf8SMPjGIgS38Us=",
    stars: 4.5,
  },
  {
    title: "AC & Appliance Repair",
    description: "AC servicing and appliance repair",
    rating: "4.9",
    reviews: "3.5k",
    image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_3,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1744612474652-7bbbc3.jpeg",
    stars: 5,
  },
];


export default function ProductCarousel() {
  const carouselRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) setVisibleItems(1);
      else if (window.innerWidth < 768) setVisibleItems(2);
      else if (window.innerWidth < 1024) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  // Swipe gesture preserved, but no slide navigation triggered
  useEffect(() => {
    const carousel = carouselRef.current;
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      // Swipe detected, but no action taken
    };

    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchend", handleTouchEnd);

    return () => {
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="w-full mt-20">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-14">
        Top Products
      </h1>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="carousel-container flex overflow-x-auto space-x-4 py-4 scroll-snap-x-mandatory scroll-snap-type-x-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              className="carousel-item w-64 flex-shrink-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden scroll-snap-align-start transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden object-cover">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {service.title}
                </h3>

                <div className="flex items-center mt-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: Math.floor(service.stars) }).map(
                      (_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      )
                    )}
                    {service.stars % 1 !== 0 && (
                      <i className="fas fa-star-half-alt"></i>
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-700">
                    {service.rating} ({service.reviews})
                  </span>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-rose-500 text-[#ffd100] hover:text-white text-sm font-medium rounded-lg shadow hover:bg-rose-600 transition">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
