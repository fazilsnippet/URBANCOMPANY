import { useRef, useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import "./service.css";
import BaseServiceCard from "./baseServiceCard";
const services = [
  {
    title: "Women's Salon & Spa",
    description: "Haircuts, facials, waxing, and more",
    rating: "4.8",
    reviews: "2.4k",
    image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1700143543316-c5eb5c.jpeg",    stars: 4.5,
    route: "/services/women-salon", // ✅ pass route here
  },
  {
    title: "Cleaning & Pest Control",
    description: "Home deep cleaning and pest control",
    rating: "4.9",
    reviews: "3.1k",
    image:
      "https://tse1.explicit.bing.net/th/id/OIP.0GvsyjPjcY3yhthbNqavzwAAAA?pid=ImgDet&w=159&h=159&c=7&o=7&rm=3",
    stars: 5,
    route: "/services/cleaning",
  },
  {
    title: "Painting & Waterproofing",
    description: "Gardening and waterproofing solutions",
    rating: "4.7",
    reviews: "1.8k",
    image:
"https://i.pinimg.com/1200x/92/39/fd/9239fd975870e84b9216a8bc0454d3df.jpg",
    stars: 4.5,
    route: "/services/planting",
  },
  {
    title: "Men's Salon & Massage",
    description: "Haircuts, shaves, and massages",
    rating: "4.9",
    reviews: "2.8k",
    image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700127746630-a2db1c.jpeg",    stars: 5,
    route: "/services/men-salon",
  },
];

export default function Carousel() {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const totalSlides = Math.ceil(services.length / visibleItems);

  const goToSlide = (index) => {
    if (!carouselRef.current) return;
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    const itemWidth = carouselRef.current.firstChild.offsetWidth;
    const scrollPos = index * itemWidth * visibleItems;

    carouselRef.current.scrollTo({ left: scrollPos, behavior: "smooth" });
    setCurrentSlide(index);
  };

  // Swipe Support
  useEffect(() => {
    const carousel = carouselRef.current;
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (diff > 50) goToSlide(currentSlide + 1);
      if (diff < -50) goToSlide(currentSlide - 1);
    };

    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchend", handleTouchEnd);

    return () => {
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentSlide]);

  return (
    <div className="w-full mt-20">
      <h1 className="text-3xl font-bold text-shadow-accent text-gray-900 text-center mb-8">
        Most Booked Services
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
