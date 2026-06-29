import { Person } from "@/types/person";

const API_URL = "https://swapi.info/api/people";

const extractId = (url: string): string => {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || Math.random().toString();
};

export const apiService = {
  fetchPeopleFromApi: async (): Promise<Person[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid API response format");
    }

    return data.map((item: any) => ({
      ...item,
      id: extractId(item.url),
    }));
  },
};
