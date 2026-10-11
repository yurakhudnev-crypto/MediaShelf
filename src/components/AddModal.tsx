import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, MessageSquare } from 'lucide-react';
import { MediaCategory, MediaStatus } from '../types';

interface AddModalProps {
  isOpen: boolean;
  category: MediaCategory | null;
  onClose: () => void;
  onAdd: (data: {
    title: string;
    category: MediaCategory;
    coverUrl: string;
    comment: string;
    status: MediaStatus;
    rating: number;
  }) => void;
}

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  book: '📚 Книга',
  movie: '🎬 Фильм',
  music: '🎵 Музыка',
  game: '🎮 Видеоигра',
};

export default function AddModal({ isOpen, category, onClose, onAdd }: AddModalProps) {
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<MediaStatus>('consumed');

  if (!category) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      category,
      coverUrl: coverUrl.trim(),
      comment: comment.trim(),
      status,
      rating,
    });
    setTitle('');
    setCoverUrl('');
    setComment('');
    setRating(0);
    setStatus('consumed');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="relative z-10 w-full max-w-lg mx-4 bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Добавить: {CATEGORY_LABELS[category]}
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
                <X size={18} className="text-white/50" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wide mb-2">Название *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Введите название..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors placeholder:text-white/20"
                />
              </div>

              {/* Cover URL */}
              <div>
                <label className="flex items-center gap-1 text-white/50 text-xs uppercase tracking-wide mb-2">
                  <Link size={12} /> Ссылка на обложку
                </label>
                <input
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  placeholder="https://drive.google.com/... или другой URL"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors placeholder:text-white/20 text-sm"
                />
                {coverUrl && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={coverUrl}
                      alt="Preview"
                      className="max-h-32 rounded-lg border border-white/10 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wide mb-2">Статус</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus('consumed')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      status === 'consumed'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}
                  >
                    ✓ Впечатлился
                  </button>
                  <button
                    onClick={() => setStatus('future')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      status === 'future'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}
                  >
                    🔮 На будущее
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wide mb-2">Оценка</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star === rating ? 0 : star)}
                      className={`text-2xl transition-transform hover:scale-125 ${
                        star <= rating ? 'text-yellow-400' : 'text-white/20'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  {rating > 0 && <span className="text-white/50 text-sm ml-2">{rating}/5</span>}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="flex items-center gap-1 text-white/50 text-xs uppercase tracking-wide mb-2">
                  <MessageSquare size={12} /> Впечатления / комментарии
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Ваши мысли о произведении..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors resize-none placeholder:text-white/20"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all shadow-lg shadow-violet-600/20"
              >
                Добавить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
