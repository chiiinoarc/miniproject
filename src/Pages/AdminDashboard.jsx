import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, UtensilsCrossed, Zap, ChevronDown, Settings, BarChart3 } from 'lucide-react';
import { auth, db } from '../config/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import logo from '../assets/logo.png';

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
  dark: '#1a1a1a',
  accent2: '#A8C5A0',
};

const ActionButton = ({ icon: Icon, title, desc, path, navigate }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        backgroundColor: hover ? colors.primary : "#fff",
        border: `2px solid ${colors.primary}`,
        color: hover ? "#fff" : colors.primary,
        transition: 'all 0.3s ease'
      }}
      className="rounded-2xl p-6 text-left hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-start gap-3">
        <Icon size={32} />
        <div>
          <h3 style={{ fontFamily: fonts.montserrat }} className="font-bold text-base mb-1">
            {title}
          </h3>
          <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>{desc}</p>
        </div>
      </div>
    </button>
  );
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('Admin');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalCustomers: 0,
    activePromos: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
        
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.role === 'admin') {
              setIsAdmin(true);
              fetchStats();
            } else {
              setIsAdmin(false);
              navigate('/');
            }
          } else {
            setIsAdmin(false);
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          navigate('/');
        }
      } else {
        navigate('/Login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const menuCollection = collection(db, 'menuItems');
      const menuSnapshot = await getDocs(menuCollection);
      
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      
      const promosCollection = collection(db, 'promotions');
      const promosSnapshot = await getDocs(promosCollection);
      const today = new Date();
      const activePromos = promosSnapshot.docs.filter(
        (doc) => new Date(doc.data().endDate) > today
      ).length;

      setStats({
        totalMenuItems: menuSnapshot.size,
        totalCustomers: usersSnapshot.size - 1, // Exclude admin
        activePromos: activePromos,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
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

  if (!isAdmin) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: fonts.poppins,
          color: colors.primary,
          backgroundColor: colors.bgLight,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontFamily: fonts.montserrat }}>Access Denied</p>
          <p style={{ color: colors.secondary, marginTop: '0.5rem' }}>You do not have admin privileges</p>
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
            <div>
              <span style={{ fontFamily: fonts.montserrat, color: "#fff" }} className="font-bold text-lg tracking-wide">
                Admin Panel
              </span>
              <p style={{ color: colors.accent2, fontSize: "0.7rem" }}>Nadine's Diner</p>
            </div>
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
                    <Settings size={16} color={colors.primary} />
                    <span style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '0.9rem' }} className="font-semibold">
                      Settings
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
            Management Dashboard
          </p>
          <h1
            style={{ fontFamily: fonts.montserrat, fontSize: "2.8rem" }}
            className="font-extrabold mb-3 leading-tight"
          >
            Welcome back, {displayName.split(' ')[0]}
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.95 }} className="max-w-2xl">
            Manage your restaurant's menu, customers, and promotions all in one place.
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
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={UtensilsCrossed} 
              number={stats.totalMenuItems} 
              label="Menu Items"
              bgColor="rgba(168, 197, 160, 0.3)"
            />
            <StatCard 
              icon={Users} 
              number={stats.totalCustomers} 
              label="Customers"
              bgColor="rgba(123, 128, 112, 0.2)"
            />
            <StatCard 
              icon={Zap} 
              number={stats.activePromos} 
              label="Active Promos"
              bgColor="rgba(160, 197, 160, 0.25)"
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2
            style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: "1.8rem" }}
            className="font-bold mb-10"
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionButton
              icon={UtensilsCrossed}
              title="Menu Items"
              desc="Add, edit, or delete menu items"
              path="/admin/menu"
              navigate={navigate}
            />
            <ActionButton
              icon={Users}
              title="Customers"
              desc="View and manage customer data"
              path="/admin/customers"
              navigate={navigate}
            />
            <ActionButton
              icon={Zap}
              title="Promotions"
              desc="Create and manage promotions"
              path="/admin/promos"
              navigate={navigate}
            />
            <ActionButton
              icon={BarChart3}
              title="Analytics"
              desc="View sales and performance data"
              path="/admin"
              navigate={navigate}
            />
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
            Keep Your Restaurant Updated
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "2rem", opacity: 0.95 }}>
            Regularly update your menu, manage customer relationships, and run promotions to boost sales
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#1a1a1a' }} className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
            © 2026 Nadine's Diner Admin Panel. All rights reserved.
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

export default AdminDashboard;