import { useRef, useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import BaseServiceCard from "./baseServiceCard";

const services = [
  {
    title: "Home Deep Cleaning",
    description: "Complete deep cleaning for your home, including kitchen, bathrooms, and bedrooms",
    rating: "4.9",
    reviews: "1.2k",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stars: 5,
    route: "/services/cleaning/home-deep",
  },
  {
    title: "Sofa & Carpet Cleaning",
    description: "Professional cleaning for sofas, upholstery, and carpets",
    rating: "4.8",
    reviews: "950",
    image:
"https://th.bing.com/th/id/OIP.8YT0DAix6Dgxoe20gnDUMQHaEK?w=162&h=104&c=7&bgcl=ed3772&r=0&o=6&pid=13.1",    stars: 4.5,
    route: "/services/cleaning/sofa-carpet",
  },
  {
    title: "Kitchen Cleaning",
    description: "Oil, grease, and dirt removal for kitchens and chimneys",
    rating: "4.7",
    reviews: "780",
    image:
"https://th.bing.com/th/id/OIP.NtYmtvcpbJt1KzgM8ypyPgAAAA?w=107&h=104&c=7&bgcl=f8f403&r=0&o=6&pid=13.1",    stars: 4.5,
    route: "/services/cleaning/kitchen-chimney",
  },
  {
    title: "Bathroom Cleaning",
    description: "Expert cleaning for tiles, taps, shower, and toilet",
    rating: "4.9",
    reviews: "1.5k",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stars: 5,
    route: "/services/cleaning/bathroom",
  },
  {
    title: "Pest Control",
    description: "Cockroach, termite, mosquito, and general pest control",
    rating: "4.8",
    reviews: "2.3k",
    image:
      "https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stars: 5,
    route: "/services/cleaning/pest-control",
  },
];



export default function Cleaning() {
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
      <h1 className="text-3xl font-bold text-shadow-accent text-gray-900 text-center mb-8">
        Our Cleaning Services
      </h1>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="carousel-container flex overflow-x-auto space-x-4 py-4 scroll-snap-x-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {services.map((service, idx) => (
            <BaseServiceCard
              key={idx}
              image={service.image}
              title={service.title}
              rating={service.rating}
              reviews={service.reviews}
              stars={service.stars}
              route={service.route}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
