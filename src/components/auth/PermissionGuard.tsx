import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export const PermissionGuard = ({
  permission,
  children,
}: {
  permission: string;
  children: JSX.Element;
}) => {
  const menus = useAuthStore((state) => state.menus);
  const allowed = menus?.some(
    (m) => m.permissionFlag === permission && m.status === true,
  );

  return allowed ? children : <Navigate to="/unauthorized" replace />;
};
