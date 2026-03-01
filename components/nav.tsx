'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Nav() {
  return (
    <header className="w-full border-b border-ui">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="type-logo fg-primary hover:opacity-60 transition-opacity"
        >
          pivoshenko.wallpapers
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="https://pivoshenko.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="type-ui fg-subtle hover-primary transition-colors"
          >
            Blog
          </a>
          <div className="pl-2 border-l border-ui">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
