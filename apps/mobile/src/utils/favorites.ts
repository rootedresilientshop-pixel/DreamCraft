import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favoriteIdeas';

export const getFavorites = async (): Promise<string[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
};

export const addFavorite = async (ideaId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(ideaId)) {
      favorites.push(ideaId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (err) {
    console.error('Error adding favorite:', err);
  }
};

export const removeFavorite = async (ideaId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((id) => id !== ideaId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error removing favorite:', err);
  }
};

export const isFavorite = async (ideaId: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(ideaId);
};
