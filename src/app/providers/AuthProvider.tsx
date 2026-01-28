/**
 * Провайдер для инициализации авторизации при загрузке приложения
 * По аналогии с примером: инициализирует auth при монтировании и показывает loader до готовности
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth";
import { diagnoseRefreshToken } from "@/shared/lib/utils/cookie";
import { API_BASE_URL } from "@/shared/config/constants";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Инициализируем авторизацию при монтировании компонента
    // Аналогично примеру: POST /auth/refresh при монтировании
    initializeAuth();
    
    // Добавляем функцию диагностики в window для отладки в development
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as any).debugRefreshToken = () => {
        console.log("🔍 Running refresh token diagnostics...");
        diagnoseRefreshToken(API_BASE_URL);
      };
      console.log("💡 Development mode: use window.debugRefreshToken() to diagnose refresh token issues");
    }
  }, [initializeAuth]);

  // Показываем loader пока не инициализировано (как в примере)
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
