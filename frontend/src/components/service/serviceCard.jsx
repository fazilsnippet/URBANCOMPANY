import { useState } from "react";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

// Service data
const servicesData = [
  {
    id: 1,
    title: "Women's Salon & Spa",
    icon: "spa",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg",
  },
  {
    id: 2,
    title: "Cleaning & Pest Control",
    icon: "broom",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg",
  },
  {
    id: 3,
    title: "Painting & Waterproofing",
    icon: "leaf",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1674120935535-f8d5c8.jpeg",
  },
  {
    id: 4,
    title: "Men's Salon & Massage",
    icon: "cut",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg",
  },
  {
    id: 5,
    title: "Electrician, Plumber & Carpenter",
    icon: "tools",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1678868062337-08bfc2.jpeg",
  },
  {
    id: 6,
    title: "AC & Appliance Repair",
    icon: "snowflake",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1751547558710-5ff49a.jpeg",
  },
  {
    id: 7,
    title: "Native Water Purifier",
    icon: "tint",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754919084321-eda462.jpeg",
  },
  {
    id: 8,
    title: "Wall Panels & Storage Units",
    icon: "couch",
    image:
      "data:image/webp;base64,UklGRqAEAABXRUJQVlA4IJQEAAAwIQCdASqZALQAPp1Enkqlo6KhqFEL8LATiWVuz5FlcPQqS1XJVqfVFnF+g9vHPoAWUb5d7Hf7tXYf5f8jvNd3UmQuXrH7v+QGxJcYl/QP+J9t3xQf6vmG+i/+n6tnWM/Wb2Hf2APWbqRcEEG4FZFU220tM2q+6jzeAwF2l7G8u/VL+Q5Vgbrzgx0/qEoK0tBfSZB+6kdrA7EMTwLeLuUtXo4/la14G330YqHeiYymYj3uwuP5V2NJvoPV1z7X+/o4eEjCHQm8AUJNWk1SAZiYlCg9IeGYeRvQiWyG0DLT/cCpsaAZX23VSRTApgUwKXYO313KLGgEdFIuYEUn7LTYRW0HIRspnT3Wpoe4nzHztuHwAP76XgAFT/mR8BS/J79zfn9e/exIBAqqZjf/Vkn3Sct09emWdQG5/qrQpB4NnDE5+M/+4jSjEASvUIk/uNlPf3/bUoX0sMRx9X1rEG+K9E/CRIn1cAsTmZmQ24LN7FvQrC5gFYq437wB28NqeS5E/mrcsW77DfZiK5TMKxyjpkrbQpInQuaYPL1Oryu/m59L9ZVN/9rwho6XfTvmgs+N4Wl7dYAN0R2ir5Lf/tBwLAM8tIjGFfkLQPqqVT0pkrGjWpX2nfwRp3Of6aVMjUwgcOdCcYE2+VWU8A4Kd3vGGAVx3tfFed/ESutG1e+XWD85Iz90a9fNa/I0AyNNKwi78ZSq8y4mYJp/hTD3GQzuVKhOB2Pit6htoEv0T183WzWQt9/A9LD8+1yISTBHl211PLod7wk1fbFJyHptOQCTYEivo7Vag4hx+aEotW/390T3wv+z74uX0Idz2GJzCp60gavcPobbG+001bQWhmRdaLODqmDT3ieJHziHWCwxLOIQPCpOTOTQkSUm8MnMLWMSQAAA6T31HKQKisPnR4i4VmY0jGBgDWQz7Rt5f0QP2+73FMU/7uCZK4/Qv5Wf8HZSHLbdO1YwO6aeC1u5CYgekMDAnuATm0zc0pxtzjGBIX6tkvwgOq5oUmBCI+YpJd8UNsSNzevr5K3fVBdEbndXcCG7H38qOftDH7ifVgbAQls2U5AwZnPhF3T4oqF0a58/5yfVr9gZ9IxuzjwUAdBDdSWp9usVYwBljAT/uNe795i4nirq+63MurVqHzU+QIyrSAc0+3evTEVfa9NO7W4qRp3jTZRbrluLSnbsjugQqutblkrUBnYgEs1ez388THGMJGBtAv/yzK7wV4hUnQHOikypcoSUR8NfzKraK31d8nrE9NW/a5+0cX67k/r/+xr/F8fuR3cT+K78VL8enxwBcvu1wGj3rX5brsbZ8FgK98Fepfm2VAOwff4fo85Yf1nlAodfxhz9MaotSrsvlf29F+dWvpg/GuagruuhRWG4jAGeyUKs7H8ZeFrQ/tEiBHdAdVTkvdKgM1jF1eQq/rJtn0ejZ3CE5PmsBz1VsOUoTbfxUdykTesbriXt7aMUJ9+dsloD8mk14+oZyjOCSb8xRs2RKttxIH/fqrLGEhf5tCvyK/CffZDfL9QT/+Tpp8Ob1Vat/3qgXhe8PIRaWoVoQAAAAA==",
  },
  {
    id: 9,
    title: "Pet Grooming",
    icon: "paw",
    image:
      "https://cdn-icons-png.flaticon.com/512/7965/7965939.png",
  },
  {
    id: 10,
    title: "Home Painting",
    icon: "paint-roller",
    image:
      "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1674120935535-f8d5c8.jpeg",
  },
];


// Categories
const categories = [
  { id: "all", name: "All Services" },
  { id: "beauty", name: "Beauty" },
  { id: "home", name: "Home Services" },
  { id: "repair", name: "Repairs" },
];

// Map service IDs → category
const getServiceCategory = (serviceId) => {
  if ([1, 4].includes(serviceId)) return "beauty";
  if ([2, 3, 8, 10].includes(serviceId)) return "home";
  if ([5, 6, 7, 9].includes(serviceId)) return "repair";
  return "all";
};


export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices =
    activeCategory === "all"
      ? servicesData
      : servicesData.filter(
          (service) => getServiceCategory(service.id) === activeCategory
        );

  return (
    <section className="py-12 px-4 sm:px-6 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular Services
          </h2>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              style={{ transition: "all 0.2s ease" }}
              className={`px-4 py-2 rounded-full border border-gray-300 text-sm font-medium ${
                activeCategory === category.id
                  ? "bg-rose-500 text-white"
                  : "text-gray-700 hover:bg-rose-500 hover:text-white"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredServices.map((service) => (
            <Link
              to={`/services/${service.id}`}
              key={service.id}
              className="bg-white m-3 rounded-xl overflow-hidden shadow-md border border-gray-100 hover:-translate-y-1 hover:shadow-xl flex flex-col items-center transition-all duration-300"
            >
              <div className="bg-gray-100 p-4 rounded-lg">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-40 h-40 object-cover mx-auto rounded-md"
                />
              </div>
              <div className="mt-4 text-center">
                <div className="text-rose-500 text-xl mb-1">
                  <i className={`fas fa-${service.icon}`}></i>
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-rose-500 to-yellow-400 bg-clip-text text-transparent">
                  {service.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="px-6 py-3 border border-rose-500 text-[#ffd100] rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-medium">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}