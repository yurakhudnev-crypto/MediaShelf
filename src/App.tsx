import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import MediaGrid from './components/MediaGrid';
import MediaDetail from './components/MediaDetail';
import AddButton from './components/AddButton';
import AddModal from './components/AddModal';
import SettingsModal from './components/SettingsModal';
import { useMediaStore } from './hooks/useMediaStore';
import { MediaItem, MediaCategory, MediaStatus, CategoryFilter } from './types';

export default function App() {
  const { items, settings, addItem, updateItem, deleteItem, updateSettings, exportData, importData } = useMediaStore();
  
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<MediaStatus>('consumed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addCategory, setAddCategory] = useState<MediaCategory | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Status filter
    filtered = filtered.filter(item => item.status === statusFilter);

    // Category filter
    if (activeCategory === 'future') {
      filtered = filtered.filter(item => item.status === 'future');
    } else if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.comment.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [items, activeCategory, statusFilter, searchQuery]);

  const handleAddClick = (category: MediaCategory) => {
    setAddCategory(category);
    setAddModalOpen(true);
  };

  const handleAdd = (data: {
    title: string;
    category: MediaCategory;
    coverUrl: string;
    comment: string;
    status: MediaStatus;
    rating: number;
  }) => {
    addItem(data);
  };

  const stats = useMemo(() => ({
    total: items.length,
    consumed: items.filter(i => i.status === 'consumed').length,
    future: items.filter(i => i.status === 'future').length,
  }), [items]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Stats bar */}
      <div className="pt-[110px] pb-4 px-4">
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span>Всего: <strong className="text-white/60">{stats.total}</strong></span>
          <span>•</span>
          <span>Потреблено: <strong className="text-green-400/70">{stats.consumed}</strong></span>
          <span>•</span>
          <span>На будущее: <strong className="text-amber-400/70">{stats.future}</strong></span>
          {filteredItems.length !== items.length && (
            <>
              <span>•</span>
              <span>Показано: <strong className="text-violet-400/70">{filteredItems.length}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${statusFilter}-${searchQuery}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MediaGrid items={filteredItems} onItemClick={setSelectedItem} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating action button */}
      <AddButton
        onAdd={handleAddClick}
        onSettings={() => setSettingsOpen(true)}
      />

      {/* Add Modal */}
      <AddModal
        isOpen={addModalOpen}
        category={addCategory}
        onClose={() => { setAddModalOpen(false); setAddCategory(null); }}
        onAdd={handleAdd}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={updateSettings}
        onExport={exportData}
        onImport={importData}
      />

      {/* Detail View */}
      <AnimatePresence>
        {selectedItem && (
          <MediaDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onUpdate={(id, updates) => {
              updateItem(id, updates);
              setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
            }}
            onDelete={deleteItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
