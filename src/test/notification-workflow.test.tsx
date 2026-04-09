import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationProvider, useNotifications } from "../context/NotificationContext";
import { AuthProvider } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import React from "react";

// Mock component to test the hook and provider
const TestComponent = () => {
  const { notifications, sendNotification, unreadCount, markAllAsRead } = useNotifications();
  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <button onClick={() => sendNotification("system", "Test Title", "Test Message")}>
        Send
      </button>
      <button onClick={markAllAsRead}>Mark All Read</button>
      <ul>
        {notifications.map(n => (
          <li key={n.id} data-testid={`ntf-${n.id}`}>
            {n.title} - {n.isRead ? "read" : "unread"}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe("Notification Workflow Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should send and display notifications in real-time", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <NotificationProvider>
            <TestComponent />
          </NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Initial state
    expect(screen.getByTestId("unread-count").textContent).toBe("0");

    // Send notification
    fireEvent.click(screen.getByText("Send"));

    // Check if notification appears
    await waitFor(() => {
      expect(screen.getByText(/Test Title/)).toBeInTheDocument();
      expect(screen.getByTestId("unread-count").textContent).toBe("1");
    });
  });

  it("should mark all as read and update unread count", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <NotificationProvider>
            <TestComponent />
          </NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Send two notifications
    fireEvent.click(screen.getByText("Send"));
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(screen.getByTestId("unread-count").textContent).toBe("2");
    });

    // Mark all as read
    fireEvent.click(screen.getByText("Mark All Read"));

    await waitFor(() => {
      expect(screen.getByTestId("unread-count").textContent).toBe("0");
    });
  });
});
