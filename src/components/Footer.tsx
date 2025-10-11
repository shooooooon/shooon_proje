import Link from 'next/link';
import {
  Github,
  Twitter,
  Mail,
  ExternalLink,
  Code2,
  Database,
  Palette,
  FileCode
} from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: Github,
      hoverColor: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter,
      hoverColor: 'hover:text-blue-400'
    },
    {
      name: 'Email',
      href: 'mailto:contact@modernblog.com',
      icon: Mail,
      hoverColor: 'hover:text-red-400'
    }
  ];

  const techStack = [
    { name: 'Next.js 15', icon: Code2, href: 'https://nextjs.org' },
    { name: 'Supabase', icon: Database, href: 'https://supabase.com' },
    { name: 'Tailwind CSS', icon: Palette, href: 'https://tailwindcss.com' },
    { name: 'TypeScript', icon: FileCode, href: 'https://typescriptlang.org' }
  ];

  const quickLinks = [
    { name: 'ホーム', href: '/' },
    { name: '管理画面', href: '/admin' },
    { name: 'プライバシーポリシー', href: '/privacy' },
    { name: 'お問い合わせ', href: '/contact' }
  ];

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Modern Blog</h3>
            <p className="text-muted-foreground leading-relaxed">
              Next.js + Supabase で作られた現代的なブログシステム。
              AI記事生成やCLI投稿ツールなど、先進的な機能を搭載。
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`text-muted-foreground transition-colors duration-200 ${social.hoverColor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">クイックリンク</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">技術スタック</h4>
            <div className="space-y-3">
              {techStack.map((tech) => {
                const IconComponent = tech.icon;
                return (
                  <Link
                    key={tech.name}
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tech.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 Modern Blog. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
