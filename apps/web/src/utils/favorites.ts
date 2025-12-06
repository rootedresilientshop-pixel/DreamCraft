const FAVORITES_KEY = 'favoriteIdeas';

export const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
};

export const addFavorite = (ideaId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(ideaId)) {
    favorites.push(ideaId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (ideaId: string): void => {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== ideaId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const isFavorite = (ideaId: string): boolean => {
  return getFavorites().includes(ideaId);
};
