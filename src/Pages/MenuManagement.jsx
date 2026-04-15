import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit2, X, ArrowLeft, Upload } from 'lucide-react';
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

const categories = [
  { id: 1, name: 'Plates' },
  { id: 2, name: 'Wraps' },
  { id: 3, name: 'Box' },
  { id: 4, name: 'Burgers' },
];

const InputField = ({ label, type = 'text', value, onChange, placeholder, required }) => (
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
    ) : type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
      >
        <option value="">Select {label}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#A8C5A0]"
      />
    )}
  </div>
);

const MenuItemCard = ({ item, onEdit, onDelete }) => (
  <div
    className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    style={{ backgroundColor: '#fff' }}
  >
    <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
      {item.image ? (
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.bgLight }}>
          <span style={{ color: colors.secondary }}>No image</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold mb-2">
        {item.name}
      </h3>
      <p style={{ color: colors.secondary, fontSize: '0.9rem' }} className="mb-3 line-clamp-2">
        {item.description}
      </p>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontFamily: fonts.montserrat, color: colors.primary }} className="font-bold text-lg">
          ${item.price}
        </span>
        <span style={{ color: colors.secondary, fontSize: '0.85rem' }}>
          ⭐ {item.rating}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          style={{ backgroundColor: colors.accent2, color: colors.primary }}
          className="flex-1 px-3 py-2 rounded-lg font-bold text-sm uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Edit2 size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          style={{ backgroundColor: '#e74c3c' }}
          className="flex-1 px-3 py-2 rounded-lg text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  </div>
);

function MenuManagement() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [displayName, setDisplayName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    rating: '4.5',
    reviews: '0',
    image: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
        fetchMenuItems();
      } else {
        navigate('/');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const menuCollection = collection(db, 'menuItems');
      const menuSnapshot = await getDocs(menuCollection);
      const items = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const itemRef = doc(db, 'menuItems', editingItem.id);
        await updateDoc(itemRef, {
          ...formData,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          reviews: parseInt(formData.reviews),
        });
      } else {
        await addDoc(collection(db, 'menuItems'), {
          ...formData,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          reviews: parseInt(formData.reviews),
        });
      }
      fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      rating: item.rating.toString(),
      reviews: item.reviews.toString(),
      image: item.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', itemId));
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      rating: '4.5',
      reviews: '0',
      image: '',
    });
    setEditingItem(null);
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

  const filteredItems = filterCategory === 'all' 
    ? menuItems 
    : menuItems.filter((item) => item.category === parseInt(filterCategory));

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
            Menu Management
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
            Menu Items ({filteredItems.length})
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
            <Plus size={20} /> Add Item
          </button>
        </div>

        {/* ── Filter ── */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setFilterCategory('all')}
            style={{
              backgroundColor: filterCategory === 'all' ? colors.accent2 : '#fff',
              color: filterCategory === 'all' ? colors.primary : colors.secondary,
              fontFamily: fonts.montserrat,
              border: `2px solid ${colors.accent2}`,
            }}
            className="px-4 py-2 rounded-lg font-bold text-sm"
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id.toString())}
              style={{
                backgroundColor: filterCategory === cat.id.toString() ? colors.accent2 : '#fff',
                color: filterCategory === cat.id.toString() ? colors.primary : colors.secondary,
                fontFamily: fonts.montserrat,
                border: `2px solid ${colors.accent2}`,
              }}
              className="px-4 py-2 rounded-lg font-bold text-sm"
            >
              {cat.name}
            </button>
          ))}
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
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
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
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Shish Kebab"
                  required
                />

                <InputField
                  label="Category"
                  type="select"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Price ($)"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    step="0.01"
                  />
                  <InputField
                    label="Rating"
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="4.5"
                    required
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <InputField
                  label="Number of Reviews"
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                  min="0"
                />

                <InputField
                  label="Description"
                  type="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the item..."
                  required
                />

                <InputField
                  label="Image URL"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    style={{
                      backgroundColor: colors.primary,
                      fontFamily: fonts.montserrat,
                    }}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
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

        {/* ── Menu Items Grid ── */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: colors.secondary, fontFamily: fonts.montserrat }}>Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: colors.secondary, fontFamily: fonts.montserrat }}>No menu items found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuManagement;
