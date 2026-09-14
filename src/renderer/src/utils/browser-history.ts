const HISTORY_KEY = "ai11y.browser.history";
const FAVORITES_KEY = "ai11y.browser.favorites";
const HISTORY_LIMIT = 5;

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadVisitHistory(): string[] {
  return readList(HISTORY_KEY).slice(0, HISTORY_LIMIT);
}

export function loadFavorites(): string[] {
  return readList(FAVORITES_KEY);
}

export function recordVisit(url: string): string[] {
  const next = url.trim();
  if (!next) return loadVisitHistory();

  const current = loadVisitHistory();
  if (current[0] === next) return current;

  const history = [next, ...current.filter((item) => item !== next)].slice(
    0,
    HISTORY_LIMIT,
  );
  writeList(HISTORY_KEY, history);
  return history;
}

export function isFavorite(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return loadFavorites().includes(trimmed);
}

export function toggleFavorite(url: string): string[] {
  const next = url.trim();
  if (!next) return loadFavorites();

  const current = loadFavorites();
  const favorites = current.includes(next)
    ? current.filter((item) => item !== next)
    : [...current, next];
  writeList(FAVORITES_KEY, favorites);
  return favorites;
}
