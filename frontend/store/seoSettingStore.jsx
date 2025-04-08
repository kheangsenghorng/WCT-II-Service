import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSeoSettingsStore = create((set, get) => ({
  seoSettings: [],
  currentSetting: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/seo-settings`);
      set({ seoSettings: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOne: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/seo-settings/${id}`);
      set({ currentSetting: res.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  createSetting: async (data) => {
    set({ loading: true, error: null });
    try {
      await axios.post("/api/seo-settings", data);
      get().fetchAll();
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateSetting: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/api/seo-settings/${id}`, data);
      get().fetchAll();
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteSetting: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/seo-settings/${id}`);
      get().fetchAll();
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
