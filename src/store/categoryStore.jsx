import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ── helpers ──────────────────────────────────────────────────────────────────
const authConfig = (extra = {}) => {
  const token = useAuthStore.getState().getBearerToken();
  return {
    withCredentials: true,
    ...extra,
    headers: {
      ...(extra.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// ── store ─────────────────────────────────────────────────────────────────────
const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  // ── fetch all ──────────────────────────────────────────────────────────────
  fetchCategories: async () => {
    // Guard: don't re-fetch while already loading
    if (get().isLoading) return { success: false, error: "Already loading" };

    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/categories`, authConfig());
      if (res.data?.success) {
        set({ categories: res.data.data || [], isLoading: false });
        return { success: true, data: res.data.data };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch categories";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── create ─────────────────────────────────────────────────────────────────
  createCategory: async ({ title, categoryIcon }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${API_URL}/categories/create-category`,
        { title, categoryIcon: categoryIcon || null },
        authConfig(),
      );
      if (res.data?.success) {
        // Append to existing list without full refetch
        const newCat = res.data.data;
        set((state) => ({
          categories: [newCat, ...state.categories],
          isLoading: false,
        }));
        return { success: true, data: newCat };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create category";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── update ─────────────────────────────────────────────────────────────────
  updateCategory: async (id, { title, categoryIcon }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.patch(
        `${API_URL}/categories/update-category/${id}`,
        { title, categoryIcon },
        authConfig(),
      );
      if (res.data?.success) {
        const updated = res.data.data;
        set((state) => ({
          categories: state.categories.map((c) =>
            c._id === id || c.jobCategoryId === id ? { ...c, ...updated } : c,
          ),
          isLoading: false,
        }));
        return { success: true, data: updated };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update category";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // ── toggle visibility ──────────────────────────────────────────────────────
  toggleCategoryStatus: async (id, isActive) => {
    try {
      const res = await axios.patch(
        `${API_URL}/categories/hide-category/${id}`,
        { isActive },
        authConfig(),
      );
      if (res.data?.success) {
        set((state) => ({
          categories: state.categories.map((c) =>
            c._id === id || c.jobCategoryId === id ? { ...c, isActive } : c,
          ),
        }));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update status";
      set({ error: message });
      return { success: false, error: message };
    }
  },

  // ── delete ─────────────────────────────────────────────────────────────────
  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(
        `${API_URL}/categories/delete-category/${id}`,
        authConfig(),
      );
      if (res.data?.success) {
        set((state) => ({
          categories: state.categories.filter(
            (c) => c._id !== id && c.jobCategoryId !== id,
          ),
          isLoading: false,
        }));
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete category";
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useCategoryStore;
