import { useState, useEffect, useCallback } from 'react';
import { MediaItem, MediaCategory, MediaStatus, GoogleDriveSettings } from '../types';

const STORAGE_KEY = 'mediashelf_items';
const SETTINGS_KEY = 'mediashelf_settings';

const DEMO_ITEMS: MediaItem[] = [
  {
    id: 'demo-1',
    title: 'Дюна: Часть вторая',
    category: 'movie',
    coverUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7S.jpg',
    comment: 'Потрясающий визуальный опыт. Дени Вильнёв превзошёл себя.',
    status: 'consumed',
    rating: 5,
    dateAdded: '2024-03-15T10:00:00Z',
    dateConsumed: '2024-03-10T20:00:00Z',
  },
  {
    id: 'demo-2',
    title: 'Проект "Аве Мария"',
    category: 'book',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1611878491i/54493401.jpg',
    comment: 'Лучшая научная фантастика, что я читал за последние годы!',
    status: 'consumed',
    rating: 5,
    dateAdded: '2024-02-20T10:00:00Z',
    dateConsumed: '2024-02-28T18:00:00Z',
  },
  {
    id: 'demo-3',
    title: 'Baldur\'s Gate 3',
    category: 'game',
    coverUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/1811/f5b68a9e9d1c16b7fc38b2e0f4a2d81f6e3c59c8d4e7a1b2.png',
    comment: 'Шедевр. 200 часов и мало.',
    status: 'consumed',
    rating: 5,
    dateAdded: '2024-01-10T10:00:00Z',
    dateConsumed: '2024-04-01T22:00:00Z',
  },
  {
    id: 'demo-4',
    title: 'Radiohead — OK Computer',
    category: 'music',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/OKComputer.jpg',
    comment: 'Абсолютная классика. Каждый трек — шедевр.',
    status: 'consumed',
    rating: 5,
    dateAdded: '2024-01-05T10:00:00Z',
    dateConsumed: '2024-01-05T12:00:00Z',
  },
  {
    id: 'demo-5',
    title: 'Oppenheimer',
    category: 'movie',
    coverUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    comment: 'Нолан на высоте. Киллиан Мёрфи невероятен.',
    status: 'consumed',
    rating: 4,
    dateAdded: '2024-01-20T10:00:00Z',
    dateConsumed: '2024-01-22T21:00:00Z',
  },
  {
    id: 'demo-6',
    title: 'The Name of the Wind',
    category: 'book',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1279359461i/186074.jpg',
    comment: '',
    status: 'future',
    rating: 0,
    dateAdded: '2024-04-01T10:00:00Z',
  },
  {
    id: 'demo-7',
    title: 'Hollow Knight: Silksong',
    category: 'game',
    coverUrl: '',
    comment: 'Жду с нетерпением!',
    status: 'future',
    rating: 0,
    dateAdded: '2024-03-20T10:00:00Z',
  },
  {
    id: 'demo-8',
    title: 'Pink Floyd — The Dark Side of the Moon',
    category: 'music',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png',
    comment: '',
    status: 'consumed',
    rating: 5,
    dateAdded: '2024-02-01T10:00:00Z',
    dateConsumed: '2024-02-01T11:30:00Z',
  },
];

function loadItems(): MediaItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    // First launch - save demo items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ITEMS));
    return DEMO_ITEMS;
  } catch {
    return DEMO_ITEMS;
  }
}

function saveItems(items: MediaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadSettings(): GoogleDriveSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { enabled: false, folderId: '', apiKey: '' };
  } catch {
    return { enabled: false, folderId: '', apiKey: '' };
  }
}

function saveSettings(settings: GoogleDriveSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useMediaStore() {
  const [items, setItems] = useState<MediaItem[]>(loadItems);
  const [settings, setSettingsState] = useState<GoogleDriveSettings>(loadSettings);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const addItem = useCallback((item: Omit<MediaItem, 'id' | 'dateAdded'>) => {
    const newItem: MediaItem = {
      ...item,
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      dateAdded: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<MediaItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GoogleDriveSettings>) => {
    setSettingsState(prev => ({ ...prev, ...newSettings }));
  }, []);

  const exportData = useCallback(() => {
    const data = JSON.stringify({ items, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediashelf-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [items, settings]);

  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.items) setItems(data.items);
      if (data.settings) setSettingsState(data.settings);
    } catch (e) {
      console.error('Import error:', e);
    }
  }, []);

  return {
    items,
    settings,
    addItem,
    updateItem,
    deleteItem,
    updateSettings,
    exportData,
    importData,
  };
}
