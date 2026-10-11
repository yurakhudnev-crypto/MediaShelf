import { MediaItem } from '../types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
}

export default function MediaGrid({ items, onItemClick }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-white/40 text-lg text-center">Пока пусто</p>
        <p className="text-white/25 text-sm text-center mt-2">
          Нажмите «+» внизу, чтобы добавить медиа
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 px-3">
      {items.map((item, index) => (
        <MediaCard
          key={item.id}
          item={item}
          index={index}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
