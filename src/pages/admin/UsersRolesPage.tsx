import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NeonCard } from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  UserX,
  Users,
  Shield,
  User,
  Camera,
  EyeOff,
  Eye,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Loader2,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRow } from "@/mocks/admin.mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmationDialog";
import { SortableTableHead } from "@/components/sortable-table-head";
type TabType = "users" | "roles";


interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: File | null; // upload
  avatarPreview: string | null; // display
}
export type SortOrder = "asc" | "desc" | null;
const UsersRolesPage = () => {
  const [roleSortBy, setRoleSortBy] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter_name, setFilter_name] = useState("");
  const [filter_email, setFilter_email] = useState("");
  const [filter_last_login, setFilter_last_login] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [roleRoleFilter, setRoleRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const formikResetRef = useRef<(() => void) | null>(null);
  const formikSetValuesRef = useRef<((values: any) => void) | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<any[]>(
    [],
  );
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(false);
  const {
    getRoleByIdPermission,
    getPermissionList,
    screenData,
    permissionList,
    getModuleAccess,
    modulesData,
    users,
    pageSize,
    fetchUsers,
    isLoading,
    total,
    setPageSize,
    getScreenAccess,
  } = useUserStore();
  const { roles, getRoles } = useUserStore();

  // Form state

  const [screens, setScreen] = useState("");
  const [moduleSet, setModule] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const totalRecords = total; // OR from API
  const totalPages = Math.ceil(totalRecords / pageSize);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [roleSortOrder, setRoleSortOrder] = useState<SortOrder>(null);
  const start = totalRecords === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalRecords);
  const [filter_description, setfilter_description] = useState("");
  const [pageInput, setPageInput] = useState<number | "">(currentPage + 1);
  const rolePageSize = 10;
  const rolePage = 0;
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const normalizeBase64Image = (base64?: string | null) => {
    if (!base64) return "";

    // Already a valid image src
    if (base64.startsWith("data:image")) return base64;

    // Default type – adjust if backend sends jpeg/webp
    return `data:image/png;base64,${base64}`;
  };
  const initialValues: UserFormValues = {
    name: editingUser?.name ?? "",
    email: editingUser?.email ?? "",
    password: "",
    role:
      typeof editingUser?.role === "string"
        ? editingUser.role
        : (editingUser?.role?.key ?? ""), // pick string key safely
    avatar: null,
    avatarPreview: normalizeBase64Image(editingUser?.avatar) ?? null,
  };

  useEffect(() => {
    getModuleAccess();
    getScreenAccess();
    getRoles();
  }, [getModuleAccess, getRoles, getScreenAccess]);

useEffect(() => {
  fetchUsers(
    currentPage,
    pageSize,
    statusFilter,
    searchQuery,
    roleFilter,
    filter_name,
    filter_email,
    filter_last_login,
    sortBy,
    sortOrder,
  );
}, [
  currentPage,
  pageSize,
  fetchUsers,
  statusFilter,
  searchQuery,
  roleFilter,
  sortBy,
  sortOrder,
]);

useEffect(() => {
  const timer = setTimeout(() => {
    setCurrentPage(0); 
    fetchUsers(
      currentPage,
      pageSize,
      statusFilter,
      searchQuery,
      roleFilter,
      filter_name,
      filter_email,
      filter_last_login,
      sortBy,
      sortOrder,
    );
  }, 500);

  return () => clearTimeout(timer);
}, [filter_name, filter_email, filter_last_login, searchQuery]);

  useEffect(() => {
    getPermissionList(
      rolePage,
      rolePageSize,
      roleRoleFilter,
      roleSortBy,
      roleSortOrder,
      filter_description,
      moduleSet,
      screens,
    );
  }, [
    getPermissionList,
    rolePage,
    rolePageSize,
    roleRoleFilter,
    roleSortBy,
    roleSortOrder,
    filter_description,
    moduleSet,
    screens,
  ]);
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }

    setProfileImage(URL.createObjectURL(file)); // preview
    setFieldValue("avatar", file); // upload
  };

  const openAddModal = () => {
    setEditingUser(null);
    setProfileImage(null);
    setIsFetchingPermissions(false);
    setSelectedRolePermissions([]);
    setIsModalOpen(true);
  };

  const openEditModal = async (userRow: UserRow | any) => {
    const user = await useUserStore.getState().getUserById(userRow.id);
    if (!user) return;

    setEditingUser(user);
    setIsModalOpen(true);

    // fetch permissions for user's role
    if (user.role) {
      setIsFetchingPermissions(true);
      try {
        const data: any = await getRoleByIdPermission(user.role);
        setSelectedRolePermissions(data || []); // store permissions
      } catch (err) {
        console.error("Failed to fetch permissions", err);
        setSelectedRolePermissions([]);
      } finally {
        setIsFetchingPermissions(false);
      }
    } else {
      setSelectedRolePermissions([]);
    }
  };

  useEffect(() => {
    if (!editingUser || !formikSetValuesRef.current) return;

    const roleKey =
      typeof editingUser.role === "string"
        ? (roles.find(
          (r) => r.key === editingUser.role || r.value === editingUser.role,
        )?.key ?? "")
        : editingUser.role.key;

    formikSetValuesRef.current({
      name: editingUser.name,
      email: editingUser.email,
      role: roleKey,
      personas: editingUser.personas ?? [],
      password: "",
    });

    if (editingUser.profileImage) {
      setProfileImage(
        editingUser.profileImage.startsWith("data:image")
          ? editingUser.profileImage
          : `data:image/png;base64,${editingUser.profileImage}`,
      );
    } else {
      setProfileImage(null);
    }
  }, [editingUser, roles]);

  const handleSaveUser = async (values: any, resetForm: () => void) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("role", values.role);
    if (values.avatar instanceof File) {
      formData.append("avatar", values.avatar);
    } else {
      formData.append("avatar", "");
    }
    if (values.password) {
      formData.append("credentials", values.password);
    }

    const { saveUser, updateUser } = useUserStore.getState();

    let success = false;

    if (editingUser?.id) {
      //  EDIT MODE
      success = await updateUser(formData, editingUser.id);
    } else {
      //  ADD MODE
      success = await saveUser(formData);
    }

    if (success) {
      toast.success(
        editingUser ? "User updated successfully" : "User added successfully",
      );
      resetForm();
      setEditingUser(null);
      setIsModalOpen(false);
    }
  };

  const handleDeactivate = async (user: any): Promise<boolean> => {
    const { userStatusChange } = useUserStore.getState();
    const response: any = await userStatusChange(user.id);

    if (response) {
      toast.success(
        response.message || `User ${user.name} status changed successfully.`,
      );
      return true;
    } else {
      toast.error(`Failed to change status for user ${user.name}.`);
      return false;
    }
  };

  const touchOnChangeOnce =
    (field: string, touched: any, setFieldTouched: any, setFieldValue: any) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(field, e.target.value, true);

        if (!touched[field]) {
          setFieldTouched(field, true, false);
        }
      };

  const getValidationSchema = (isEdit: boolean) =>
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .matches(
          /^[a-zA-Z0-9._%+-]+@proconnectlogistics\.com$/i,
          "Only proconnectlogistics.com emails are allowed",
        )
        .required("Email is required"),
      role: Yup.string().required("Role is required"),
      password: isEdit
        ? Yup.string()
          .nullable()
          .notRequired()
          .min(6, "Password must be at least 6 characters")
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter",
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter",
          )
          .matches(/\d/, "Password must contain at least one number")
        : Yup.string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters")
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter",
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter",
          )
          .matches(/\d/, "Password must contain at least one number"),
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30";
      case "inactive":
        return "bg-muted/40 text-muted-foreground border-muted/50";
      case "pending":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "Operations":
        return "bg-primary/20 text-primary border-primary/30";
      case "Management":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "Finance":
        return "bg-success/20 text-success border-success/30";
      case "Sales":
        return "bg-warning/20 text-warning border-warning/30";
      case "Customer":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };
  const handleSort = (newSortBy: string | null, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  const rolehandleSort = (
    newSortBy: string | null,
    newSortOrder: SortOrder,
  ) => {
    setRoleSortBy(newSortBy);
    setRoleSortOrder(newSortOrder);
  };

  useEffect(() => {
    setPageInput(currentPage + 1);
  }, [currentPage]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof pageInput === "number" && // Only trigger if it's a number
        pageInput >= 1 &&
        pageInput <= totalPages &&
        pageInput !== currentPage + 1
      ) {
        onPageChange(pageInput - 1);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageInput]);

  const resetFormValues = () => {
    const defaultUser = {
      name: "",
      email: "",
      role: "",
      avatar: null,
      avatarPreview: null,
    };
    if (editingUser) {
      setEditingUser(defaultUser);
    }

    setProfileImage(null);
    setSelectedRolePermissions([]);

  };

  return (
    <AppShell
      pageTitle="Users & Roles"
      pageSubtitle="Manage user access and permissions"
    >
      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg border border-border/30 w-fit">
        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "roles"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Shield className="w-4 h-4" />
          Roles
        </button>
      </div>

      {activeTab === "users" && (
        <>
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">

            {/* Search */}
            <div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 w-full"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles?.map((role) => (
                    <SelectItem key={role.key} value={role.value}>
                      {role.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Button */}
            <Button
              onClick={openAddModal}
              className="w-full sm:w-auto sm:ml-auto text-primary-foreground shadow-lg shadow-primary/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>

          </div>

          {/* Users Table */}
          <NeonCard className="h-full" title="Users" count={String(total)}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-transparent">
                    <SortableTableHead
                      searchValue={filter_name}
                      label="Name"
                      sortKey="name"
                      onSearch={setFilter_name}
                      searchable={true}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      searchValue={filter_email}
                      label="Email"
                      sortKey="email"
                      onSearch={(value) => setFilter_email(value)}
                      searchable={true}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      label="Role"
                      sortKey="role"
                      selectable
                      options={roles?.map((role) => ({
                        label: role.key,
                        value: role.value,
                      }))}
                      selectedValue={roleFilter}
                      onSelect={setRoleFilter}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />

                    <SortableTableHead
                      label="Status"
                      sortKey="status"
                      selectable
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                      ]}
                      selectedValue={statusFilter}
                      onSelect={setStatusFilter}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      label="Last Login"
                      sortKey="last_login"
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      datepicker
                      dateValue={filter_last_login}
                      onDateSelect={setFilter_last_login}
                      className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-3"
                    />
                    <TableHead className="text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: pageSize || 10 }).map(
                      (_, rowIndex) => (
                        <TableRow key={rowIndex} className="border-border/30">
                          {Array.from({ length: 8 }).map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ),
                    )
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground py-10"
                      >
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-border/20 hover:bg-primary/5 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getRoleColor(user.role))}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        {/* <TableCell> */}
                        {/* <div className="flex flex-wrap gap-1">
                            {user.personas.slice(0, 2).map((p) => (
                              <Badge
                                key={p}
                                variant="outline"
                                className="text-xs bg-muted/30 border-border/40"
                              >
                                {p}
                              </Badge>
                            ))}
                            {user.personas.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-muted/30">
                                +{user.personas.length - 2}
                              </Badge>
                            )}
                          </div> */}
                        {/* </TableCell> */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs capitalize",
                              getStatusColor(user.status),
                            )}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {
                            user.last_login_at
                              ? new Date(user.last_login_at).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              : "--"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(user)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <ConfirmationDialog
                              title={
                                user.status === "Active"
                                  ? "Deactivate User"
                                  : "Activate User"
                              }
                              description={
                                user.status === "Active"
                                  ? "Are you sure you want to deactivate this user?"
                                  : "Are you sure you want to activate this user?"
                              }
                              confirmText={
                                user.status === "Active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              onConfirm={() => handleDeactivate(user)}
                            >
                              {/* Trigger button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 ${user.status === "Active"
                                  ? "hover:bg-destructive/10 hover:text-destructive"
                                  : "hover:bg-primary/10 hover:text-primary"
                                  }`}
                              >
                                {user.status === "Active" ? (
                                  <UserX className="w-4 h-4" />
                                ) : (
                                  <UserCheck className="w-4 h-4" />
                                )}
                              </Button>
                            </ConfirmationDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {total > 10 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 m-2 border-t border-border/30">

                  {/* Rows per page */}
                  <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Rows per page:
                    </span>
                    <select
                      className="border rounded px-2 py-1 text-xs bg-background w-20"
                      value={pageSize}
                      onChange={(e) => {
                        onPageSizeChange(Number(e.target.value));
                        onPageChange(0);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={500}>500</option>
                    </select>
                  </div>

                  {/* Range */}
                  <p className="text-xs text-muted-foreground text-center sm:text-left w-full sm:w-auto">
                    {start}–{end} of {totalRecords}
                  </p>

                  {/* Nav */}
                  <div className="flex items-center justify-between sm:justify-end gap-1 w-full sm:w-auto flex-wrap">

                    {/* First */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage === 0}
                      onClick={() => onPageChange(0)}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    {/* Prev */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage === 0}
                      onClick={() => onPageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Page Info */}
                    <span className="text-xs px-2 whitespace-nowrap">
                      {currentPage + 1} / {totalPages}
                    </span>

                    {/* Next */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage + 1 >= totalPages}
                      onClick={() => onPageChange(currentPage + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Last */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage + 1 >= totalPages}
                      onClick={() => onPageChange(totalPages - 1)}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </NeonCard>
        </>
      )}

      {activeTab === "roles" && (
        <NeonCard className="p-0 overflow-hidden">
          {/* {isLoading ? (
            <RolesTableSkeleton />
          ) : ( */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <SortableTableHead
                    label="Role"
                    sortKey="role_name"
                    selectable
                    options={roles?.map((role) => ({
                      label: role.key,
                      value: role.value,
                    }))}
                    selectedValue={roleRoleFilter}
                    onSelect={setRoleRoleFilter}
                    currentSortBy={roleSortBy}
                    currentSortOrder={roleSortOrder}
                    onSort={rolehandleSort}
                  />
                  <SortableTableHead
                    searchValue={filter_description}
                    label="Description"
                    sortKey="description"
                    onSearch={(value) => setfilter_description(value)}
                    searchable
                    currentSortBy={roleSortBy}
                    currentSortOrder={roleSortOrder}
                    onSort={rolehandleSort}
                  />
                  <SortableTableHead
                    label="Module Access"
                    sortKey="moduleaccess"
                    selectable
                    options={modulesData?.map((module) => ({
                      label: module,
                      value: module,
                    }))}
                    selectedValue={moduleSet}
                    onSelect={setModule}
                    currentSortBy={roleSortBy}
                    currentSortOrder={roleSortOrder}
                    onSort={rolehandleSort}
                  />
                  <SortableTableHead
                    label="Screen Access"
                    sortKey="screenaccess"
                    selectable
                    options={screenData?.map((screen) => ({
                      label: screen,
                      value: screen,
                    }))}
                    selectedValue={screens}
                    onSelect={setScreen}
                    currentSortBy={roleSortBy}
                    currentSortOrder={roleSortOrder}
                    onSort={rolehandleSort}
                  />
                  {/* <TableHead className="text-muted-foreground">Screen Access</TableHead> */}
                  {/* <TableHead className="text-muted-foreground">Row Scope</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pageSize || 10 }).map((_, rowIndex) => (
                    <TableRow key={rowIndex} className="border-border/30">
                      {Array.from({ length: 8 }).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <div className="h-5 w-full bg-muted animate-pulse rounded-md" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : permissionList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-10"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  permissionList?.map((role: any) => (
                    <TableRow
                      key={role.key}
                      className="border-border/20 hover:bg-primary/5 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getRoleColor(role.roleName),
                            )}
                          >
                            {role.roleName}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs">
                        {role?.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role?.moduleAccess?.map(
                            (module: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-secondary/10 text-secondary border-secondary/30"
                              >
                                {module}
                              </Badge>
                            ),
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role?.screenAccess?.map(
                            (screen: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-muted/30 border-border/40"
                              >
                                {screen}
                              </Badge>
                            ),
                          )}
                        </div>
                      </TableCell>

                      {/* <TableCell className="text-foreground font-medium">
                          All
                        </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* )} */}
        </NeonCard>
      )}

      {/* Add/Edit User Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Modal is being closed (via X or outside click)
            setIsModalOpen(false);

            // Reset Formik form
            formikResetRef.current?.();

            // Clear avatar preview
            setProfileImage(null);
          }
        }}
      >
        <DialogContent className="
    w-[95vw] 
    sm:max-w-xl 
    md:max-w-2xl 
    lg:max-w-3xl
    max-h-[95vh] 
    overflow-y-auto
    hide-scrollbar
  ">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={getValidationSchema(!!editingUser)}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              try {
                await handleSaveUser(values, resetForm);
              } finally {
                setSubmitting(false); // ensure spinner stops even on error
              }
            }}
          >
            {({
              values,
              errors,
              resetForm,
              isSubmitting,
              touched,
              setFieldTouched,
              setFieldValue,
              isValid,
              submitCount,
            }) => (
              <Form autoComplete="off">
                <div className="flex flex-col gap-6 py-4">
                  {/* Profile Image Upload – Centered */}
                  {/* Profile Image Upload – Centered */}
                  <div className="flex justify-center">
                    <div className="relative ">
                      <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-primary/20">
                        <AvatarImage
                          src={profileImage || values?.avatarPreview}
                        />
                        <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>

                      <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4 text-primary-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setFieldValue)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {/* Two Column Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={touchOnChangeOnce(
                          "name",
                          touched,
                          setFieldTouched,
                          setFieldValue,
                        )}
                        placeholder="Enter full name"
                        className="bg-background/50 border-border/50"
                      />
                      {errors.name && touched.name && (
                        <span className="text-xs text-destructive">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={touchOnChangeOnce(
                          "email",
                          touched,
                          setFieldTouched,
                          setFieldValue,
                        )}
                        placeholder="Enter email address"
                        className="bg-background/50 border-border/50"
                      />
                      {errors.email && (touched.email || submitCount > 0) && (
                        <span className="text-xs text-destructive">
                          {errors.email}
                        </span>
                      )}
                    </div>
                    {!editingUser && (
                      <div className="space-y-1 relative">
                        <Label htmlFor="password">
                          Password <span className="text-destructive">*</span>
                        </Label>

                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={values.password}
                            onChange={touchOnChangeOnce(
                              "password",
                              touched,
                              setFieldTouched,
                              setFieldValue,
                            )}
                            placeholder="Enter password"
                            className={cn(
                              "bg-background/50 border-border/50 pr-10",
                              errors.password &&
                              touched.password &&
                              "border-destructive focus-visible:ring-destructive",
                            )}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {errors.password && touched.password && (
                          <p className="text-xs text-destructive">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="space-y-1">
                      <Label>
                        Role <span className="text-destructive">*</span>
                      </Label>

                      <Select
                        value={values.role}
                        onValueChange={(val) => {
                          // 1️⃣ update value first
                          setFieldValue("role", val);

                          // 2️⃣ mark touched ONCE (no re-validation race)
                          setFieldTouched("role", true, false);

                          // 3️⃣ side-effect only
                          if (val) {
                            setIsFetchingPermissions(true);
                            getRoleByIdPermission(val)
                              .then((data: any) => {
                                setSelectedRolePermissions(data || []);
                              })
                              .finally(() => {
                                setIsFetchingPermissions(false);
                              });
                          } else {
                            setSelectedRolePermissions([]);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-background/50 border-border/50">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>

                        <SelectContent>
                          {roles
                            .filter((role) => role.key !== "CUSTOMER")
                            .map((role) => (
                              <SelectItem key={role.key} value={role.value}>
                                {role.value}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {touched.role && errors.role && (
                        <span className="text-xs text-destructive">
                          {errors.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>

                    {isFetchingPermissions ? (
                      <p className="text-sm text-muted-foreground">
                        Loading permissions...
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 p-2 sm:p-3 rounded-lg bg-muted/20 border border-border/30">
                        {selectedRolePermissions?.filter((perm) => perm.status)
                          ?.length > 0 ? (
                          selectedRolePermissions
                            ?.filter((perm) => perm.status)
                            .map((perm) => (
                              <span
                                key={perm.permissionId} // use permissionId (your data uses this, not id)
                                className="px-2.5 py-1 rounded-full text-xs border bg-primary/15 text-primary border-primary/30"
                              >
                                {perm.menuName}
                              </span>
                            ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No permissions available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    className="hover:text-primary-foreground w-full sm:w-auto"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      resetFormValues();
                    }}
                  >
                    Reset
                  </Button>
                  {/* <Button
                    type="submit"
                    disabled={!isValid}
                    className="text-primary-foreground"
                  >
                    {editingUser ? "Save Changes" : "Add User"}
                  </Button> */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || (submitCount > 0 && !isValid)}
                    className="text-primary-foreground flex items-center gap-2 w-full sm:w-auto"
                  >
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {editingUser
                      ? isSubmitting
                        ? "Saving..."
                        : "Update"
                      : isSubmitting
                        ? "Adding..."
                        : "Save"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

const UsersTableSkeleton = () => (
  <div className="p-4 space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="h-10 w-32 bg-muted/30 rounded" />
        <div className="h-10 w-48 bg-muted/30 rounded" />
        <div className="h-10 w-20 bg-muted/30 rounded" />
        <div className="h-10 w-32 bg-muted/30 rounded" />
        <div className="h-10 w-24 bg-muted/30 rounded" />
        <div className="h-10 w-20 bg-muted/30 rounded" />
        <div className="h-10 w-32 bg-muted/30 rounded" />
        <div className="h-10 w-20 bg-muted/30 rounded ml-auto" />
      </div>
    ))}
  </div>
);

const RolesTableSkeleton = () => (
  <div className="p-4 space-y-3">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="h-10 w-24 bg-muted/30 rounded" />
        <div className="h-10 w-64 bg-muted/30 rounded" />
        <div className="h-10 w-48 bg-muted/30 rounded" />
        <div className="h-10 w-40 bg-muted/30 rounded" />
        <div className="h-10 w-32 bg-muted/30 rounded" />
      </div>
    ))}
  </div>
);

export default UsersRolesPage;
