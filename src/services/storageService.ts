import AsyncStorage from "@react-native-async-storage/async-storage";
import { Person } from "@/types/person";

const CACHE_KEY = "@swapi_people_cache";
const SYNC_KEY = "@swapi_people_last_synced";

export interface CachedData {
  people: Person[];
  lastSynced: string | null;
}

export const storageService = {
  loadCachedPeopleData: async (): Promise<CachedData> => {
    const [cachedData, cachedSync] = await Promise.all([
      AsyncStorage.getItem(CACHE_KEY),
      AsyncStorage.getItem(SYNC_KEY),
    ]);

    if (cachedData) {
      const people = JSON.parse(cachedData) as Person[];
      return { people, lastSynced: cachedSync };
    }

    return { people: [], lastSynced: null };
  },

  savePeopleToCache: async (people: Person[]): Promise<string> => {
    const now = new Date().toISOString();
    await Promise.all([
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(people)),
      AsyncStorage.setItem(SYNC_KEY, now),
    ]);
    return now;
  },

  clearPeopleCache: async (): Promise<void> => {
    await Promise.all([
      AsyncStorage.removeItem(CACHE_KEY),
      AsyncStorage.removeItem(SYNC_KEY),
    ]);
  },
};
