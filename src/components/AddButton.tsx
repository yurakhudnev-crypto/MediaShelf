import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, BookOpen, Film, Music, Gamepad2 } from 'lucide-react';
import { MediaCategory } from '../types';

interface AddButtonProps {
  onAdd: (category: MediaCategory) => void;
  onSettings: () => void;
}

const CATEGORIES: { key: MediaCategory; icon: React.ReactNode; label: string; color: string }[] = [
  { key: 'book', icon: <BookOpen size={18} />, label: 'Книга', color: 'from-emerald-500 to-teal-600' },
  { key: 'movie', icon: <Film size={18} />, label: 'Фильм', color: 'from-rose-500 to-pink-600' },
  { key: 'music', icon: <Music size={18} />, label: 'Музыка', color: 'from-violet-500 to-purple-600' },
  { key: 'game', icon: <Gamepad2 size={18} />, label: 'Игра', color: 'from-blue-500 to-cyan-600' },
];

export default function AddButton({ onAdd, onSettings }: AddButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-2 mb-3 bg-[#1a1a1a]/95 backdrop-blur-xl rounded-full px-4 py-3 border border-white/10 shadow-2xl"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { onAdd(cat.key); setExpanded(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r ${cat.color} text-white text-xs font-medium hover:scale-105 transition-transform shadow-lg`}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main island */}
      <motion.div
        className="flex items-center gap-2 bg-[#1a1a1a]/95 backdrop-blur-xl rounded-full px-2 py-2 border border-white/10 shadow-2xl shadow-violet-500/10"
        animate={{ scale: expanded ? 0.95 : 1 }}
      >
        {/* Settings button */}
        <button
          onClick={onSettings}
          className="p-2.5 rounded-full hover:bg-white/5 transition-colors"
          title="Настройки"
        >
          <Settings size={18} className="text-white/50 hover:text-white/80" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Add button */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-full transition-all duration-300 ${
            expanded
              ? 'bg-red-500 rotate-45'
              : 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30'
          }`}
        >
          <Plus size={20} className="text-white" />
        </motion.button>
      </motion.div>
    </div>
  );
}
