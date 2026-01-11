import { toast } from 'sonner';

const toastSuccess = (message: string, options = {}) => {
  toast.success(message, {
    ...options,
    style: {
      background: 'var(--color-background-success)',
      color: 'var(--color-success)',
    },
  });
};

const toastError = (message: string, options = {}) => {
  toast.error(message, {
    ...options,
    style: {
      background: 'var(--color-background-error)',
      color: 'var(--color-error)',
    },
  });
};

const toastWarning = (message: string, options = {}) => {
  toast.warning(message, {
    ...options,
    style: {
      background: 'var(--color-background-warning, #422006)',
      color: 'var(--color-warning, #fbbf24)',
    },
  });
};

export { toastError, toastSuccess, toastWarning };
