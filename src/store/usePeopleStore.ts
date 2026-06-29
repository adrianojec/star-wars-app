import { Person } from "@/types/person";
import { apiService } from "@/services/apiService";
import { storageService } from "@/services/storageService";
import { create } from "zustand";

interface PeopleState {
  people: Person[];
  loading: boolean;
  error: string | null;
  isOfflineMode: boolean;
  lastSynced: string | null;
  fetchPeople: (forceRefresh?: boolean) => Promise<void>;
  loadCachedPeople: () => Promise<boolean>;
  clearCache: () => Promise<void>;
}

export const usePeopleStore = create<PeopleState>((set, get) => ({
  people: [],
  loading: false,
  error: null,
  isOfflineMode: false,
  lastSynced: null,

  loadCachedPeople: async () => {
    try {
      const { people, lastSynced } = await storageService.loadCachedPeopleData();
      
      if (people.length > 0) {
        set({
          people,
          lastSynced,
          error: null,
        });
        return true;
      }

      return false;
    } catch (e) {
      console.error("Failed to load cached people:", e);
      return false;
    }
  },

  fetchPeople: async (forceRefresh = false) => {
    const { people: currentPeople } = get();

    if (!forceRefresh && currentPeople.length > 0) {
      return;
    }

    set({ loading: true, error: null });

    const hasCache = await get().loadCachedPeople();

    try {
      const mappedPeople = await apiService.fetchPeopleFromApi();
      const lastSynced = await storageService.savePeopleToCache(mappedPeople);

      set({
        people: mappedPeople,
        lastSynced,
        isOfflineMode: false,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn("API fetch failed:", err.message);

      if (hasCache || get().people.length > 0) {
        set({
          isOfflineMode: true,
          loading: false,
          error: null,
        });
      } else {
        set({
          isOfflineMode: true,
          loading: false,
          error:
            "Unable to connect to the Star Wars Archives. Please check your connection and try again.",
        });
      }
    }
  },

  clearCache: async () => {
    try {
      await storageService.clearPeopleCache();
      set({ people: [], lastSynced: null, isOfflineMode: false });
    } catch (e) {
      console.error("Failed to clear cache:", e);
    }
  },
}));
