import { useRef, useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import BaseServiceCard from "../baseServiceCard";

const services=[{
  title: " Stress Relief Massage",
  description: "Screen replacement, battery issues, charging port, and software fixes",
  rating: "4.7",
  reviews: "3.8k",
  image:
  "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700135829701-85b36c.jpeg",
   stars: 5,
  route: "/services/repair/mobile-repair",
},
{
  title: "Pain Relief Massage",
  description: "Hardware upgrades, motherboard repair, virus removal, and OS installation",
  rating: "4.9",
  reviews: "2.6k",
  image:
  "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700135813754-417df5.jpeg",
  route: "/services/repair/laptop-repair",
},


]


export default function MenSpa() {
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
Massage For Men      </h1>
     

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
