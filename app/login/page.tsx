import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading…" />}>
      <LoginForm />
    </Suspense>
  );
}
