import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex items-center justify-between h-16">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LankaGuide AI. All rights reserved.
        </p>
        <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-primary">
          Admin Portal
        </Link>
      </div>
    </footer>
  );
}
