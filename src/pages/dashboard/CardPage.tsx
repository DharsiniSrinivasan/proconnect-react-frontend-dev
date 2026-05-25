import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Panda,
  Dog,
  Squirrel,
  Sun,
  BadgeIndianRupee,
  ChessKnight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShipmentMetrics {
  totalShipments: number;
  delayedShipments: number;
  onTimeRate: number;
  avgDeliveryDays: number;
  costSavings: number;
  bestTransporter: string;
}

interface FormFields {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

function ShipmentDashboard() {
  const [shipmentData] = useState<ShipmentMetrics>({
    totalShipments: 1089,
    delayedShipments: 345,
    onTimeRate: 68.32,
    avgDeliveryDays: 4.2,
    costSavings: 150000,
    bestTransporter: "DHL",
  });
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitted Data:", formData);
      handleOpenChange(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFormData({ name: "", username: "", email: "", password: "" });
      setErrors({});
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Click</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Validation Form</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                  className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username"
                  className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email"
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter Password"
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <Card className="relative">
          <CardHeader>
            <Panda
              className="absolute inset-y-0 right-5 m-auto"
              color="#15d11e"
              size={27}
            />
            <CardTitle>Total Shipments</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold">
              {shipmentData.totalShipments}
            </h2>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <Dog
              className="absolute inset-y-0 right-5 m-auto"
              color="#9d152a"
              size={27}
            />
            <CardTitle>Delayed Shipments</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold text-orange-500">
              {shipmentData.delayedShipments}
            </h2>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <Squirrel
              className="absolute inset-y-0 right-5 m-auto"
              color="#ec0b74"
              size={27}
            />
            <CardTitle>On-Time Rate</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold text-green-500">
              {shipmentData.onTimeRate}%
            </h2>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <Sun
              className="absolute inset-y-0 right-5 m-auto"
              color="#f9d109"
              size={27}
            />
            <CardTitle>Avg Delivery Days</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold">
              {shipmentData.avgDeliveryDays}
            </h2>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <BadgeIndianRupee
              className="absolute inset-y-0 right-5 m-auto"
              color="#47818d"
              size={27}
            />
            <CardTitle>Cost Savings</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold text-primary">
              ₹{shipmentData.costSavings}
            </h2>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardHeader>
            <ChessKnight
              className="absolute inset-y-0 right-5 m-auto"
              color="#7e7174"
              size={27}
            />
            <CardTitle>Best Transporter</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold">
              {shipmentData.bestTransporter}
            </h2>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
  <CardHeader>
    <CardTitle>Shipment Data Table</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell>Total Shipments</TableCell>
          <TableCell>{shipmentData.totalShipments}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Delayed Shipments</TableCell>
          <TableCell>{shipmentData.delayedShipments}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>On-Time Rate</TableCell>
          <TableCell>{shipmentData.onTimeRate}%</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Avg Delivery Days</TableCell>
          <TableCell>{shipmentData.avgDeliveryDays}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Cost Savings</TableCell>
          <TableCell>₹{shipmentData.costSavings}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Best Transporter</TableCell>
          <TableCell>{shipmentData.bestTransporter}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
      </div>
  );
}

export default ShipmentDashboard;