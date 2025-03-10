// alert.ts
import { writable } from 'svelte/store';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface AlertItem {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  dismissable: boolean;
  autoDismiss: boolean;
  dismissTime: number; // In seconds
  timestamp: number;
}

// Store for alerts
export const alertsStore = writable<AlertItem[]>([]);

// Default configuration
const DEFAULT_CONFIG = {
  info: { autoDismiss: true, dismissTime: 5, dismissable: true },
  success: { autoDismiss: true, dismissTime: 5, dismissable: true },
  warning: { autoDismiss: false, dismissTime: 0, dismissable: true },
  error: { autoDismiss: false, dismissTime: 0, dismissable: true },
};

class Alert {
  private _type: AlertType = 'info';
  private _title?: string;
  private _message: string = '';
  private _dismissable?: boolean;
  private _autoDismiss?: boolean;
  private _dismissTime?: number;

  // Method to set title and return this for chaining
  title(text: string): Alert {
    this._title = text;
    return this;
  }

  // Method to set message and return this for chaining
  message(msg: string): Alert {
    this._message = msg;
    return this;
  }

  // Method to set dismissable
  dismissable(value: boolean): Alert {
    this._dismissable = value;
    return this;
  }

  // Method to set auto dismiss
  autoDismiss(value: boolean): Alert {
    this._autoDismiss = value;
    return this;
  }

  // Method to set dismiss time
  dismissTime(seconds: number): Alert {
    this._dismissTime = seconds;
    return this;
  }

  // Type setters that return this for chaining
  info(message?: string, title?: string): Alert {
    this._type = 'info';
    if (message) this._message = message;
    if (title) this._title = title;
    return this;
  }

  success(message?: string, title?: string): Alert {
    this._type = 'success';
    if (message) this._message = message;
    if (title) this._title = title;
    return this;
  }

  warning(message?: string, title?: string): Alert {
    this._type = 'warning';
    if (message) this._message = message;
    if (title) this._title = title;
    return this;
  }

  error(message?: string, title?: string): Alert {
    this._type = 'error';
    if (message) this._message = message;
    if (title) this._title = title;
    return this;
  }

  // Show the alert (end of chain)
  show(): void {
    if (!this._message) {
      console.warn('Alert message is empty');
      return;
    }
    
    // Get default config based on type
    const typeDefaults = DEFAULT_CONFIG[this._type];
    
    // Create alert item with defaults applied if not explicitly set
    const alert: AlertItem = {
      id: generateId(),
      type: this._type,
      message: this._message,
      dismissable: this._dismissable ?? typeDefaults.dismissable,
      autoDismiss: this._autoDismiss ?? typeDefaults.autoDismiss,
      dismissTime: this._dismissTime ?? typeDefaults.dismissTime,
      timestamp: Date.now()
    };
    
    // Only add title if it's defined
    if (this._title !== undefined) {
      alert.title = this._title;
    }
    
    // Add to store (replace any existing alerts of the same type)
    alertsStore.update(alerts => {
      // Remove existing alerts of the same type
      const filteredAlerts = alerts.filter(a => a.type !== this._type);
      return [...filteredAlerts, alert];
    });
    
    // Auto dismiss if configured
    if (alert.autoDismiss && alert.dismissTime > 0) {
      setTimeout(() => {
        this.dismiss(alert.id);
      }, alert.dismissTime * 1000);
    }
    
    // Reset the internal state after creating an alert
    this._message = '';
    this._title = undefined;
    this._dismissable = undefined;
    this._autoDismiss = undefined;
    this._dismissTime = undefined;
    this._type = 'info';
  }

  // Clear a specific alert by id
  dismiss(id: string): void {
    alertsStore.update(alerts => alerts.filter(a => a.id !== id));
  }

  // Clear all alerts
  dismissAll(): void {
    alertsStore.set([]);
  }
  
  // Clear alerts by type
  dismissType(type: AlertType): void {
    alertsStore.update(alerts => alerts.filter(a => a.type !== type));
  }
}

// Generate a unique ID for each alert
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Export a singleton instance
export const alert = new Alert();

// Example usage:
// alert.info('This is an info message').show();
// alert.error('This is an error', 'Error Title').dismissable(true).show();
// alert.message('Custom message').warning().title('Warning').show();