import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Notification, NotificationType, NotificationPreference } from "@/types/models";
import { notificationService } from "@/lib/notifications";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference | null;
  isLoading: boolean;
  sendNotification: (
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updatePreferences: (prefs: NotificationPreference) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (user) {
      const n = notificationService.getNotifications(user.id);
      const p = notificationService.getPreferences(user.id);
      setNotifications(n);
      setPreferences(p);
      setIsLoading(false);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const sendNotification = useCallback(
    async (type: NotificationType, title: string, message: string, metadata?: Record<string, any>) => {
      if (!user) return;

      const n = await notificationService.notify(user.id, type, title, message, metadata);
      setNotifications((prev) => [n, ...prev]);
    },
    [user]
  );

  const markAsRead = useCallback((id: string) => {
    notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    if (!user) return;
    notificationService.markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [user]);

  const deleteNotification = useCallback((id: string) => {
    notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const updatePreferences = useCallback((prefs: NotificationPreference) => {
    notificationService.updatePreferences(prefs);
    setPreferences(prefs);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        isLoading,
        sendNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
