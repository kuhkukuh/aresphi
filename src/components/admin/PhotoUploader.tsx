'use client';

import { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import type { Property } from '@/lib/admin-hooks';
import { appToast } from '@/lib/toast';

const MAX_PHOTOS = 10;
const MAX_RAW_SIZE = 20 * 1024 * 1024; // 20MB
const COMPRESS_SKIP_THRESHOLD = 300 * 1024; // 300KB
const CONCURRENCY = 3;
const ACCEPTED_TYPES = { 'image/jpeg': [], 'image/png': [], 'image/webp': [] };

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'compressing' | 'uploading' | 'error';
  error?: string;
}

interface PhotoUploaderProps {
  photos: Property['photos'];
  pendingPhotos: string[];
  onUploadFile: (file: File) => Promise<void>;
  onDeletePhoto: (photoId: number | null, photoUrl?: string) => Promise<void>;
}

async function compressFile(file: File): Promise<File> {
  if (file.size <= COMPRESS_SKIP_THRESHOLD) return file;
  try {
    return await imageCompression(file, {
      maxWidthOrHeight: 1920,
      maxSizeMB: 1,
      useWebWorker: true,
      preserveExif: true,
    });
  } catch (err) {
    console.error('Compression failed, uploading original file', err);
    return file;
  }
}

export default function PhotoUploader({ photos, pendingPhotos, onUploadFile, onDeletePhoto }: PhotoUploaderProps) {
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const currentCount = photos.length + pendingPhotos.length + queue.filter((q) => q.status !== 'error').length;
  const remainingSlots = Math.max(0, MAX_PHOTOS - currentCount);

  const processFile = useCallback(
    async (item: UploadItem) => {
      try {
        const compressed = await compressFile(item.file);
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading' } : q)));
        await onUploadFile(compressed);
        setQueue((prev) => prev.filter((q) => q.id !== item.id));
        URL.revokeObjectURL(item.previewUrl);
      } catch (err) {
        console.error('Upload failed', err);
        appToast.error('Gagal mengunggah foto', { description: item.file.name });
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: 'Gagal mengunggah' } : q))
        );
      }
    },
    [onUploadFile]
  );

  const enqueueFiles = useCallback(
    (files: File[]) => {
      const items: UploadItem[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'compressing',
      }));
      setQueue((prev) => [...prev, ...items]);

      (async () => {
        for (let i = 0; i < items.length; i += CONCURRENCY) {
          const chunk = items.slice(i, i + CONCURRENCY);
          await Promise.allSettled(chunk.map((item) => processFile(item)));
        }
      })();
    },
    [processFile]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setMessage(null);

      if (fileRejections.length > 0) {
        setMessage(`${fileRejections.length} file ditolak (format harus JPEG/PNG/WebP, maks. 20MB)`);
      }

      if (remainingSlots <= 0) {
        setMessage(`Maksimal ${MAX_PHOTOS} foto per properti`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);
      if (acceptedFiles.length > remainingSlots) {
        setMessage(`Hanya ${remainingSlots} foto ditambahkan (maksimal ${MAX_PHOTOS} foto per properti)`);
      }

      if (filesToUpload.length > 0) {
        enqueueFiles(filesToUpload);
      }
    },
    [remainingSlots, enqueueFiles]
  );

  const retryItem = useCallback(
    (id: string) => {
      const item = queue.find((q) => q.id === id);
      if (!item) return;
      setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'compressing', error: undefined } : q)));
      processFile(item);
    },
    [queue, processFile]
  );

  const removeQueueItem = useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((q) => q.id !== id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_RAW_SIZE,
    multiple: true,
    disabled: remainingSlots <= 0,
    onDrop,
  });

  return (
    <div>
      {message && <p className="text-xs text-red-500 mb-2">{message}</p>}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="thumb relative aspect-square rounded-lg overflow-hidden group">
            <img src={photo.url} alt={photo.alt || `Foto ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onDeletePhoto(photo.id)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/70 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Hapus foto"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {pendingPhotos.map((url, idx) => (
          <div key={url} className="thumb relative aspect-square rounded-lg overflow-hidden group">
            <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onDeletePhoto(null, url)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/70 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Hapus foto"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {queue.map((item) => (
          <div key={item.id} className="thumb relative aspect-square rounded-lg overflow-hidden bg-stone-100">
            <img src={item.previewUrl} alt="Mengunggah" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              {item.status === 'error' ? (
                <>
                  <span className="text-[9px] text-red-600 uppercase tracking-wider px-1 text-center">
                    {item.error}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => retryItem(item.id)}
                      className="text-[9px] uppercase tracking-wider text-orange underline"
                    >
                      Coba lagi
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQueueItem(item.id)}
                      className="text-[9px] uppercase tracking-wider text-stone-500 underline"
                    >
                      Hapus
                    </button>
                  </div>
                </>
              ) : (
                <span className="text-[9px] uppercase tracking-wider text-stone-600">
                  {item.status === 'compressing' ? 'Memproses...' : 'Mengunggah...'}
                </span>
              )}
            </div>
          </div>
        ))}

        {remainingSlots > 0 && (
          <div
            {...getRootProps()}
            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
              isDragActive
                ? 'border-orange text-orange bg-orange/5'
                : 'border-stone-300 text-stone-400 hover:border-orange hover:text-orange'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[9px] uppercase tracking-wider">Tambah</span>
          </div>
        )}
      </div>
    </div>
  );
}
