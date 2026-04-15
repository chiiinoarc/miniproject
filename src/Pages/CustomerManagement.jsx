import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Mail, Phone, Calendar, ArrowLeft, Search } from 'lucide-react';
import { auth } from '../config/auth';
import { db } from '../config/firestore';
import { collection, getDocs, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

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

const CustomerCard = ({ customer, onDetails }) => (
  <div
    className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
    style={{ backgroundColor: '#fff' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold text-lg">
          {customer.displayName || 'User'}
        </h3>
        <p style={{ color: colors.secondary, fontSize: '0.9rem' }}>
          {customer.email}
        </p>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      {customer.phone && (
        <div className="flex items-center gap-2" style={{ color: colors.secondary }}>
          <Phone size={16} />
          <span>{customer.phone}</span>
        </div>
      )}
      {customer.createdAt && (
        <div className="flex items-center gap-2" style={{ color: colors.secondary }}>
          <Calendar size={16} />
          <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
        </div>
      )}
      {customer.orders && (
        <div style={{ color: colors.secondary }}>
          <span style={{ fontFamily: fonts.montserrat }} className="font-semibold">
            Orders: {customer.orders}
          </span>
        </div>
      )}
    </div>

    <button
      onClick={() => onDetails(customer)}
      style={{ backgroundColor: colors.primary }}
      className="w-full px-4 py-2 rounded-lg text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity"
    >
      View Details
    </button>
  </div>
);

const CustomerDetailModal = ({ customer, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <h2
        style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '1.5rem' }}
        className="font-extrabold mb-6"
      >
        Customer Details
      </h2>

      <div className="space-y-4">
        <div>
          <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm">
            Name
          </p>
          <p style={{ color: colors.primary }} className="font-bold text-lg">
            {customer.displayName || 'N/A'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={16} style={{ color: colors.secondary }} />
            <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm">
              Email
            </p>
          </div>
          <p style={{ color: colors.primary }} className="font-bold">
            {customer.email}
          </p>
        </div>

        {customer.phone && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Phone size={16} style={{ color: colors.secondary }} />
              <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm">
                Phone
              </p>
            </div>
            <p style={{ color: colors.primary }} className="font-bold">
              {customer.phone}
            </p>
          </div>
        )}

        {customer.address && (
          <div>
            <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm mb-1">
              Address
            </p>
            <p style={{ color: colors.primary }} className="font-bold">
              {customer.address}
            </p>
          </div>
        )}

        {customer.createdAt && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} style={{ color: colors.secondary }} />
              <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm">
                Member Since
              </p>
            </div>
            <p style={{ color: colors.primary }} className="font-bold">
              {new Date(customer.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {customer.orders && (
          <div>
            <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm mb-1">
              Total Orders
            </p>
            <p style={{ color: colors.primary }} className="font-bold text-lg">
              {customer.orders}
            </p>
          </div>
        )}

        {customer.totalSpent && (
          <div>
            <p style={{ fontFamily: fonts.montserrat, color: colors.secondary }} className="font-semibold text-sm mb-1">
              Total Spent
            </p>
            <p style={{ color: colors.primary }} className="font-bold text-lg">
              ${customer.totalSpent}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        style={{ backgroundColor: colors.accent2, color: colors.primary, fontFamily: fonts.montserrat }}
        className="w-full mt-8 px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
      >
        Close
      </button>
    </div>
  </div>
);

function CustomerManagement() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [displayName, setDisplayName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
        fetchCustomers();
      } else {
        navigate('/');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Fetch from users collection or wherever customer data is stored
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(query(usersCollection));
      const customersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customersList);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // If users collection doesn't exist, initialize empty
      setCustomers([]);
    } finally {
      setLoading(false);
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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
  );

  return (
    <div style={{ fontFamily: fonts.poppins, backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: colors.primary }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft size={24} /> Back
          </button>
          <span style={{ fontFamily: fonts.montserrat, color: '#fff' }} className="font-bold text-xl">
            Customer Management
          </span>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: colors.accent2, color: colors.primary }}
            className="px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <h2
            style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '2rem' }}
            className="font-extrabold mb-6"
          >
            Customers ({filteredCustomers.length})
          </h2>

          {/* ── Search ── */}
          <div className="relative">
            <Search
              size={20}
              style={{ color: colors.secondary }}
              className="absolute left-4 top-3.5"
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
              style={{ fontFamily: fonts.poppins }}
            />
          </div>
        </div>

        {/* ── Customers Grid ── */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: colors.secondary, fontFamily: fonts.montserrat }}>Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: colors.secondary, fontFamily: fonts.montserrat }}>
              {customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onDetails={() => setSelectedCustomer(customer)}
              />
            ))}
          </div>
        )}

        {/* ── Customer Detail Modal ── */}
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </div>
  );
}

export default CustomerManagement;
