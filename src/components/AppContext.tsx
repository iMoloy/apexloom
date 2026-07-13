"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: "host" | "guest";
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AppContextType {
  user: UserSession | null;
  loadingUser: boolean;
  toasts: Toast[];
  login: (user: UserSession) => void;
  logout: () => Promise<void>;
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setUser(data.user as UserSession);
          }
        }
      })
      .catch(() => undefined)
      .finally(() => setLoadingUser(false));
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      setUser(null);
      showToast("Logged out successfully.", "info");
    } else {
      showToast("Unable to log out.", "error");
    }
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        toasts,
        login: setUser,
        logout,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider.");
  }
  return context;
}
