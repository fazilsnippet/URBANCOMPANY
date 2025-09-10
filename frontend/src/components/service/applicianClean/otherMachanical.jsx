import { useRef, useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import BaseServiceCard from "../baseServiceCard";

const services=[{
  title: "Mobile Repair",
  description: "Screen replacement, battery issues, charging port, and software fixes",
  rating: "4.7",
  reviews: "3.8k",
  image:
    "https://images.unsplash.com/photo-1695048065040-a0e3ec926785?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE5fHxtb2JpbGV8ZW58MHx8MHx8fDA%3D",
  stars: 5,
  route: "/services/repair/mobile-repair",
},
{
  title: "Laptop Repair",
  description: "Hardware upgrades, motherboard repair, virus removal, and OS installation",
  rating: "4.9",
  reviews: "2.6k",
  image:
"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  stars: 5,
  route: "/services/repair/laptop-repair",
},
{
  title: "Home Appliance Repair",
  description: "Washing machines, refrigerators, microwaves, and kitchen appliances",
  rating: "4.8",
  reviews: "4.1k",
  image:
    "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_3,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1744620504925-e5c5e3.jpeg",
  stars: 5,
  route: "/services/repair/home-appliance-repair",
},
{
  title: "TV Repair",
  description: "LED, LCD, smart TV screen repair, sound issues, and installation",
  rating: "4.6",
  reviews: "1.9k",
  image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_3,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1744620497539-f8e4a6.jpeg",
  stars: 4,
  route: "/services/repair/tv-repair",
},
{
  title: "AC & Cooler Repair",
  description: "Air conditioner servicing, gas refill, cooling issues, and fan repairs",
  rating: "4.9",
  reviews: "3.4k",
  image:
"https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_600,dpr_3,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1744612474652-7bbbc3.jpeg",
  stars: 5,
  route: "/services/repair/ac-repair",
},
]


export default function ElectronicsCleaning() {
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
Appliance Service & Repair      </h1>
     

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
