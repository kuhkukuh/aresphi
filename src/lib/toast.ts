import { toast } from 'sonner';

export const appToast = {
  success: (title: string, options?: { description?: string }) => {
    toast.success(title, {
      description: options?.description,
    });
  },

  removed: (title: string, options?: { description?: string }) => {
    toast.success(title, {
      description: options?.description,
      classNames: {
        icon: 'text-red-500',
      },
    });
  },

  error: (title: string, options?: { description?: string }) => {
    toast.error(title, {
      description: options?.description,
    });
  },
  
  info: (title: string, options?: { description?: string }) => {
    toast.info(title, {
      description: options?.description,
    });
  },
};
