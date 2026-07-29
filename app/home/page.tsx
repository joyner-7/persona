import { AuthGuard } from "@/components/auth/AuthGuard";
import { HomeCover } from "@/components/home/HomeCover";

export default function AuthorizedHomePage() {
  return (
    <AuthGuard>
      <HomeCover startHref="/test/family-origin" />
    </AuthGuard>
  );
}
