import { describe, it, expect, vi, beforeEach } from "vitest";
import { notificationService } from "../lib/notifications";

describe("NotificationService", () => {
  const userId = "test-user-123";

  beforeEach(() => {
    localStorage.clear();
    // Reset service state if possible or use a fresh instance for tests
    // Since it's a singleton, we clear localStorage which it depends on
  });

  it("should generate a notification and store it", async () => {
    const n = await notificationService.notify(
      userId,
      "system",
      "Test Title",
      "Test Message"
    );

    expect(n.userId).toBe(userId);
    expect(n.title).toBe("Test Title");
    expect(n.isRead).toBe(false);
    
    const notifications = notificationService.getNotifications(userId);
    expect(notifications.length).toBe(1);
    expect(notifications[0].id).toBe(n.id);
  });

  it("should respect user preferences for push", async () => {
    const prefs = notificationService.getPreferences(userId);
    notificationService.updatePreferences({ ...prefs, pushEnabled: false });

    const n = await notificationService.notify(
      userId,
      "driver_found",
      "Driver Found",
      "Msg"
    );

    expect(n.isPush).toBe(false);
  });

  it("should mark notifications as read", async () => {
    const n = await notificationService.notify(userId, "system", "T", "M");
    notificationService.markAsRead(n.id);

    const notifications = notificationService.getNotifications(userId);
    expect(notifications[0].isRead).toBe(true);
  });

  it("should delete notifications", async () => {
    const n = await notificationService.notify(userId, "system", "T", "M");
    notificationService.deleteNotification(n.id);

    const notifications = notificationService.getNotifications(userId);
    expect(notifications.length).toBe(0);
  });

  it("should queue notifications when offline", async () => {
    // Mock navigator.onLine
    const originalOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    });

    await notificationService.notify(userId, "system", "Offline", "Test");
    
    const queue = JSON.parse(localStorage.getItem("pyugo_offline_notifications") || "[]");
    expect(queue.length).toBe(1);
    expect(queue[0].title).toBe("Offline");

    // Restore
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: originalOnLine,
    });
  });
});
