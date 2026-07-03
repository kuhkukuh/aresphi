# Property Photo Uploader Design

> Date: 2026-07-03

## Overview

The property create/edit form's image uploader (`src/components/admin/PropertiesTab.tsx`) is a bare `<input type="file" multiple>` with no drag-and-drop, sequential one-at-a-time uploads, no client-side compression, and no maximum photo count. This replaces it with a dedicated `PhotoUploader` component using `react-dropzone` for drag-and-drop and `browser-image-compression` for client-side compression, capped at 10 photos per property.

`HeroTab.tsx`'s single-photo-per-position uploader is a separate, different UX and is out of scope.

## Current State (for reference)

- `PropertiesTab.tsx` lines ~29-31: `fileInputRef`, `uploadingPhotos`, `pendingPhotos` state
- `PropertiesTab.tsx` lines ~70-96: `handlePhotoUpload` (sequential `for` loop, one file at a time), `handleDeletePhoto`
- `PropertiesTab.tsx` lines ~624-699: thumbnail grid + hidden native file input JSX
- `src/lib/admin-hooks.ts`: `useUploadPhoto`, `useAddPropertyPhoto`, `useDeletePhoto` — TanStack Query mutations, unchanged by this work
- `src/app/api/admin/photos/route.ts` (`POST`): uploads to Vercel Blob, MIME-type allowlist (jpeg/png/webp), no size or count limit
- `src/app/api/admin/properties/[id]/photos/route.ts` (`POST`): links an uploaded URL to a property, auto-increments `displayOrder`, no count limit
- `src/app/api/admin/photos/[id]/route.ts` (`DELETE`): removes DB row + blob
- Schema: `property_photos` table, one row per image (`id`, `propertyId`, `url`, `alt`, `displayOrder`)

## Library Choice

`react-dropzone` (drag-and-drop hook, unstyled) + `browser-image-compression` (web-worker based client-side compression). Both are widely used, production-proven libraries. Chosen over FilePond/Uppy because the admin UI is 100% hand-rolled Tailwind with no component library — a full pre-styled uploader widget would need significant reskinning to match the existing minimal stone/orange design, whereas these two libraries integrate into the existing thumbnail-grid markup as-is.

## Component Structure

New file: `src/components/admin/PhotoUploader.tsx`

```
<PhotoUploader
  photos={property?.photos ?? []}       // existing PropertyPhoto[] (edit mode)
  pendingPhotos={pendingPhotos}          // string[] of URLs (create mode, property not yet saved)
  onUploaded={(url) => ...}              // called per successfully uploaded+compressed file
  onDelete={(photoId | null, url?) => ...}
  max={10}
/>
```

This component owns: the dropzone UI, per-file compression, per-file upload progress/error state, and the thumbnail grid (existing photos + pending photos + add-tile), replacing the equivalent inline JSX and handlers currently in `PropertiesTab.tsx`. `PropertiesTab.tsx` keeps owning `pendingPhotos` state and the association calls (`addPhotoMutation`, `deletePhotoMutation`) since those are tied to the property's create/edit lifecycle, not the uploader itself.

## Upload Flow

1. User drags files onto the dropzone, or clicks to open the file browser (`useDropzone` handles both).
2. Client-side validation, in order, before any file is touched:
   - Would accepting these files exceed 10 total (existing + pending + already-in-flight)? If so, only accept up to the remaining slots and show a message for the rest.
   - Reject files that aren't `image/jpeg`, `image/png`, or `image/webp`.
   - Reject raw files over 20MB (before compression) — compressing something that large client-side risks hanging the browser tab.
3. Each accepted file is compressed via `browser-image-compression`:
   - `maxWidthOrHeight: 1920`
   - `maxSizeMB: 1`
   - `useWebWorker: true`
   - Preserve EXIF orientation
   - Skip compression for files already under ~300KB
   - If compression throws, fall back to uploading the original file rather than blocking the user
4. Compressed files upload with a concurrency cap of 3 in parallel via the existing `useUploadPhoto` mutation. Each file shows an immediate local preview (`URL.createObjectURL`) with its own progress/spinner state, swapped for the real Blob URL on success.
5. On a per-file failure: show an inline error + retry button on that thumbnail; other in-flight uploads are unaffected.
6. On success, association with the property proceeds exactly as today — immediate `POST /api/admin/properties/:id/photos` in edit mode, or appended to `pendingPhotos` in create mode.

## 10-Image Limit

- **Client-side**: dropzone disables/hides once 10 photos (existing + pending) are present, with an inline message ("Maksimal 10 foto").
- **Server-side** (authoritative, since client checks are bypassable): `POST /api/admin/properties/[id]/photos` counts existing rows for the property and returns `400` if already at 10 before inserting.

## Error Handling

- Upload/network failure → toast (existing `appToast` pattern) + inline retry on that specific thumbnail.
- Compression failure → silent fallback to uploading the original file.
- Type/size/count rejection → inline message near the dropzone, consistent with the existing `validationErrors.photos` pattern already in the form.

## Out of Scope

- Drag-to-reorder of photos (`displayOrder` exists in schema but has no reorder UI today; not requested here). The component is structured so reordering could be added later without a rewrite.
- `HeroTab.tsx`'s uploader.
- Changing the storage backend — stays on Vercel Blob via the existing API routes.

## Testing / Verification

Manual verification via the dev server (`/admin`, Properties tab):
- Create a new property, drag in multiple images at once, confirm parallel upload with individual progress and previews.
- Confirm compressed payload is smaller than the original (compare network tab request size to source file size).
- Confirm the 11th photo is blocked both in the UI and if attempted directly against the API.
- Confirm existing edit-mode delete/upload flow still works.
- Confirm click-to-browse works (not just drag-and-drop) for non-drag environments.
