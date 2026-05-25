/**
 * Profile Page
 * Allows users to view and edit their profile details
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Camera, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { useUserStore } from "@/stores/userStore";
import { getStorage } from "@/utils/storage";
import { toast } from "sonner";
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProfileUserById, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const storage = getStorage();
  const token = storage.getItem("access_token");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    status: "",
    avatar: "",
  });
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = Number(payload?.sub);
        if (!userId) return;
        const res: any = await getProfileUserById(userId);
        const base64Avatar = res?.avatar
          ? `data:image/jpeg;base64,${res.avatar}`
          : "";
        setFormData({
          role: res?.role || "",
          name: res?.name || "",
          email: res?.email || "",
          status: res?.status || "",
          avatar: base64Avatar,
        });
        setAvatarPreview(base64Avatar);
      } catch (e) {
        console.error("Failed to load user", e);
      }
    })();
  }, [token]);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be less than 2MB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formDatas = new FormData();
      formDatas.append("name", formData.name);
      formDatas.append("email", formData.email);
      formDatas.append("role", formData.role);
      if (avatarFile) {
        formDatas.append("avatar", avatarFile); //  correct
      }
      const response:any = await updateUser(formDatas, user?.user_id);
      if (response?.status_code === 200) {
        toast.success(response?.message || "Profile updated successfully");
        setIsEditing(false);
        await getProfileUserById(user?.user_id);
      }
    } catch (error: any) {
     console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
  };
  return (
    <AppShell>
      <div className="space-y-6 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground">
              View and manage your account details
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Avatar Card */}
          <Card className="md:col-span-1 glass-card border-border/50">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={avatarPreview || undefined} />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {formData?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <CardTitle className="mt-4">{formData.name || "User"}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                {user?.role || "User"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </CardContent>
          </Card>
          {/* Details Card */}
          <Card className="md:col-span-2 glass-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Edit your profile information"
                    : "Your personal information"}
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="default"
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="hover:text-primary-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
              <Separator className="bg-border/50" />
              {/* <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Operations, Finance"
                  />
                </div>
              </div> */}
              {/* <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., Manager, Analyst"
                />
              </div> */}
              <Separator className="bg-border/50" />
              {/* Account Info (Read-only) */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Account Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div className="flex justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium text-foreground">
                      {user?.role || "User"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-green-500">
                      {formData?.status ?? "Deactive"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};
export default ProfilePage;
