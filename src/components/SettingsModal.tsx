import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cloud, Download, Upload, FolderOpen, Key, Link2 } from 'lucide-react';
import { GoogleDriveSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GoogleDriveSettings;
  onClose: () => void;
  onSave: (settings: Partial<GoogleDriveSettings>) => void;
  onExport: () => void;
  onImport: (json: string) => void;
}

export default function SettingsModal({ isOpen, settings, onClose, onSave, onExport, onImport }: SettingsModalProps) {
  const [folderId, setFolderId] = useState(settings.folderId);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [enabled, setEnabled] = useState(settings.enabled);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({ folderId, apiKey, enabled });
    onClose();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onImport(text);
      onClose();
    };
    reader.readAsText(file);
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
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Cloud size={20} className="text-violet-400" /> Настройки
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
                <X size={18} className="text-white/50" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Google Drive Settings */}
              <div className="space-y-4">
                <h4 className="text-white/80 text-sm font-medium flex items-center gap-2">
                  <Cloud size={16} className="text-blue-400" /> Google Drive
                </h4>
                <p className="text-white/40 text-xs">
                  Настройте интеграцию с Google Drive для хранения обложек. 
                  Сделайте файлы публично доступными по ссылке, затем вставьте ID папки.
                </p>

                <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <span className="text-white/70 text-sm">Включить интеграцию</span>
                  <button
                    onClick={() => setEnabled(!enabled)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      enabled ? 'bg-violet-600' : 'bg-white/20'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white"
                      animate={{ left: enabled ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-white/50 text-xs uppercase tracking-wide mb-2">
                    <FolderOpen size={12} /> ID папки Google Drive
                  </label>
                  <input
                    value={folderId}
                    onChange={e => setFolderId(e.target.value)}
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors placeholder:text-white/20 text-sm"
                  />
                  <p className="text-white/30 text-xs mt-1">
                    ID находится в URL папки: drive.google.com/drive/folders/<strong>ID</strong>
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-white/50 text-xs uppercase tracking-wide mb-2">
                    <Key size={12} /> API ключ (опционально)
                  </label>
                  <input
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="AIza..."
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/50 transition-colors placeholder:text-white/20 text-sm"
                  />
                  <p className="text-white/30 text-xs mt-1">
                    Нужен для программного доступа к файлам. Получите в Google Cloud Console.
                  </p>
                </div>

                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                  <p className="text-violet-300 text-xs leading-relaxed">
                    💡 <strong>Совет:</strong> Вы также можете просто вставлять прямые ссылки на обложки 
                    при добавлении медиа. Формат для Google Drive:
                  </p>
                  <code className="block mt-2 text-violet-400/80 text-xs bg-black/30 rounded p-2 break-all">
                    https://lh3.googleusercontent.com/d/FILE_ID
                  </code>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5" />

              {/* Data management */}
              <div className="space-y-4">
                <h4 className="text-white/80 text-sm font-medium flex items-center gap-2">
                  <Download size={16} className="text-green-400" /> Данные
                </h4>

                <div className="flex gap-3">
                  <button
                    onClick={onExport}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm transition-colors border border-white/10"
                  >
                    <Download size={16} /> Экспорт JSON
                  </button>
                  <button
                    onClick={handleImport}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 text-sm transition-colors border border-white/10"
                  >
                    <Upload size={16} /> Импорт JSON
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs leading-relaxed">
                  <Link2 size={12} className="inline mr-1" />
                  Данные хранятся локально в вашем браузере (localStorage). 
                  Используйте экспорт для создания резервных копий.
                </p>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all shadow-lg shadow-violet-600/20"
              >
                Сохранить настройки
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
