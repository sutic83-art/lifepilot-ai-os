"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

function SignInContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") || "/dashboard";
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result) {
        setError(t.auth.signInFailed);
        return;
      }

      if (result.error) {
        setError(t.auth.invalidCredentials);
        return;
      }

      router.push(result.url || callbackUrl);
      router.refresh();
    } catch {
      setError(t.auth.signInFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-md space-y-6 rounded-3xl border p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t.auth.signInTitle}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t.auth.signInDescription}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.auth.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t.auth.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? t.auth.loadingSignIn : t.auth.signInButton}
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-red-300 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          {t.auth.noAccount}{" "}
          <Link href="/auth/signup" className="font-medium text-black underline">
            {t.auth.goToSignUp}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-6 md:p-10">
          <div className="mx-auto max-w-md rounded-3xl border p-8">
            Loading...
          </div>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}