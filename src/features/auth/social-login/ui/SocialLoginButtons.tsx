/**
 * Кнопки для социальной авторизации
 */

"use client";

import { useState } from "react";
import { getLoginUrl } from "@/shared/lib/keycloak/keycloak";
import { Button } from "@/shared/ui/Button";

export function SocialLoginButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsLoading(provider);
    try {
      const url = await getLoginUrl(provider);
      window.location.href = url;
    } catch (error) {
      console.error(`Failed to initiate ${provider} login:`, error);
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-3 w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-black text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading !== null}
          isLoading={isLoading === "google"}
          className="w-full"
        >
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("github")}
          disabled={isLoading !== null}
          isLoading={isLoading === "github"}
          className="w-full"
        >
          GitHub
        </Button>
      </div>
    </div>
  );
}
