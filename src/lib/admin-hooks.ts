'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export type Property = {
  id: number;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  price: string;
  propertyType: 'rumah' | 'apartemen' | 'villa' | 'ruko';
  landArea: number | null;
  buildingArea: number | null;
  description: string | null;
  showInShowcase: boolean;
  displayOrder: number;
  photos: { id: number; url: string; alt: string }[];
};

export type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
};

export type Stat = {
  id: number;
  key: string;
  value: number;
  suffix: string;
  label: string;
  displayOrder: number;
};

export type Testimonial = {
  id: number;
  quote: string;
  name: string;
  title: string;
  displayOrder: number;
};

export type Social = {
  id: number;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  instagram: string | null;
  linkedin: string | null;
};

// Properties
export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ['admin', 'properties'],
    queryFn: async () => {
      const res = await fetch('/api/admin/properties');
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Property>) => {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create property');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Property> }) => {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update property');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete property');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}

// Hero Photos
export function useHeroPhotos() {
  return useQuery<[HeroPhoto | null, HeroPhoto | null, HeroPhoto | null]>({
    queryKey: ['admin', 'hero'],
    queryFn: async () => {
      const res = await fetch('/api/admin/hero');
      if (!res.ok) throw new Error('Failed to fetch hero photos');
      return res.json();
    },
  });
}

export function useUpdateHeroPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ position, url, alt }: { position: number; url: string; alt?: string }) => {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, url, alt: alt || '' }),
      });
      if (!res.ok) throw new Error('Failed to update hero photo');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hero'] });
    },
  });
}

// Stats
export function useStats() {
  return useQuery<Stat[]>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });
}

export function useUpdateStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stats: Stat[]) => {
      const res = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats }),
      });
      if (!res.ok) throw new Error('Failed to update stats');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// Testimonials
export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['admin', 'testimonials'],
    queryFn: async () => {
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) throw new Error('Failed to fetch testimonials');
      return res.json();
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id' | 'displayOrder'>) => {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create testimonial');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Testimonial> }) => {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update testimonial');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
    },
  });
}

// Socials
export function useSocials() {
  return useQuery<Social | null>({
    queryKey: ['admin', 'socials'],
    queryFn: async () => {
      const res = await fetch('/api/admin/socials');
      if (!res.ok) throw new Error('Failed to fetch socials');
      return res.json();
    },
  });
}

export function useUpdateSocials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Social>) => {
      const res = await fetch('/api/admin/socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update socials');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'socials'] });
    },
  });
}

// Photo Upload
export function useUploadPhoto() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload photo');
      return res.json() as Promise<{ url: string }>;
    },
  });
}

export function useAddPropertyPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ propertyId, url, alt }: { propertyId: number; url: string; alt?: string }) => {
      const res = await fetch(`/api/admin/properties/${propertyId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, alt: alt || '' }),
      });
      if (!res.ok) throw new Error('Failed to add photo');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoId: number) => {
      const res = await fetch(`/api/admin/photos/${photoId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete photo');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}
