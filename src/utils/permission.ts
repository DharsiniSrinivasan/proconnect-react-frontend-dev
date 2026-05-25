export interface Permission {
  permissionFlag: string;
  permissionId: number;
  status: boolean;
  menuName: string;
}

export const buildPermissionSet = (menus: Permission[]): Set<string> => {
  return new Set(menus.filter((m) => m.status).map((m) => m.permissionFlag));
};
