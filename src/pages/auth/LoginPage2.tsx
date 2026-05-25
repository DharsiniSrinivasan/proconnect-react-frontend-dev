import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Fingerprint, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { AuthState, useAuthStore } from "@/stores/authStore";
import { useThemeContext } from "@/context";
import { websocketService } from "@/services/websocketService";
import { getStorage } from "@/utils/storage";
import bgImage from "@/assets/global-logistics-transportation.avif";
interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}


const LoginPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state: AuthState) => state.login);

  const { branding } = useThemeContext();

  const isLoading = useAuthStore((state) => state.isLoading);

  const initialValues: FormValues = {
    email: "",
    password: "",
    rememberMe: false,
  };
  console.log(isLoading,'isLoading')
  const [showPassword, setShowPassword] = useState(false);
    const storage = getStorage();
    const from = location.state?.from?.pathname || "/dashboard";
    const loginValidationSchema = Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .matches(
          /^[a-zA-Z0-9._%+-]+@proconnectlogistics\.com$/i,
          "Only proconnectlogistics.com emails are allowed",
        )
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });
  
    const loginSubmit = async (values: FormValues) => {
        console.log('values',values)
        const { rememberMe, ...loginPayload } = values; // object destructuring
        const success = await login(loginPayload, rememberMe);
        if (success) {
          const role = useAuthStore.getState().user?.role;
          if (role) {
            await useAuthStore.getState().getMenu(role);
          }
          const token = storage.getItem("access_token");
          websocketService.connect(token);
          navigate(from, { replace: true });
        }
      };  
    
  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div  
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary)/0.1) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary)/0.1) 1px, transparent 1px),
                url(${bgImage})
              `,
              backgroundSize: "40px 40px, 40px 40px, cover",
              backgroundPosition: "0 0, 0 0, center",
              backgroundRepeat: "repeat, repeat, no-repeat",
            }}
          />
        </div>

        {/* Floating Orbs */
      }
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />

        <div
          className="absolute bottom-32 right-20 w-96 h-96 bg-accent/30 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-secondary/30 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">

          {/* Logo */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-8">

              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">

                  {branding.logoUrl ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-background">
                      <img
                        src={branding.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-xl font-black text-white tracking-tight">
                      D2R
                    </span>
                  )}

                </div>

                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary to-accent opacity-30 blur-lg" />
              </div>

              <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

              <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                Analytics
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Unlock D2R Edge

              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary leading-tight">
                Connecting Retail & Logistics
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Stay ahead in the retail game with logistics power.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
              <Zap className="w-4 h-4" />
              Real-time Analytics
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm">
              <Shield className="w-4 h-4" />
              Enterprise Security
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm">
              <Fingerprint className="w-4 h-4" />
              AI-Powered
            </div>

          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative">
        {/* Mobile Background Effects */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-10 right-10 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary mb-4 shadow-xl shadow-primary/25">
              {branding.logoUrl ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-background">
                  <img
                    src={branding.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <span className="text-xl font-black text-white tracking-tight">
                  D2R
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Welcome Back
            </h2>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={loginSubmit}
          >
            {({
              values,
              handleBlur,
              setFieldValue,
              handleSubmit,
              touched,
              errors,
            }) => (
              <Form
                className="space-y-5"
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                {/* Login Form */}

                {/* General Error */}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    Email
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={(e) => setFieldValue("email", e.target.value?.trim())}
                      className={`h-12 bg-muted/30 border-border/40 pl-4 pr-4 rounded-xl
                    focus:bg-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 
                    transition-all duration-300 ${
                      errors.email
                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1 animate-fade-in flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={(e) =>
                        setFieldValue("password", e.target.value?.trim())
                      }
                      className={`h-12 bg-muted/30 border-border/40 pl-4 pr-12 rounded-xl
                    focus:bg-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                    transition-all duration-300 ${
                      errors.password
                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                        : ""
                    }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1 animate-fade-in flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={values.rememberMe}
                      onCheckedChange={(checked) =>
                        setFieldValue("rememberMe", checked === true)
                      }
                      className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 relative overflow-hidden rounded-xl  hover:bg-[position:100%_0] text-primary-foreground font-semibold transition-all duration-500 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
         
        </div>
      </div>
    </div>
  );
};

export default LoginPage2;