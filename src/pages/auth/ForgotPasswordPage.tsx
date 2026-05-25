import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background animated-gradient p-4">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary mb-4 shadow-lg shadow-secondary/25">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isSuccess ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSuccess
              ? "We've sent you a password reset link"
              : "No worries, we'll send you reset instructions"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 neon-border">
          {isSuccess ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 border border-success/30 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>

              <div className="space-y-2">
                <p className="text-foreground">Reset link sent to</p>
                <p className="text-primary font-medium">{email}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                Click the link in the email to reset your password. If you don't
                see it, check your spam folder.
              </p>

              <Link to="/login" className="block">
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-200">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 bg-muted/50 border-border/50 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all ${
                    error
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-xs text-destructive mt-1 animate-fade-in">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-secondary to-primary text-secondary-foreground font-semibold hover:shadow-lg hover:shadow-secondary/25 hover:scale-[1.02] transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/70 mt-6">
          Need help?{" "}
          <button className="text-primary/80 hover:text-primary transition-colors hover:underline">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
