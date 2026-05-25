// src/hooks/usePermission.ts
import { useMemo } from "react";
import { buildPermissionSet, type Permission } from "@/utils/permission";

export const usePermission = (permissions: Permission[] = []) => {
  const permissionSet = useMemo(
    () => buildPermissionSet(permissions),
    [permissions],
  );

  const hasPermission = (flag: string): boolean => permissionSet.has(flag);

  return { hasPermission };
};
