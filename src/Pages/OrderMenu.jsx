import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingCart, Search, Filter, ChevronDown, Settings, User, Smartphone } from 'lucide-react';
import { auth } from '../config/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import logo from '../assets/logo.png';
import adanaImg from "../assets/Food/Plates/Adana.png";
import iskenderImg from "../assets/Food/Plates/Iskender.png";
import koftaImg from "../assets/Food/Plates/Kofta.png";
import shishImg from "../assets/Food/Plates/Shish.png";
import chickenBoxImg from "../assets/Food/Box/Chicken Box.png";
import donerBoxImg from "../assets/Food/Box/Doner Box (Meat + Fries + Sauce).png";
import fallafelBoxImg from "../assets/Food/Box/Falafel Box.png";
import chickenBurgerImg from "../assets/Food/Burger/Chicken Burger.png";
import kebabBurgerImg from "../assets/Food/Burger/Kebab Burger.png";
import spicyBurgerImg from "../assets/Food/Burger/Spicy Burger.png";

const fonts = {
  montserrat: "'Montserrat', sans-serif",
  poppins: "'Poppins', sans-serif",
};

const colors = {
  primary: '#3F4F3B',
  primaryHover: '#2e3a2b',
  secondary: '#7B8070',
  accent: '#484B42',
  bgLight: '#f8f9f6',
  accent2: '#A8C5A0',
  dark: '#1a1a1a',
};

// Menu categories - structure ready, will populate with items
const menuCategories = [
  { id: 1, name: 'Plates', icon: '🍽️' },
  { id: 2, name: 'Wraps', icon: '🌯' },
  { id: 3, name: 'Box', icon: '📦' },
  { id: 4, name: 'Burgers', icon: '🍔' },
];

// Menu items - populated with kebab dishes
const menuItems = [
  // Plates Category
  {
    id: 1,
    name: "Shish Kebab",
    category: 1,
    image: shishImg,
    price: 14.99,
    description: "Tender grilled chicken skewers with salad, rice, and fries",
    rating: 4.8,
    reviews: 156,
    ingredients: [
      { name: "Grilled Chicken", description: "Tender, juicy grilled chicken skewers", price: 4.00 },
      { name: "Rice", description: "Fluffy white rice, the perfect base", price: 1.50 },
      { name: "Salad Mix", description: "Fresh mixed greens and vegetables", price: 1.00 },
      { name: "Fries", description: "Crispy golden french fries", price: 1.50 },
      { name: "Garlic Sauce", description: "Creamy garlic mayo sauce for flavor", price: 0.75 },
      { name: "Lemon", description: "Fresh lemon wedges for zesty brightness", price: 0.50 },
    ],
  },
  {
    id: 2,
    name: "Kofta Kebab",
    category: 1,
    image: koftaImg,
    price: 12.49,
    description: "Juicy beef meatball kebabs with fresh salad and golden fries",
    rating: 4.6,
    reviews: 98,
    ingredients: [
      { name: "Beef Meatballs", description: "Flavorful beef meatballs with spices", price: 3.50 },
      { name: "Rice", description: "Fluffy white rice, the perfect base", price: 1.50 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.75 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.75 },
      { name: "Onion", description: "Sweet caramelized onions", price: 0.50 },
      { name: "Fries", description: "Crispy golden french fries", price: 1.50 },
      { name: "Tahini Sauce", description: "Rich, creamy tahini sauce", price: 1.00 },
    ],
  },
  {
    id: 3,
    name: "Adana Kebab",
    category: 1,
    image: adanaImg,
    price: 12.99,
    description: "Spiced ground meat kebab served with lettuce, tomato, and onions",
    rating: 4.8,
    reviews: 234,
    ingredients: [
      { name: "Spiced Ground Meat", description: "Finely ground meat with special spice blend", price: 3.50 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.75 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.75 },
      { name: "Onion", description: "Sweet caramelized onions", price: 0.50 },
      { name: "Parsley", description: "Fresh fragrant parsley garnish", price: 0.25 },
      { name: "Sumac", description: "Tangy spice that adds citrus flavor", price: 0.50 },
      { name: "Pita Bread", description: "Warm, soft pita bread", price: 0.75 },
    ],
  },
  {
    id: 4,
    name: "Iskender Kebab",
    category: 1,
    image: iskenderImg,
    price: 13.99,
    description: "Sliced kebab meat over pita bread with yogurt and tomato sauce",
    rating: 4.9,
    reviews: 187,
    ingredients: [
      { name: "Sliced Kebab Meat", description: "Tender doner meat sliced thin", price: 4.00 },
      { name: "Pita Bread", description: "Warm, soft pita bread base", price: 0.75 },
      { name: "Yogurt", description: "Cool, creamy yogurt sauce", price: 0.75 },
      { name: "Tomato Sauce", description: "Tangy and savory tomato sauce", price: 0.50 },
      { name: "Butter", description: "Rich melted butter topping", price: 0.75 },
      { name: "Spices", description: "Aromatic blend of Middle Eastern spices", price: 0.50 },
    ],
  },
  {
    id: 5,
    name: "Mixed Kebab Platter",
    category: 1,
    image: shishImg,
    price: 19.99,
    description: "Assorted kebabs with grilled vegetables, rice, and sides",
    rating: 4.9,
    reviews: 312,
    ingredients: [
      { name: "Grilled Chicken", description: "Tender, juicy grilled chicken skewers", price: 3.00 },
      { name: "Beef Meatballs", description: "Flavorful beef meatballs with spices", price: 3.00 },
      { name: "Lamb", description: "Premium lamb cuts, perfectly grilled", price: 3.50 },
      { name: "Rice", description: "Fluffy white rice, the perfect base", price: 1.50 },
      { name: "Grilled Vegetables", description: "Seasonal vegetables, charred to perfection", price: 1.50 },
      { name: "Salad", description: "Fresh mixed greens and vegetables", price: 1.00 },
      { name: "Fries", description: "Crispy golden french fries", price: 1.50 },
    ],
  },
  {
    id: 6,
    name: "Lamb Ribs",
    category: 1,
    image: iskenderImg,
    price: 16.99,
    description: "Tender grilled lamb ribs with our signature spice blend",
    rating: 4.9,
    reviews: 145,
    ingredients: [
      { name: "Lamb Ribs", description: "Tender, fall-off-the-bone lamb ribs", price: 5.00 },
      { name: "Spice Blend", description: "Signature Middle Eastern spice mix", price: 0.50 },
      { name: "Rice", description: "Fluffy white rice", price: 1.50 },
      { name: "Salad", description: "Fresh mixed greens and vegetables", price: 1.00 },
      { name: "Garlic", description: "Roasted garlic for depth", price: 0.25 },
      { name: "Rosemary", description: "Aromatic herb for fragrance", price: 0.25 },
      { name: "Lemon", description: "Fresh lemon wedges for zesty brightness", price: 0.50 },
    ],
  },
  // Wraps Category
  {
    id: 7,
    name: "Adana Wrap",
    category: 2,
    image: adanaImg,
    price: 9.99,
    description: "Spiced meat wrap with fresh vegetables and tahini sauce",
    rating: 4.7,
    reviews: 89,
    ingredients: [
      { name: "Spiced Ground Meat", description: "Finely ground meat with special spice blend", price: 3.50 },
      { name: "Tortilla Wrap", description: "Soft flour tortilla", price: 0.75 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.50 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.50 },
      { name: "Cucumber", description: "Refreshing cucumber slices", price: 0.50 },
      { name: "Tahini Sauce", description: "Rich, creamy tahini sauce", price: 0.75 },
      { name: "Parsley", description: "Fresh fragrant parsley garnish", price: 0.25 },
    ],
  },
  {
    id: 8,
    name: "Chicken Wrap",
    category: 2,
    image: shishImg,
    price: 9.49,
    description: "Grilled chicken wrap with lettuce, tomato, and house sauce",
    rating: 4.6,
    reviews: 76,
    ingredients: [
      { name: "Grilled Chicken", description: "Tender, juicy grilled chicken strips", price: 3.00 },
      { name: "Tortilla Wrap", description: "Soft flour tortilla", price: 0.75 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.50 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.50 },
      { name: "Onion", description: "Sweet caramelized onions", price: 0.25 },
      { name: "House Sauce", description: "Secret house-made sauce", price: 0.50 },
      { name: "Mayonnaise", description: "Creamy mayo base", price: 0.25 },
    ],
  },
  // Box Category
  {
    id: 9,
    name: "Chicken Box",
    category: 3,
    image: chickenBoxImg,
    price: 11.99,
    description: "Tender grilled chicken with crispy fries and our special sauce",
    rating: 4.7,
    reviews: 142,
    ingredients: [
      { name: "Grilled Chicken", description: "Tender, juicy grilled chicken pieces", price: 4.00 },
      { name: "Crispy Fries", description: "Golden, crispy french fries", price: 1.50 },
      { name: "Special Sauce", description: "House-made special sauce", price: 0.75 },
      { name: "Garlic Mayo", description: "Creamy garlic mayonnaise", price: 0.50 },
      { name: "Lemon", description: "Fresh lemon for brightness", price: 0.25 },
    ],
  },
  {
    id: 10,
    name: "Doner Box",
    category: 3,
    image: donerBoxImg,
    price: 13.99,
    description: "Succulent meat strips, golden fries, and delicious sauce",
    rating: 4.8,
    reviews: 198,
    ingredients: [
      { name: "Doner Meat", description: "Succulent doner meat strips", price: 4.50 },
      { name: "Golden Fries", description: "Crispy golden french fries", price: 1.50 },
      { name: "White Sauce", description: "Creamy white garlic sauce", price: 0.50 },
      { name: "Red Sauce", description: "Tangy tomato-based sauce", price: 0.50 },
      { name: "Onion", description: "Sweet caramelized onions", price: 0.25 },
      { name: "Parsley", description: "Fresh parsley garnish", price: 0.25 },
    ],
  },
  {
    id: 11,
    name: "Falafel Box",
    category: 3,
    image: fallafelBoxImg,
    price: 10.99,
    description: "Crispy falafel balls with fresh vegetables and tahini sauce",
    rating: 4.6,
    reviews: 87,
    ingredients: [
      { name: "Fried Falafel", description: "Crispy fried falafel balls", price: 3.00 },
      { name: "Crispy Fries", description: "Golden, crispy french fries", price: 1.50 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.50 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.50 },
      { name: "Cucumber", description: "Refreshing cucumber slices", price: 0.50 },
      { name: "Tahini Sauce", description: "Rich, creamy tahini sauce", price: 0.75 },
      { name: "Hummus", description: "Smooth chickpea hummus", price: 0.75 },
    ],
  },
  // Burgers Category
  {
    id: 12,
    name: "Chicken Burger",
    category: 4,
    image: chickenBurgerImg,
    price: 10.49,
    description: "Juicy grilled chicken patty with lettuce, tomato, and special sauce",
    rating: 4.7,
    reviews: 134,
    ingredients: [
      { name: "Grilled Chicken Patty", description: "Juicy grilled chicken patty", price: 3.50 },
      { name: "Burger Bun", description: "Soft, toasted burger bun", price: 0.75 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.50 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.50 },
      { name: "Pickling Onion", description: "Tangy pickled onions", price: 0.50 },
      { name: "Special Sauce", description: "House-made special sauce", price: 0.75 },
      { name: "Cheese", description: "Melted cheese slice", price: 0.50 },
    ],
  },
  {
    id: 13,
    name: "Kebab Burger",
    category: 4,
    image: kebabBurgerImg,
    price: 11.99,
    description: "Tender kebab meat in a soft bun with fresh vegetables and sauce",
    rating: 4.8,
    reviews: 156,
    ingredients: [
      { name: "Kebab Meat", description: "Tender kebab meat strips", price: 3.50 },
      { name: "Soft Bun", description: "Soft, fresh burger bun", price: 0.75 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.50 },
      { name: "Tomato", description: "Ripe, juicy tomato slices", price: 0.50 },
      { name: "Onion", description: "Sweet caramelized onions", price: 0.25 },
      { name: "Tahini Sauce", description: "Rich, creamy tahini sauce", price: 0.75 },
      { name: "Parsley", description: "Fresh parsley garnish", price: 0.25 },
    ],
  },
  {
    id: 14,
    name: "Spicy Burger",
    category: 4,
    image: spicyBurgerImg,
    price: 10.99,
    description: "Fire-grilled burger with spicy seasonings, jalapeños, and hot sauce",
    rating: 4.6,
    reviews: 102,
    ingredients: [
      { name: "Beef Patty", description: "Flame-grilled beef patty", price: 3.50 },
      { name: "Burger Bun", description: "Toasted burger bun", price: 0.75 },
      { name: "Jalapeño", description: "Spicy jalapeño slices", price: 0.50 },
      { name: "Hot Sauce", description: "Fiery hot sauce for heat", price: 0.50 },
      { name: "Lettuce", description: "Fresh crisp lettuce", price: 0.50 },
      { name: "Spicy Mayo", description: "Creamy mayo with a kick", price: 0.50 },
      { name: "Onion", description: "Sweet caramelized onions", price: 0.25 },
    ],
  },
];

function OrderMenu() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [navHover, setNavHover] = useState(null);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);
  const [customizationModal, setCustomizationModal] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [customItemPrice, setCustomItemPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
      } else {
        navigate('/Login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddToCart = (item) => {
    setCustomizationModal(item);
    setSelectedIngredients([...item.ingredients]);
    const totalPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
    setCustomItemPrice(totalPrice);
  };

  const handleToggleIngredient = (ingredient) => {
    let newSelectedIngredients;
    if (selectedIngredients.some(ing => ing.name === ingredient.name)) {
      newSelectedIngredients = selectedIngredients.filter(ing => ing.name !== ingredient.name);
    } else {
      newSelectedIngredients = [...selectedIngredients, ingredient];
    }
    setSelectedIngredients(newSelectedIngredients);
    const newPrice = newSelectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
    setCustomItemPrice(newPrice);
  };

  const handleConfirmOrder = () => {
    const customizedItem = {
      ...customizationModal,
      ingredients: selectedIngredients,
      price: customItemPrice,
    };
    setCartItems([...cartItems, customizedItem]);
    setCartItemsCount(cartItemsCount + 1);
    setCustomizationModal(null);
    setSelectedIngredients([]);
    setCustomItemPrice(0);
  };

  const handleRemoveFromCart = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    setCartItemsCount(cartItemsCount - 1);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.bgLight }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            style={{
              width: '50px',
              height: '50px',
              border: `4px solid ${colors.primary}`,
              borderTop: `4px solid ${colors.accent2}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }}
          />
          <p style={{ fontFamily: fonts.poppins, color: colors.primary }} className="font-semibold">
            Loading your menu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fonts.poppins, backgroundColor: colors.bgLight }} className="min-h-screen">
      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: colors.primary }} className="shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Nadine's Diner" className="w-12 h-12 rounded-full object-cover" />
            <span style={{ fontFamily: fonts.montserrat, color: '#fff' }} className="font-bold text-xl tracking-wide">
              Nadine's Diner
            </span>
          </div>

          <div className="flex items-center gap-6">
            {['Dashboard'].map((item) => (
              <button
                key={item}
                onClick={() => navigate('/CustomerDashboard')}
                onMouseEnter={() => setNavHover(item)}
                onMouseLeave={() => setNavHover(null)}
                style={{
                  fontFamily: fonts.montserrat,
                  color: '#fff',
                  borderBottom: navHover === item ? '2px solid #A8C5A0' : '2px solid transparent',
                  transition: 'border-color 0.2s',
                  paddingBottom: '2px',
                }}
                className="font-semibold text-sm uppercase tracking-wide cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <button
                onClick={() => setCartOpen(true)}
                style={{
                  backgroundColor: colors.accent2,
                  color: colors.primary,
                  fontFamily: fonts.montserrat,
                }}
                className="relative p-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span
                    style={{ backgroundColor: colors.primary }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{ backgroundColor: colors.accent2 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.accent2,
                    fontFamily: fonts.montserrat,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontFamily: fonts.montserrat, color: colors.primary, fontWeight: '600', fontSize: '0.9rem' }} className="hidden sm:inline">
                  {displayName.split(' ')[0]}
                </span>
                <ChevronDown 
                  size={18} 
                  color={colors.primary}
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  style={{
                    backgroundColor: '#fff',
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    minWidth: '300px',
                  }}
                  className="absolute right-0 mt-2 z-10 overflow-hidden"
                >
                  {/* Header with Profile Info */}
                  <div style={{ backgroundColor: colors.accent2, padding: '1rem 1.25rem' }} className="">
                    <p style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '1rem', fontWeight: 'bold' }}>
                      {displayName}
                    </p>
                    <p style={{ color: colors.primary, fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '0.5rem 0' }}>
                    <button
                      className="w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${colors.bgLight}` }}
                    >
                      <User size={16} color={colors.primary} />
                      <span style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '0.9rem' }} className="font-semibold">
                        My Profile
                      </span>
                    </button>

                    <button
                      className="w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${colors.bgLight}` }}
                    >
                      <Settings size={16} color={colors.primary} />
                      <span style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '0.9rem' }} className="font-semibold">
                        Account Settings
                      </span>
                    </button>

                    <button
                      className="w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${colors.bgLight}` }}
                    >
                      <Smartphone size={16} color={colors.primary} />
                      <span style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '0.9rem' }} className="font-semibold">
                        Device Management
                      </span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} color={colors.primary} />
                      <span style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '0.9rem' }} className="font-semibold">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
        }}
        className="py-8"
      >
        <div className="max-w-7xl mx-auto px-6 text-white">
          <h1
            style={{ fontFamily: fonts.montserrat, fontSize: '2rem' }}
            className="font-extrabold mb-2"
          >
            Order Your Favorites
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9 }} className="max-w-2xl">
            Browse our delicious menu and customize your order
          </p>
        </div>
      </section>

      {/* ── Search Bar ── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative">
          <Search size={20} style={{ color: colors.secondary }} className="absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderColor: colors.secondary }}
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-[#A8C5A0] transition-colors"
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Sidebar Categories ── */}
          <div className="lg:col-span-1">
            <div
              style={{ backgroundColor: '#fff' }}
              className="rounded-2xl shadow-md p-6 sticky top-24 h-fit"
            >
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} color={colors.primary} />
                <h3
                  style={{ fontFamily: fonts.montserrat, color: colors.primary }}
                  className="font-bold text-lg"
                >
                  Categories
                </h3>
              </div>

              <div className="space-y-2">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      backgroundColor:
                        selectedCategory === category.id
                          ? colors.accent2
                          : 'transparent',
                      color:
                        selectedCategory === category.id
                          ? colors.primary
                          : colors.secondary,
                      borderLeft:
                        selectedCategory === category.id
                          ? `4px solid ${colors.primary}`
                          : '4px solid transparent',
                      fontFamily: fonts.montserrat,
                      transition: 'all 0.2s ease',
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Menu Items Grid ── */}
          <div className="lg:col-span-3">
            {menuItems.length === 0 ? (
              <div
                style={{ backgroundColor: '#fff' }}
                className="rounded-2xl shadow-md p-16 text-center"
              >
                <p
                  style={{ fontFamily: fonts.montserrat, color: colors.secondary }}
                  className="text-lg font-semibold"
                >
                  Menu items coming soon!
                </p>
                <p style={{ color: colors.secondary, marginTop: '0.5rem' }}>
                  Check back soon for our full menu
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.category === selectedCategory).map((item) => (
                  <div
                    key={item.id}
                    style={{ backgroundColor: '#fff' }}
                    className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3
                        style={{ fontFamily: fonts.montserrat, color: colors.primary }}
                        className="font-bold text-base mb-2"
                      >
                        {item.name}
                      </h3>
                      <p style={{ color: colors.secondary, fontSize: '0.85rem' }} className="mb-4">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          style={{ fontFamily: fonts.montserrat, color: colors.accent2 }}
                          className="font-bold text-lg"
                        >
                          {item.price}
                        </p>
                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{
                            backgroundColor: colors.primary,
                            fontFamily: fonts.montserrat,
                          }}
                          className="px-4 py-2 rounded-lg text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: colors.dark }} className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            © 2026 Nadine's Diner. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Customization Modal ── */}
      {customizationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontFamily: fonts.montserrat,
                  color: colors.primary,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                }}
              >
                {customizationModal.name}
              </h2>
              <p style={{ color: colors.secondary, fontSize: '0.9rem' }}>
                {customizationModal.description}
              </p>
            </div>

            {/* Image */}
            <div
              style={{
                width: '100%',
                height: '250px',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                marginBottom: '1.5rem',
              }}
            >
              <img
                src={customizationModal.image}
                alt={customizationModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Ingredients Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontFamily: fonts.montserrat,
                  color: colors.primary,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                Customize Ingredients
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {customizationModal.ingredients.map((ingredient) => (
                  <label
                    key={ingredient.name}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '0.75rem',
                      backgroundColor: colors.bgLight,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedIngredients.some(ing => ing.name === ingredient.name)
                        ? `2px solid ${colors.primary}`
                        : `2px solid transparent`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIngredients.some(ing => ing.name === ingredient.name)}
                      onChange={() => handleToggleIngredient(ingredient)}
                      style={{
                        marginRight: '0.75rem',
                        marginTop: '0.25rem',
                        cursor: 'pointer',
                        width: '18px',
                        height: '18px',
                        minWidth: '18px',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontFamily: fonts.montserrat,
                            color: colors.primary,
                            fontSize: '0.95rem',
                            fontWeight: '600',
                          }}
                        >
                          {ingredient.name}
                        </span>
                        <span
                          style={{
                            fontFamily: fonts.montserrat,
                            color: colors.accent2,
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                          }}
                        >
                          +${ingredient.price.toFixed(2)}
                        </span>
                      </div>
                      <p
                        style={{
                          color: colors.secondary,
                          fontSize: '0.8rem',
                          margin: '0.5rem 0 0 0',
                          fontStyle: 'italic',
                        }}
                      >
                        {ingredient.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: `2px solid ${colors.bgLight}`,
              }}
            >
              <div>
                <p style={{ color: colors.secondary, fontSize: '0.85rem' }}>Total Price</p>
                <p
                  style={{
                    fontFamily: fonts.montserrat,
                    color: colors.accent2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  ${customItemPrice.toFixed(2)}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setCustomizationModal(null);
                    setSelectedIngredients([]);
                    setCustomItemPrice(0);
                  }}
                  style={{
                    backgroundColor: colors.secondary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontFamily: fonts.montserrat,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  className="hover:opacity-90 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  style={{
                    backgroundColor: colors.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontFamily: fonts.montserrat,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  className="hover:opacity-90 transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cart Modal ── */}
      {cartOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '1rem',
              padding: '0',
              width: '90%',
              maxWidth: '550px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: colors.primary,
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: fonts.montserrat,
                  color: '#fff',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                Shopping Cart
              </p>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {cartItems.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', flex: 1 }}>
                <p
                  style={{
                    fontFamily: fonts.montserrat,
                    color: colors.secondary,
                    fontSize: '1rem',
                  }}
                >
                  Your cart is empty
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    padding: '1.5rem',
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        paddingBottom: '1rem',
                        marginBottom: '1rem',
                        borderBottom: `1px solid ${colors.bgLight}`,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontFamily: fonts.montserrat,
                            color: colors.primary,
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            margin: '0 0 0.25rem 0',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            color: colors.secondary,
                            fontSize: '0.8rem',
                            margin: '0.25rem 0',
                          }}
                        >
                          {item.ingredients.length} ingredients selected
                        </p>
                        <p
                          style={{
                            color: colors.secondary,
                            fontSize: '0.75rem',
                            margin: '0.25rem 0 0.5rem 0',
                          }}
                        >
                          {item.ingredients.map(ing => ing.name).join(', ')}
                        </p>
                        <p
                          style={{
                            color: colors.accent2,
                            fontFamily: fonts.montserrat,
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            margin: '0.5rem 0 0 0',
                          }}
                        >
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(index)}
                        style={{
                          backgroundColor: '#ff4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.375rem',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  style={{
                    backgroundColor: colors.bgLight,
                    padding: '1.5rem',
                    borderTop: `2px solid ${colors.bgLight}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: fonts.montserrat,
                        color: colors.primary,
                        fontWeight: 'bold',
                        margin: 0,
                      }}
                    >
                      Total:
                    </p>
                    <p
                      style={{
                        fontFamily: fonts.montserrat,
                        color: colors.accent2,
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        margin: 0,
                      }}
                    >
                      ${cartTotal}
                    </p>
                  </div>
                  <button
                    style={{
                      width: '100%',
                      backgroundColor: colors.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontFamily: fonts.montserrat,
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                    className="hover:opacity-90 transition-all"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default OrderMenu;