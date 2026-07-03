# Property Photo Uploader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the admin property form's bare `<input type="file">` uploader with a drag-and-drop uploader (react-dropzone) that compresses images client-side (browser-image-compression) before upload, capped at 10 photos per property.

**Architecture:** A new self-contained `PhotoUploader` component owns the dropzone, per-file compression, per-file upload progress/error/retry state, and the thumbnail grid. It replaces the equivalent inline JSX and handlers in `PropertiesTab.tsx`. The parent (`PropertiesTab.tsx`) keeps owning persisted state (`pendingPhotos`, the property's saved `photos`) and passes a single `onUploadFile` callback that does the actual network upload + association, matching the existing mutation flow. The 10-photo cap is enforced both in `PhotoUploader` (UX) and in the `POST /api/admin/properties/[id]/photos` route (authoritative).

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript (strict) + TanStack Query + Drizzle ORM/Neon + Vercel Blob. New deps: `react-dropzone@15`, `browser-image-compression@2`. No test framework exists in this repo — verification is `npx tsc --noEmit`, `npm run lint`, and manual checks via `npm run dev`.

## Global Constraints

- Max 10 photos per property, enforced client-side (`PhotoUploader`) and server-side (`POST /api/admin/properties/[id]/photos`).
- Accepted image types: `image/jpeg`, `image/png`, `image/webp` (matches existing server-side allowlist).
- Raw file size cap before compression: 20MB.
- Compression: `browser-image-compression`, `maxWidthOrHeight: 1920`, `maxSizeMB: 1`, `useWebWorker: true`, preserve EXIF orientation. Skip compression for files already ≤300KB. On compression failure, fall back to uploading the original file.
- Upload concurrency cap: 3 files in flight at once.
- Per-file upload failure shows inline error + retry, does not block other files.
- Storage stays on Vercel Blob via the existing `/api/admin/photos` and `/api/admin/properties/[id]/photos` routes — no backend/storage changes beyond the count check.
- `HeroTab.tsx`'s uploader and photo reordering are out of scope — not touched.
- No automated test suite exists in this repo (confirmed: no jest/vitest, no `*.test.*` files, no test script in `package.json`). Verification per task is `npx tsc --noEmit` (strict mode is on) plus `npm run lint`; end-to-end behavior is verified manually via `npm run dev` in the final task.

---

### Task 1: Install uploader and compression dependencies

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)

**Interfaces:**
- Produces: `react-dropzone` (`useDropzone` hook) and `browser-image-compression` (default export `imageCompression`) available for import in later tasks.

- [ ] **Step 1: Install the packages**

Run: `npm install react-dropzone@15.0.0 browser-image-compression@2.0.2`

- [ ] **Step 2: Verify they're in `package.json` dependencies**

Run: `grep -E "react-dropzone|browser-image-compression" package.json`
Expected: two lines showing both packages under `dependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-dropzone and browser-image-compression"
```

---

### Task 2: Enforce the 10-photo cap server-side

**Files:**
- Modify: `src/app/api/admin/properties/[id]/photos/route.ts`

**Interfaces:**
- Consumes: `propertyPhotos` table (`src/infrastructure/database/schema.ts`), `db` from `@/infrastructure/database`, `eq`, `sql` from `drizzle-orm` (all already imported in this file).
- Produces: `POST /api/admin/properties/:id/photos` now returns `400 { error: 'Maksimal 10 foto per properti' }` when the property already has 10 photos, before any insert happens. Behavior for counts 0-9 is unchanged (still `201` with the inserted photo row).

- [ ] **Step 1: Read the current file to confirm line numbers before editing**

Run: `cat -n src/app/api/admin/properties/\[id\]/photos/route.ts`

- [ ] **Step 2: Add the count check before the `maxOrder` query**

Replace the body of the `try` block in `src/app/api/admin/properties/[id]/photos/route.ts` (currently lines 16-38) with:

```ts
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    const body = await request.json();
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, propertyId));

    if (Number(count) >= 10) {
      return NextResponse.json({ error: 'Maksimal 10 foto per properti' }, { status: 400 });
    }

    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(display_order), -1)` })
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, propertyId));

    const [photo] = await db
      .insert(propertyPhotos)
      .values({
        propertyId,
        url,
        alt: alt || '',
        displayOrder: (maxOrder?.max ?? -1) + 1,
      })
      .returning();

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Add photo error:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/properties/\[id\]/photos/route.ts
git commit -m "feat: enforce 10-photo max server-side on property photo association"
```

---

### Task 3: Build the `PhotoUploader` component

**Files:**
- Create: `src/components/admin/PhotoUploader.tsx`

**Interfaces:**
- Consumes: `Property` type from `@/lib/admin-hooks` (for `Property['photos']` shape: `{ id: number; url: string; alt: string }[]`); `appToast` from `@/lib/toast` (`appToast.error(title: string, options?: { description?: string })`, already used elsewhere in the admin UI).
- Produces:
  ```ts
  interface PhotoUploaderProps {
    photos: { id: number; url: string; alt: string }[];
    pendingPhotos: string[];
    onUploadFile: (file: File) => Promise<void>;
    onDeletePhoto: (photoId: number | null, photoUrl?: string) => Promise<void>;
  }
  export default function PhotoUploader(props: PhotoUploaderProps): JSX.Element
  ```
  `onUploadFile` receives the already-compressed `File` and is responsible for the actual network upload + association (implemented by the caller in Task 4). `PhotoUploader` internally tracks in-flight files (compressing/uploading/error) and renders their previews alongside `photos` and `pendingPhotos`; it does not mutate `photos`/`pendingPhotos` itself.

- [ ] **Step 1: Create the component**

Write `src/components/admin/PhotoUploader.tsx`:

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `FileRejection` or `useDropzone` types are not found, confirm Task 1's install completed (`ls node_modules/react-dropzone`).

- [ ] **Step 3: Lint**

Run: `npm run lint -- src/components/admin/PhotoUploader.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/PhotoUploader.tsx
git commit -m "feat: add PhotoUploader component with drag-drop and client-side compression"
```

---

### Task 4: Wire `PhotoUploader` into the property form

**Files:**
- Modify: `src/components/admin/PropertiesTab.tsx`

**Interfaces:**
- Consumes: `PhotoUploader` from `./PhotoUploader` (Task 3), `useUploadPhoto`, `useAddPropertyPhoto`, `useDeletePhoto` from `@/lib/admin-hooks` (unchanged, already imported).
- Produces: `PropertyForm` no longer takes `onUploadPhoto`/`uploadingPhotos`/`fileInputRef` props; takes `onUploadFile: (file: File, propertyId: number | null) => Promise<void>` instead.

- [ ] **Step 1: Remove now-unused state and replace `handlePhotoUpload`**

In `src/components/admin/PropertiesTab.tsx`, remove lines 29-30 (`fileInputRef`, `uploadingPhotos` state):

```ts
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
```

Replace the `handlePhotoUpload` function (current lines 70-86):

```ts
  const handlePhotoUpload = async (files: FileList | null, propertyId: number | null) => {
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    try {
      for (const file of Array.from(files)) {
        const { url } = await uploadMutation.mutateAsync(file);
        if (propertyId) {
          await addPhotoMutation.mutateAsync({ propertyId, url });
        } else {
          setPendingPhotos((prev) => [...prev, url]);
        }
      }
    } finally {
      setUploadingPhotos(false);
    }
  };
```

with:

```ts
  const handleUploadFile = async (file: File, propertyId: number | null) => {
    const { url } = await uploadMutation.mutateAsync(file);
    if (propertyId) {
      await addPhotoMutation.mutateAsync({ propertyId, url });
    } else {
      setPendingPhotos((prev) => [...prev, url]);
    }
  };
```

`handleDeletePhoto` (lines 88-95) is unchanged.

Also remove the now-unused `useRef` import if nothing else in the file uses it — check first:

Run: `grep -n "useRef" src/components/admin/PropertiesTab.tsx`

If the only remaining match is the `import` line itself, remove `useRef` from the `react` import at the top of the file (line 3):

```ts
import { useState, useEffect, useRef } from 'react';
```
becomes:
```ts
import { useState, useEffect } from 'react';
```

(If `useRef` is still used elsewhere in the file, e.g. `sidebarRef`/`descriptionRef`, leave the import as-is.)

- [ ] **Step 2: Update the `PropertyForm` invocation**

Replace (current lines 221-224):

```tsx
            onUploadPhoto={handlePhotoUpload}
            onDeletePhoto={handleDeletePhoto}
            uploadingPhotos={uploadingPhotos}
            fileInputRef={fileInputRef}
```

with:

```tsx
            onUploadFile={handleUploadFile}
            onDeletePhoto={handleDeletePhoto}
```

- [ ] **Step 3: Update the `PropertyForm` signature**

Replace the `PropertyForm` props destructure and type (current lines 243-261):

```ts
function PropertyForm({
  property,
  pendingPhotos,
  onClose,
  onSave,
  onUploadPhoto,
  onDeletePhoto,
  uploadingPhotos,
  fileInputRef,
}: {
  property: Property | null;
  pendingPhotos: string[];
  onClose: () => void;
  onSave: (data: Partial<Property>) => Promise<void>;
  onUploadPhoto: (files: FileList | null, propertyId: number | null) => Promise<void>;
  onDeletePhoto: (photoId: number | null, photoUrl?: string) => Promise<void>;
  uploadingPhotos: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
```

with:

```ts
function PropertyForm({
  property,
  pendingPhotos,
  onClose,
  onSave,
  onUploadFile,
  onDeletePhoto,
}: {
  property: Property | null;
  pendingPhotos: string[];
  onClose: () => void;
  onSave: (data: Partial<Property>) => Promise<void>;
  onUploadFile: (file: File, propertyId: number | null) => Promise<void>;
  onDeletePhoto: (photoId: number | null, photoUrl?: string) => Promise<void>;
}) {
```

- [ ] **Step 4: Replace the photo gallery JSX**

Add the import at the top of the file (near the other `@/components` imports):

```ts
import PhotoUploader from '@/components/admin/PhotoUploader';
```

Replace the "Photo gallery" block (current lines 624-700):

```tsx
          {/* Photo gallery */}
          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-2 block">
              Foto Properti <span className="text-red-500">*</span>
            </label>
            {validationErrors.photos && (
              <p className="text-xs text-red-500 mb-2">{validationErrors.photos}</p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {/* Existing photos from property */}
              {property?.photos.map((photo, idx) => (
                <div key={photo.id} className="thumb relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={photo.url}
                    alt={photo.alt || `Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
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
              
              {/* Pending photos (new property) */}
              {pendingPhotos.map((url, idx) => (
                <div key={url} className="thumb relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={url}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
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
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center gap-1 text-stone-400 hover:border-orange hover:text-orange transition-colors"
              >
                {uploadingPhotos ? (
                  <span className="text-[9px] uppercase tracking-wider">Uploading...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[9px] uppercase tracking-wider">Tambah</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => onUploadPhoto(e.target.files, property?.id ?? null)}
                className="hidden"
              />
            </div>
          </div>
```

with:

```tsx
          {/* Photo gallery */}
          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-2 block">
              Foto Properti <span className="text-red-500">*</span>
            </label>
            {validationErrors.photos && (
              <p className="text-xs text-red-500 mb-2">{validationErrors.photos}</p>
            )}
            <PhotoUploader
              photos={property?.photos ?? []}
              pendingPhotos={pendingPhotos}
              onUploadFile={(file) => onUploadFile(file, property?.id ?? null)}
              onDeletePhoto={onDeletePhoto}
            />
          </div>
```

- [ ] **Step 5: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint -- src/components/admin/PropertiesTab.tsx`
Expected: no errors. If `handleUploadFile`/`handleDeletePhoto` show as unused-variable errors, re-check Step 2 wired them into the `PropertyForm` JSX correctly.

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/PropertiesTab.tsx
git commit -m "feat: wire PhotoUploader into property create/edit form"
```

---

### Task 5: Manual end-to-end verification

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (leave running)

- [ ] **Step 2: Full build check**

Run (separate terminal): `npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 3: Manual UI walkthrough**

Navigate to `/admin`, log in, open the Properties tab:

1. Click "+ Tambah Properti" to open the create form.
2. Drag 3-4 images onto the photo dropzone at once — confirm they show compressing → uploading previews in parallel (not one-at-a-time), then land as thumbnails.
3. Open browser DevTools Network tab, pick a source photo >1MB, drop it, and confirm the `POST /api/admin/photos` request body is smaller than the original file (compression happened).
4. Click the dropzone (instead of dragging) and confirm the native file picker opens and works the same way.
5. Try dropping 11 images at once on a property with 0 existing photos — confirm only 10 are accepted and a message explains the rest were skipped.
6. With a property already at 10 photos, confirm the dropzone is hidden/disabled and shows the "Maksimal 10 foto" message.
7. Drop a non-image file (e.g. a `.pdf`) — confirm it's rejected with an inline message and nothing gets stuck in an uploading state.
8. Save the new property, reopen it in edit mode, delete one photo, add one more — confirm the existing edit-mode flow (immediate association via `POST /api/admin/properties/:id/photos`) still works.
9. Temporarily disconnect network (DevTools "Offline") mid-upload, confirm the affected thumbnail shows an error state with a working "Coba lagi" retry button once back online.

- [ ] **Step 4: Confirm no regressions in existing property fields**

Fill out the rest of the property form (name, location, price, description, status) and save — confirm the save flow (unrelated to photos) still works end to end.

- [ ] **Step 5: Stop the dev server**

No commit for this task — it's verification only. If any step fails, fix the relevant task's code and re-run this task's checklist from Step 1.
