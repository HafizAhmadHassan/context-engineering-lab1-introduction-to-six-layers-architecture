import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <div className="flex gap-4">
        <Link href="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Dashboard
        </Link>
        <Link href="/" className="px-4 py-2 bg-secondary rounded-lg font-medium hover:bg-accent transition-colors">
          Home
        </Link>
      </div>
    </div>
  );
}
