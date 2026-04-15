import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Heart, Clock, ChefHat, Star, Zap } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firestore";
import logo from "../assets/logo.png";
import adanaImg from "../assets/Food/Plates/Adana.png";
import donerImg from "../assets/Food/Box/Doner Box (Meat + Fries + Sauce).png";
import iskenderImg from "../assets/Food/Plates/Iskender.png";
import koftaImg from "../assets/Food/Plates/Kofta.png";
import shishImg from "../assets/Food/Plates/Shish.png";

const fonts = {
  montserrat: "'Montserrat', sans-serif",
  poppins: "'Poppins', sans-serif",
};

const colors = {
  primary: "#3F4F3B",
  primaryHover: "#2e3a2b",
  secondary: "#7B8070",
  accent: "#484B42",
  bgLight: "#f8f9f6",
  dark: "#1a1a1a",
  accent2: "#A8C5A0",
};

const menuItems = [
  { id: 1, name: "Adana Kebab", image: adanaImg, price: "$12.99", rating: 4.8 },
  { id: 2, name: "Doner Kebab", image: donerImg, price: "$11.99", rating: 4.7 },
  { id: 3, name: "Iskender", image: iskenderImg, price: "$13.99", rating: 4.9 },
  { id: 4, name: "Kofta Kebab", image: koftaImg, price: "$12.49", rating: 4.6 },
  { id: 5, name: "Shish Kebab", image: shishImg, price: "$14.99", rating: 4.9 },
];

const PromoCard = ({ promo }) => (
  <div
    className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    style={{
      background: `linear-gradient(135deg, ${colors.accent2}40 0%, ${colors.accent2}20 100%)`,
      border: `2px solid ${colors.accent2}`,
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-extrabold text-xl mb-2">
          {promo.title}
        </h3>
        <p style={{ color: colors.secondary, fontSize: "0.9rem" }} className="max-w-xs">
          {promo.description}
        </p>
      </div>
      <Zap size={32} color={colors.accent2} />
    </div>

    <div className="mb-6 pb-6" style={{ borderBottom: `2px solid ${colors.accent2}40` }}>
      <div className="flex items-baseline gap-2">
        <span
          style={{ fontFamily: fonts.montserrat, fontSize: "2.5rem", color: colors.primary }}
          className="font-extrabold"
        >
          {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
        </span>
        <span style={{ color: colors.secondary }}>OFF</span>
      </div>
    </div>

    <div className="mb-4">
      <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="text-sm font-semibold mb-2">
        Use Code:
      </p>
      <div style={{ backgroundColor: colors.primary, color: "#fff" }} className="p-3 rounded-lg text-center">
        <p style={{ fontFamily: fonts.montserrat }} className="font-extrabold text-lg tracking-widest">
          {promo.code}
        </p>
      </div>
    </div>

    <p style={{ color: colors.secondary, fontSize: "0.8rem" }} className="text-center">
      Valid until {new Date(promo.endDate).toLocaleDateString()}
    </p>
  </div>
);

function Landing() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activePromos, setActivePromos] = useState([]);
  const [promosLoading, setPromosLoading] = useState(true);

  useEffect(() => {
    fetchActivePromos();
  }, []);

  const fetchActivePromos = async () => {
    try {
      setPromosLoading(true);
      const promosCollection = collection(db, 'promotions');
      const today = new Date();
      
      // Fetch all promotions
      const promosSnapshot = await getDocs(promosCollection);
      const allPromos = promosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter only active promotions (endDate > today)
      const active = allPromos.filter((promo) => new Date(promo.endDate) > today);
      setActivePromos(active);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setPromosLoading(false);
    }
  };

  const handleOrderClick = () => {
    navigate("/Login");
  };

  return (
    <div style={{ fontFamily: fonts.poppins }}>
      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: colors.primary }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Nadine's Diner" className="w-12 h-12 rounded-full object-cover" />
            <span style={{ fontFamily: fonts.montserrat, color: "#fff" }} className="font-bold text-xl tracking-wide">
              Nadine's Diner
            </span>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ backgroundColor: colors.dark }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <p
              style={{ fontFamily: fonts.montserrat, color: colors.accent2, fontSize: "0.9rem" }}
              className="uppercase tracking-widest font-semibold mb-4"
            >
              Welcome to Nadine's
            </p>
            <h1
              style={{ fontFamily: fonts.montserrat, fontSize: "3.5rem" }}
              className="font-extrabold leading-tight mb-6"
            >
              Authentic Kebab <span style={{ color: colors.accent2 }}>Experience</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", lineHeight: "1.8", fontSize: "1.1rem" }} className="mb-8">
              Fire-grilled kebabs, fresh ingredients, and unforgettable flavors. Every bite is crafted with passion and served with love.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleOrderClick}
                style={{
                  fontFamily: fonts.montserrat,
                  backgroundColor: colors.accent2,
                  color: colors.primary,
                }}
                className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
              >
                Order Now <ArrowRight size={18} />
              </button>
              <button
                style={{
                  fontFamily: fonts.montserrat,
                  backgroundColor: "transparent",
                  border: `2px solid ${colors.accent2}`,
                  color: colors.accent2,
                }}
                className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#A8C5A0]/10 transition-colors cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="relative">
              <img src={donerImg} alt="Signature Dish" className="w-full max-w-md rounded-2xl shadow-2xl" />
              <div
                style={{ backgroundColor: colors.accent2 }}
                className="absolute -bottom-6 -right-6 rounded-full p-6 shadow-lg"
              >
                <p style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold text-xl">
                  25% OFF
                </p>
                <p style={{ fontSize: "0.75rem", color: colors.primary }} className="font-semibold">
                  First Order
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promotions Section ── */}
      {!promosLoading && activePromos.length > 0 && (
        <section style={{ backgroundColor: colors.primary }} className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                style={{ fontFamily: fonts.montserrat, color: colors.accent2, fontSize: "2.5rem" }}
                className="font-extrabold mb-4"
              >
                🎉 Limited Time Offers
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>
                Don't miss out on our exclusive promotions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromos.map((promo) => (
                <PromoCard key={promo.id} promo={promo} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features Section ── */}
      <section style={{ backgroundColor: colors.bgLight }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ChefHat, title: "Fresh & Authentic", desc: "Prepared daily with premium ingredients" },
              { icon: Clock, title: "Quick Delivery", desc: "Hot food delivered in 30 minutes or less" },
              { icon: Heart, title: "Made with Love", desc: "Every dish crafted with care and passion" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <feature.icon size={48} color={colors.primary} className="mx-auto mb-4" />
                <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold text-xl mb-2">
                  {feature.title}
                </h3>
                <p style={{ color: colors.secondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Menu Section ── */}
      <section style={{ backgroundColor: "#fff" }} className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: "2.5rem" }}
              className="font-extrabold mb-4"
            >
              Our Signature Kebabs
            </h2>
            <p style={{ color: colors.secondary, fontSize: "1.1rem" }}>Explore our most-loved menu items</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{
                  transform: hoveredItem === item.id ? "translateY(-8px)" : "translateY(0)",
                }}
              >
                <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    style={{ backgroundColor: colors.accent2 }}
                    className="absolute top-3 right-3 p-2 rounded-full hover:opacity-80 transition-opacity"
                  >
                    <Heart size={18} color={colors.primary} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ color: colors.primary, fontFamily: fonts.montserrat }} className="font-bold text-lg">
                      {item.price}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star size={14} fill={colors.accent2} color={colors.accent2} />
                      <span style={{ fontSize: "0.85rem", color: colors.secondary }}>{item.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleOrderClick}
                    style={{
                      backgroundColor: colors.primary,
                      fontFamily: fonts.montserrat,
                    }}
                    className="w-full py-2 rounded-lg text-white text-sm font-bold uppercase hover:opacity-90 transition-opacity"
                  >
                    Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        style={{
          backgroundColor: colors.primary,
          backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
        }}
        className="py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2
            style={{ fontFamily: fonts.montserrat, fontSize: "2.5rem" }}
            className="font-extrabold mb-6"
          >
            Ready to Taste the Difference?
          </h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.95 }}>
            Join thousands of satisfied customers enjoying authentic kebabs
          </p>
          <button
            onClick={handleOrderClick}
            style={{
              fontFamily: fonts.montserrat,
              backgroundColor: colors.accent2,
              color: colors.primary,
            }}
            className="px-10 py-4 rounded-xl font-bold text-lg uppercase tracking-wide hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            Order Now <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: colors.dark }} className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
                <span style={{ fontFamily: fonts.montserrat, color: "#fff" }} className="font-bold">
                  Nadine's Diner
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                Authentic kebabs made with fresh ingredients and passion.
              </p>
            </div>
            {[
              { title: "Menu", links: ["Kebabs", "Sides", "Drinks"] },
              { title: "Company", links: ["About", "Contact", "Careers"] },
              { title: "Support", links: ["FAQ", "Feedback", "Terms"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 style={{ fontFamily: fonts.montserrat, color: "#fff" }} className="font-bold mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                        className="hover:text-[#A8C5A0] transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            className="pt-8 text-center"
          >
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
              © 2026 Nadine's Diner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
