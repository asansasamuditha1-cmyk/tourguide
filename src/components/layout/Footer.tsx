export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex items-center justify-center h-16">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LankaGuide AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
