// utils/user.ts
export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export function getUser(): UserData | null {
  if (typeof window === "undefined") return null;

  try {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    return JSON.parse(userString) as UserData;
  } catch (error: unknown) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
}
