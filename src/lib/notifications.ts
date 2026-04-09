import { Notification, NotificationType, NotificationPreference } from "@/types/models";
import { v4 as uuidv4 } from "uuid";

// ─── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "pyugo_notifications";
const PREFS_KEY = "pyugo_notification_prefs";
const OFFLINE_QUEUE_KEY = "pyugo_offline_notifications";

// ─── Notification Service ───────────────────────────────────────────────────

class NotificationService {
  private notifications: Notification[] = [];
  private preferences: NotificationPreference | null = null;

  constructor() {
    this.loadData();
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.processOfflineQueue());
    }
  }

  private loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.notifications = stored ? JSON.parse(stored) : [];

      const prefs = localStorage.getItem(PREFS_KEY);
      this.preferences = prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.error("[NotificationService] Error loading data:", error);
    }
  }

  private saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
  }

  // ── Preferences ──────────────────────────────────────────────────────────

  getPreferences(userId: string): NotificationPreference {
    if (this.preferences && this.preferences.userId === userId) {
      return this.preferences;
    }

    const defaultPrefs: NotificationPreference = {
      userId,
      pushEnabled: true,
      types: {
        driver_found: true,
        trip_started: true,
        trip_completed: true,
        payment_success: true,
        shuttle_reminder: true,
        system: true,
      },
    };

    this.updatePreferences(defaultPrefs);
    return defaultPrefs;
  }

  updatePreferences(prefs: NotificationPreference) {
    this.preferences = prefs;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }

  // ── Core Delivery ────────────────────────────────────────────────────────

  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<Notification> {
    const prefs = this.getPreferences(userId);

    const notification: Notification = {
      id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      type,
      title,
      message,
      isRead: false,
      isPush: prefs.pushEnabled && prefs.types[type],
      metadata,
      createdAt: new Date().toISOString(),
    };

    // Logging & Analytics
    this.logEvent("delivery_attempt", notification);

    if (navigator.onLine) {
      await this.deliver(notification);
    } else {
      this.queueOffline(notification);
    }

    // Always store for in-app list
    this.notifications.unshift(notification);
    this.saveData();

    return notification;
  }

  private async deliver(notification: Notification) {
    if (notification.isPush) {
      try {
        // Simulate platform-specific push delivery (iOS/Android)
        const platform = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "iOS" : "Android";
        
        // Retry logic simulation
        let attempts = 0;
        const maxRetries = 3;
        let success = false;

        while (attempts < maxRetries && !success) {
          attempts++;
          // Mocking push API call
          await new Promise((resolve) => setTimeout(resolve, 100));
          success = Math.random() > 0.1; // 90% success rate
        }

        if (success) {
          this.logEvent("push_success", { ...notification, platform, attempts });
        } else {
          throw new Error("Push delivery failed after retries");
        }
      } catch (error) {
        this.logEvent("push_error", { ...notification, error: (error as Error).message });
      }
    }

    this.logEvent("in_app_delivered", notification);
  }

  // ── Offline Handling ─────────────────────────────────────────────────────

  private queueOffline(notification: Notification) {
    try {
      const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
      queue.push(notification);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      this.logEvent("queued_offline", notification);
    } catch (e) {
      console.error("[NotificationService] Error queueing offline:", e);
    }
  }

  private async processOfflineQueue() {
    try {
      const queue: Notification[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
      if (queue.length === 0) return;

      console.log(`[NotificationService] Processing ${queue.length} offline notifications...`);
      for (const n of queue) {
        await this.deliver(n);
      }
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (e) {
      console.error("[NotificationService] Error processing offline queue:", e);
    }
  }

  // ── Data Management ──────────────────────────────────────────────────────

  getNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  markAsRead(id: string) {
    const n = this.notifications.find((n) => n.id === id);
    if (n) {
      n.isRead = true;
      this.saveData();
    }
  }

  markAllAsRead(userId: string) {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    this.saveData();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveData();
  }

  // ── Logging & Analytics ──────────────────────────────────────────────────

  private logEvent(event: string, data: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      ...data,
    };
    
    // In dev, log to console. In prod, this would go to a logging service.
    if (import.meta.env.DEV) {
      console.log(`[NotificationLog] ${event.toUpperCase()}:`, data);
    }

    // Persistent logs for audit
    const logs = JSON.parse(localStorage.getItem("pyugo_logs_notifications") || "[]");
    logs.push(logEntry);
    localStorage.setItem("pyugo_logs_notifications", JSON.stringify(logs.slice(-100)));
  }
}

export const notificationService = new NotificationService();
