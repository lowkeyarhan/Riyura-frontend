// DTOs for notification system

// Used by `src/lib/contexts/NotificationContext.tsx` for notification items
export interface NotificationItem {
  id: string;
  message: string;
  type: "success" | "error";
}

// Used by `src/lib/contexts/NotificationContext.tsx` for context type
export interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (message: string, type: "success" | "error") => void;
  removeNotification: (id: string) => void;
}
