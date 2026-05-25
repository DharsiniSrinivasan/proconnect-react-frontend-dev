import { toast } from "sonner";

export const logout = (message?: string) => {
  localStorage.clear();
  sessionStorage.clear();

  if (message) {
    toast.error(message);
  }

  // Force redirect to login
  window.location.href = "/login";
};
