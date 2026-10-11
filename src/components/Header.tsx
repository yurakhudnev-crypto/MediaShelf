import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { CategoryFilter, MediaStatus } from '../types';

interface HeaderProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  statusFilter: MediaStatus;
  onStatusChange: (status: MediaStatus) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: 'future', label: '📌 На будущее' },
  { key: 'all', label: '✨ Все' },
  { key: 'book', label: '📚 Книги' },
  { key: 'movie', label: '🎬 Фильмы' },
  { key: 'music', label: '🎵 Музыка' },
  { key: 'game', label: '🎮 Игры' },
];

export default function Header({
  activeCategory,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = CATEGORIES.findIndex(c => c.key === activeCategory);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
      {/* Status filter + Search */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5">
          <button
            onClick={() => onStatusChange('consumed')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'consumed'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            ✓ Впечатлился
          </button>
          <button
            onClick={() => onStatusChange('future')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'future'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            🔮 На будущее
          </button>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              className="flex items-center bg-white/10 rounded-full overflow-hidden"
            >
              <Search size={14} className="ml-3 text-white/50" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Поиск..."
                className="bg-transparent text-sm text-white px-2 py-1.5 outline-none w-full placeholder:text-white/30"
              />
              <button onClick={() => { setSearchOpen(false); onSearchChange(''); }} className="pr-3">
                <X size={14} className="text-white/50" />
              </button>
            </motion.div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-white/5">
              <Search size={18} className="text-white/70" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide px-4 gap-1 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Active indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-violet-500 rounded-full"
          animate={{
            left: `${Math.max(0, activeIndex * 90 + 16)}px`,
            width: '80px',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </header>
  );
}
