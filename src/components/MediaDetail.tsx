import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trash2, Edit3, Check, Calendar } from 'lucide-react';
import { MediaItem, MediaStatus } from '../types';

interface MediaDetailProps {
  item: MediaItem | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  book: '📚 Книга',
  movie: '🎬 Фильм',
  music: '🎵 Музыка',
  game: '🎮 Видеоигра',
};

function getDominantColor(imgUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve('#1a1a2e'); return; }
      ctx.drawImage(img, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    img.onerror = () => resolve('#1a1a2e');
    img.src = imgUrl;
  });
}

export default function MediaDetail({ item, onClose, onUpdate, onDelete }: MediaDetailProps) {
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [editing, setEditing] = useState(false);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editTitle, setEditTitle] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (item?.coverUrl) {
      getDominantColor(item.coverUrl).then(setBgColor);
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      setEditComment(item.comment);
      setEditRating(item.rating);
      setEditTitle(item.title);
      setEditing(false);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onUpdate(item.id, { comment: editComment, rating: editRating, title: editTitle });
    setEditing(false);
  };

  const handleStatusToggle = () => {
    const newStatus: MediaStatus = item.status === 'consumed' ? 'future' : 'consumed';
    onUpdate(item.id, {
      status: newStatus,
      dateConsumed: newStatus === 'consumed' ? new Date().toISOString() : undefined,
    });
  };

  const handleDelete = () => {
    if (confirm('Удалить этот элемент?')) {
      onDelete(item.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Dynamic background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 transition-colors duration-700"
          style={{ backgroundColor: bgColor }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Content */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] mx-4 bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
            {/* Cover */}
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:w-2/5 flex-shrink-0"
            >
              {item.coverUrl ? (
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full flex items-center justify-center bg-gradient-to-br from-violet-900/50 to-indigo-900/50">
                  <span className="text-6xl">
                    {item.category === 'book' ? '📚' : item.category === 'movie' ? '🎬' : item.category === 'music' ? '🎵' : '🎮'}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 p-6"
            >
              {/* Category badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 mb-3">
                {CATEGORY_LABELS[item.category]}
              </span>

              {/* Title */}
              {editing ? (
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="text-2xl font-bold text-white bg-transparent border-b border-white/20 outline-none w-full mb-3"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white mb-3">{item.title}</h2>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => editing && setEditRating(star)}
                    className={`text-xl transition-transform ${editing ? 'hover:scale-125' : ''} ${
                      star <= (editing ? editRating : item.rating) ? 'text-yellow-400' : 'text-white/20'
                    }`}
                  >
                    ★
                  </button>
                ))}
                {item.rating > 0 && !editing && (
                  <span className="text-white/50 text-sm ml-2">{item.rating}/5</span>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={handleStatusToggle}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    item.status === 'consumed'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.status === 'consumed' ? '✓ Впечатлился' : '🔮 На будущее'}
                </button>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-white/40 text-xs mb-4">
                <Calendar size={12} />
                <span>Добавлено: {new Date(item.dateAdded).toLocaleDateString('ru-RU')}</span>
                {item.dateConsumed && (
                  <span className="ml-2">• Потреблено: {new Date(item.dateConsumed).toLocaleDateString('ru-RU')}</span>
                )}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <p className="text-white/50 text-xs mb-2 uppercase tracking-wide">Мои впечатления</p>
                {editing ? (
                  <textarea
                    ref={textareaRef}
                    value={editComment}
                    onChange={e => setEditComment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm outline-none resize-none min-h-[100px] focus:border-violet-500/50"
                    placeholder="Напишите ваши впечатления..."
                  />
                ) : (
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {item.comment || 'Нет комментариев'}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white transition-colors"
                    >
                      <Check size={14} /> Сохранить
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-colors"
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-colors"
                    >
                      <Edit3 size={14} /> Редактировать
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 transition-colors"
                    >
                      <Trash2 size={14} /> Удалить
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
