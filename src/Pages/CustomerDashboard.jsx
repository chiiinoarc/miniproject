import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Heart, Clock, Utensils, TrendingUp, LogOut, ChevronDown, Settings, User, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import logo from '../assets/logo.png';

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
  accent2: "#A8C5A0",
};

const StatCard = ({ icon: Icon, number, label, bgColor }) => (
  <div
    className="rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
    style={{ 
      backgroundColor: bgColor,
      transform: 'translateY(0)',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div 
      className="p-4 rounded-full mb-4"
      style={{ backgroundColor: `${colors.accent2}40` }}
    >
      <Icon size={36} color={colors.primary} strokeWidth={2} />
    </div>
    <p
      style={{ fontFamily: fonts.montserrat, fontSize: "2.5rem", color: colors.primary }}
      className="font-bold"
    >
      {number}
    </p>
    <p
      style={{ fontFamily: fonts.montserrat, color: colors.accent, fontSize: "0.9rem" }}
      className="font-semibold mt-2"
    >
      {label}
    </p>
  </div>
);

const FavoriteItemCard = ({ item, navigate }) => {
  const [cardHover, setCardHover] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      style={{ 
        backgroundColor: "#fff",
        transform: cardHover ? 'translateY(-8px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
    >
      <div className="relative w-full h-48 overflow-hidden bg-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(63, 79, 59, 0.5)' }}
        >
          <button
            onClick={() => navigate('/menu')}
            style={{
              fontFamily: fonts.montserrat,
              backgroundColor: colors.accent2,
              color: colors.primary,
            }}
            className="px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide"
          >
            Order Now
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3
            style={{ fontFamily: fonts.montserrat, color: colors.primary }}
            className="font-bold text-base"
          >
            {item.name}
          </h3>
          <p
            style={{ fontFamily: fonts.montserrat, color: colors.accent2 }}
            className="font-bold text-lg"
          >
            {item.price}
          </p>
        </div>
        <button
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primaryHover;
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.transform = 'translateY(0)';
          }}
          onClick={() => navigate('/menu')}
          style={{
            backgroundColor: colors.primary,
            fontFamily: fonts.montserrat,
            transition: "background-color 0.2s, transform 0.2s, box-shadow 0.2s",
          }}
          className="w-full py-2.5 rounded-lg text-white text-sm font-bold uppercase tracking-wide cursor-pointer"
        >
          Order Again
        </button>
      </div>
    </div>
  );
};

function CustomerDashboard() {
  const navigate = useNavigate();
  const [navHover, setNavHover] = useState(null);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('User');
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    pastOrders: 0,
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Use display name if available, otherwise use email
        setDisplayName(currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
        
        // Fetch user's favorite items from Firestore
        try {
          const favoritesRef = collection(db, 'favorites');
          const q = query(favoritesRef, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          
          const userFavorites = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setFavoriteItems(userFavorites);
          
          // Fetch user stats from Firestore
          try {
            const userStatsRef = collection(db, 'userStats');
            const statsQuery = query(userStatsRef, where('userId', '==', currentUser.uid));
            const statsSnapshot = await getDocs(statsQuery);
            
            if (!statsSnapshot.empty) {
              const userStats = statsSnapshot.docs[0].data();
              setStats({
                activeOrders: userStats.activeOrders || 0,
                pastOrders: userStats.pastOrders || 0,
                favorites: userFavorites.length,
              });
            } else {
              setStats({
                activeOrders: 0,
                pastOrders: 0,
                favorites: userFavorites.length,
              });
            }
          } catch (error) {
            console.error('Error fetching user stats:', error);
            setStats({
              activeOrders: 0,
              pastOrders: 0,
              favorites: userFavorites.length,
            });
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
          // Set empty favorites list on error
          setFavoriteItems([]);
          setStats({
            activeOrders: 0,
            pastOrders: 0,
            favorites: 0,
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: fonts.poppins,
          color: colors.primary,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: `4px solid rgba(63, 79, 59, 0.2)`,
              borderTop: `4px solid ${colors.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ fontSize: '1.1rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: fonts.poppins, backgroundColor: colors.bgLight }} className="min-h-screen">
      {/* ── Header/Navbar ── */}
      <nav
        style={{ backgroundColor: colors.primary }}
        className="shadow-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src={logo}
              alt="Nadine's Diner"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span style={{ fontFamily: fonts.montserrat, color: "#fff" }} className="font-bold text-xl tracking-wide">
              Nadine's Diner
            </span>
          </div>
          <div className="flex items-center gap-6">
            {['Menu'].map((item) => (
              <button
                key={item}
                onClick={() => navigate('/menu')}
                onMouseEnter={() => setNavHover(item)}
                onMouseLeave={() => setNavHover(null)}
                style={{
                  fontFamily: fonts.montserrat,
                  color: "#fff",
                  borderBottom: navHover === item ? "2px solid #A8C5A0" : "2px solid transparent",
                  transition: "border-color 0.2s",
                  paddingBottom: "2px",
                }}
                className="font-semibold text-sm uppercase tracking-wide cursor-pointer"
              >
                {item}
              </button>
            ))}
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
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
        }}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-6 text-white">
          <p
            style={{ fontFamily: fonts.montserrat, color: colors.accent2, fontSize: "0.9rem" }}
            className="uppercase tracking-widest font-semibold mb-2"
          >
            Welcome Back
          </p>
          <h1
            style={{ fontFamily: fonts.montserrat, fontSize: "2.8rem" }}
            className="font-extrabold mb-3 leading-tight"
          >
            Hi {displayName.split(' ')[0]}, Ready to Order?
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.95 }} className="max-w-2xl">
            Your favorite kebabs are just a click away. Order now and enjoy the same delicious taste you love.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Stats Section */}
        <div className="mb-20">
          <h2
            style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: "1.8rem" }}
            className="font-bold mb-10"
          >
            Your Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={ShoppingBag} 
              number={stats.activeOrders} 
              label="Active Orders"
              bgColor="rgba(168, 197, 160, 0.3)"
            />
            <StatCard 
              icon={Calendar} 
              number={stats.pastOrders} 
              label="Past Orders"
              bgColor="rgba(123, 128, 112, 0.2)"
            />
            <StatCard 
              icon={Heart} 
              number={stats.favorites} 
              label="Favorites"
              bgColor="rgba(160, 197, 160, 0.25)"
            />
          </div>
        </div>

        {/* Favorites Section */}
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${colors.accent2}40` }}
            >
              <Heart size={24} color={colors.primary} fill={colors.primary} />
            </div>
            <h2
              style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: "1.8rem" }}
              className="font-bold"
            >
              Your Favorites
            </h2>
          </div>

          {/* Favorites Grid */}
          {favoriteItems.length > 0 ? (
            <div
              className="rounded-3xl p-10 shadow-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteItems.map((item) => (
                  <FavoriteItemCard key={item.id} item={item} navigate={navigate} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-3xl p-16 shadow-lg text-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Heart size={48} color={colors.accent2} className="mx-auto mb-6" />
              <h3
                style={{ fontFamily: fonts.montserrat, color: "#fff", fontSize: "1.5rem" }}
                className="font-bold mb-2"
              >
                No Favorites Yet
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "2rem" }}>
                Start adding your favorite items to see them here
              </p>
              <button
                onClick={() => navigate('/menu')}
                style={{
                  fontFamily: fonts.montserrat,
                  backgroundColor: colors.accent2,
                  color: colors.primary,
                }}
                className="inline-block px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-20">
          <h2
            style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: "1.8rem" }}
            className="font-bold mb-10"
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Utensils, title: "Browse Menu", desc: "Explore all items", path: "/menu" },
              { icon: Clock, title: "Reorder", desc: "Faster checkout", path: "/menu" },
              { icon: TrendingUp, title: "Special Deals", desc: "Save up to 30%", path: "/menu" },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                style={{
                  backgroundColor: "#fff",
                  border: `2px solid ${colors.primary}`,
                  transition: 'all 0.3s ease'
                }}
                className="rounded-2xl p-6 text-center hover:shadow-lg cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.backgroundColor = colors.bgLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <action.icon size={40} color={colors.primary} className="mx-auto mb-3" />
                <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold mb-1">
                  {action.title}
                </h3>
                <p style={{ color: colors.secondary, fontSize: "0.9rem" }}>{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Section ── */}
      <section
        style={{
          backgroundColor: colors.primary,
          backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
        }}
        className="py-16 mt-12"
      >
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2
            style={{ fontFamily: fonts.montserrat, fontSize: "2rem" }}
            className="font-extrabold mb-4"
          >
            Treat Yourself Today
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "2rem", opacity: 0.95 }}>
            Order your favorite kebab now and enjoy our special discount on your next purchase
          </p>
          <button
            onClick={() => navigate('/menu')}
            style={{
              fontFamily: fonts.montserrat,
              backgroundColor: colors.accent2,
              color: colors.primary,
              transition: 'all 0.2s ease'
            }}
            className="px-10 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:opacity-90 cursor-pointer"
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Order Now
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#1a1a1a' }} className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
            © 2026 Nadine's Diner. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CustomerDashboard;