import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">LifePilot AI</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/pricing" className="btn-secondary">Pricing</Link>
          <Link href="/auth/signin" className="btn-primary">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
