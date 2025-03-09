// toast.ts
import { writable } from 'svelte/store';
import { slide } from 'svelte/transition';

export type ToastType = 'info' | 'warning' | 'error' | 'success';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  code?: string;
  autoDismiss: boolean;
  dismissTime: number; // In seconds
  timestamp: number;
}

// Store for multiple toasts
export const toastsStore = writable<ToastItem[]>([]);

// Default configuration
const DEFAULT_CONFIG = {
  info: { autoDismiss: true, dismissTime: 3 },
  success: { autoDismiss: true, dismissTime: 3 },
  warning: { autoDismiss: true, dismissTime: 5 },
  error: { autoDismiss: false, dismissTime: 0 },
};

class Toast {
  private _type: ToastType = 'info';
  private _message: string = '';
  private _code?: string;
  private _autoDismiss?: boolean;
  private _dismissTime?: number;

  // Method to set message and return this for chaining
  message(msg: string): Toast {
    this._message = msg;
    return this;
  }

  // Method to set code
  code(code: string): Toast {
    this._code = code;
    return this;
  }

  // Method to set auto dismiss
  autoDismiss(value: boolean): Toast {
    this._autoDismiss = value;
    return this;
  }

  // Method to set dismiss time
  dismissTime(seconds: number): Toast {
    this._dismissTime = seconds;
    return this;
  }

  // Type setters that return this for chaining
  info(message?: string): Toast {
    this._type = 'info';
    if (message) this._message = message;
    return this;
  }

  success(message?: string): Toast {
    this._type = 'success';
    if (message) this._message = message;
    return this;
  }

  warning(message?: string): Toast {
    this._type = 'warning';
    if (message) this._message = message;
    return this;
  }

  error(message?: string): Toast {
    this._type = 'error';
    if (message) this._message = message;
    return this;
  }

  // Show the toast (end of chain)
  show(): void {
    if (!this._message) {
      console.warn('Toast message is empty');
      return;
    }

    // Get default config based on type
    const typeDefaults = DEFAULT_CONFIG[this._type];
    
    // Create toast item with defaults applied if not explicitly set
    const toast: ToastItem = {
      id: generateId(),
      type: this._type,
      message: this._message,
      code: this._code,
      autoDismiss: this._autoDismiss ?? typeDefaults.autoDismiss,
      dismissTime: this._dismissTime ?? typeDefaults.dismissTime,
      timestamp: Date.now()
    };

    // Add to store
    toastsStore.update(toasts => [...toasts, toast]);
    
    // Auto dismiss if configured
    if (toast.autoDismiss && toast.dismissTime > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.dismissTime * 1000);
    }
  }

  // Clear a specific toast by id
  dismiss(id: string): void {
    toastsStore.update(toasts => toasts.filter(t => t.id !== id));
  }

  // Clear all toasts
  dismissAll(): void {
    toastsStore.set([]);
  }
}

// Generate a unique ID for each toast
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Export a singleton instance
export const toast = new Toast();

// Example usage:
// toast.info('This is an info message').show();
// toast.error('This is an error').code('E123').autoDismiss(false).show();
// toast.message('Custom message').warning().dismissTime(10).show();