import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit2, X, ArrowLeft, Copy, Check } from 'lucide-react';
import { auth } from '../config/auth';
import { db } from '../config/firestore';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
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

const InputField = ({ label, type = 'text', value, onChange, placeholder, required, step }) => (
  <div className="mb-6">
    <label
      style={{ fontFamily: fonts.montserrat, color: colors.primary }}
      className="block font-bold mb-2"
    >
      {label} {required && <span style={{ color: '#e74c3c' }}>*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
        rows="4"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
      />
    )}
  </div>
);

const PromoCard = ({ promo, onEdit, onDelete, onCopy }) => {
  const isActive = new Date(promo.endDate) > new Date();

  return (
    <div
      className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
      style={{ backgroundColor: '#fff' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold text-lg">
            {promo.title}
          </h3>
          <p style={{ color: colors.secondary, fontSize: '0.9rem' }}>
            {promo.description}
          </p>
        </div>
        <span
          style={{
            backgroundColor: isActive ? colors.accent2 : '#ccc',
            color: isActive ? colors.primary : '#666',
            fontFamily: fonts.montserrat,
          }}
          className="px-3 py-1 rounded-full text-xs font-bold"
        >
          {isActive ? 'Active' : 'Expired'}
        </span>
      </div>

      <div className="space-y-3 mb-4 pb-4" style={{ borderBottom: `1px solid ${colors.bgLight}` }}>
        <div className="flex items-center justify-between">
          <span style={{ color: colors.secondary, fontFamily: fonts.montserrat }} className="font-semibold">
            Code:
          </span>
          <div className="flex items-center gap-2">
            <span
              style={{ fontFamily: fonts.montserrat, color: colors.primary }}
              className="font-bold"
            >
              {promo.code}
            </span>
            <button
              onClick={() => onCopy(promo.code)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Copy size={16} style={{ color: colors.accent2 }} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: colors.secondary, fontFamily: fonts.montserrat }} className="font-semibold">
            Discount:
          </span>
          <span style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold text-lg">
            {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: colors.secondary }}>
            {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(promo)}
          style={{ backgroundColor: colors.accent2, color: colors.primary }}
          className="flex-1 px-3 py-2 rounded-lg font-bold text-sm uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Edit2 size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(promo.id)}
          style={{ backgroundColor: '#e74c3c' }}
          className="flex-1 px-3 py-2 rounded-lg text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

function PromoManagement() {
  const navigate = useNavigate();
  const [promos, setPromos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [displayName, setDisplayName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
        fetchPromos();
      } else {
        navigate('/');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const promosCollection = collection(db, 'promotions');
      const promosSnapshot = await getDocs(query(promosCollection));
      const promosList = promosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromos(promosList);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePromoCode = () => {
    const code = 'PROMO' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      code,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        const promoRef = doc(db, 'promotions', editingPromo.id);
        await updateDoc(promoRef, {
          ...formData,
          discountValue: parseFloat(formData.discountValue),
        });
      } else {
        await addDoc(collection(db, 'promotions'), {
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          createdAt: new Date().toISOString(),
        });
      }
      fetchPromos();
      resetForm();
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      startDate: promo.startDate,
      endDate: promo.endDate,
    });
    setShowForm(true);
  };

  const handleDelete = async (promoId) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deleteDoc(doc(db, 'promotions', promoId));
        fetchPromos();
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
    });
    setEditingPromo(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredPromos = promos.filter((promo) => {
    if (filterStatus === 'active') {
      return new Date(promo.endDate) > new Date();
    } else if (filterStatus === 'expired') {
      return new Date(promo.endDate) <= new Date();
    }
    return true;
  });

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
            Promotion Management
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
        {/* ── Header & Controls ── */}
        <div className="flex items-center justify-between mb-8">
          <h2
            style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '2rem' }}
            className="font-extrabold"
          >
            Promotions ({filteredPromos.length})
          </h2>
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: colors.accent2,
              fontFamily: fonts.montserrat,
              color: colors.primary,
            }}
            className="px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus size={20} /> Create Promo
          </button>
        </div>

        {/* ── Filter ── */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              backgroundColor: filterStatus === 'all' ? colors.accent2 : '#fff',
              color: filterStatus === 'all' ? colors.primary : colors.secondary,
              fontFamily: fonts.montserrat,
              border: `2px solid ${colors.accent2}`,
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm"
          >
            All Promos
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            style={{
              backgroundColor: filterStatus === 'active' ? colors.accent2 : '#fff',
              color: filterStatus === 'active' ? colors.primary : colors.secondary,
              fontFamily: fonts.montserrat,
              border: `2px solid ${colors.accent2}`,
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm"
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('expired')}
            style={{
              backgroundColor: filterStatus === 'expired' ? colors.accent2 : '#fff',
              color: filterStatus === 'expired' ? colors.primary : colors.secondary,
              fontFamily: fonts.montserrat,
              border: `2px solid ${colors.accent2}`,
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm"
          >
            Expired
          </button>
        </div>

        {/* ── Form Modal ── */}
        {showForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={() => showForm && resetForm()}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  style={{ fontFamily: fonts.montserrat, color: colors.primary, fontSize: '1.5rem' }}
                  className="font-extrabold"
                >
                  {editingPromo ? 'Edit Promotion' : 'Create New Promotion'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <InputField
                  label="Promotion Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Sale"
                  required
                />

                <InputField
                  label="Description"
                  type="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the promotion..."
                  required
                />

                <div className="flex items-end gap-3 mb-6">
                  <div className="flex-1">
                    <label
                      style={{ fontFamily: fonts.montserrat, color: colors.primary }}
                      className="block font-bold mb-2"
                    >
                      Promo Code <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g., SUMMER20"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generatePromoCode}
                    style={{ backgroundColor: colors.accent2, color: colors.primary }}
                    className="px-4 py-3 rounded-lg font-bold text-sm uppercase whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      style={{ fontFamily: fonts.montserrat, color: colors.primary }}
                      className="block font-bold mb-2"
                    >
                      Discount Type <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <InputField
                    label="Discount Value"
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />

                  <InputField
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    style={{
                      backgroundColor: colors.primary,
                      fontFamily: fonts.montserrat,
                    }}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                  >
                    {editingPromo ? 'Update Promotion' : 'Create Promotion'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ backgroundColor: colors.bgLight, color: colors.primary, fontFamily: fonts.montserrat }}
                    className="flex-1 px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:shadow-md transition-shadow"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Promos Grid ── */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: colors.secondary, fontFamily: fonts.montserrat }}>Loading promotions...</p>
          </div>
        ) : filteredPromos.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: colors.secondary, fontFamily: fonts.montserrat }}>No promotions found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromos.map((promo) => (
              <PromoCard
                key={promo.id}
                promo={promo}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCopy={handleCopyCode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PromoManagement;
