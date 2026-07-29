"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ui } from "@/lib/ui";
import { hasLicenseSession } from "@/lib/auth/license";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    if (hasLicenseSession()) {
      frame = requestAnimationFrame(() => setAllowed(true));
    } else {
      router.replace("/");
    }

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [router]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <div className={ui.spinner} />
      </main>
    );
  }

  return <>{children}</>;
}
