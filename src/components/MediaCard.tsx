import { motion } from 'framer-motion';
import { MediaItem } from '../types';

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  book: '📚',
  movie: '🎬',
  music: '🎵',
  game: '🎮',
};

export default function MediaCard({ item, index, onClick }: MediaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer break-inside-avoid mb-3"
    >
      <div className="relative rounded-xl overflow-hidden bg-white/5 shadow-lg hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:scale-[1.02]">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-violet-900/50 to-indigo-900/50">
            <span className="text-4xl">{CATEGORY_ICONS[item.category]}</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-medium truncate">{item.title}</p>
            <div className="flex items-center gap-1 mt-1">
              {item.rating > 0 && (
                <span className="text-yellow-400 text-xs">{'★'.repeat(item.rating)}</span>
              )}
              <span className="text-white/50 text-xs">{CATEGORY_ICONS[item.category]}</span>
            </div>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
          {CATEGORY_ICONS[item.category]}
        </div>

        {/* Status indicator */}
        {item.status === 'future' && (
          <div className="absolute top-2 left-2 bg-amber-500/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white font-medium">
            На будущее
          </div>
        )}
      </div>
    </motion.div>
  );
}
