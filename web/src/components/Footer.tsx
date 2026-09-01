'use client';

import { Linkedin, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                title={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-indigo-500" />
            <span className="text-sm text-muted-foreground">Join our community</span>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Discord Channel
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          Context Engineering Lab &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
