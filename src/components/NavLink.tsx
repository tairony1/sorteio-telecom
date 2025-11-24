'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  className?: string
  activeClassName?: string
  pendingClassName?: string // Next.js não tem "pending", mas deixamos por compatibilidade
  children: React.ReactNode
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    { href, className, activeClassName, pendingClassName, children, ...props },
    ref
  ) => {
    const pathname = usePathname()

    const isActive = pathname === href
    const isPending = false // Next.js não possui isso ainda

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          className,
          isActive && activeClassName,
          isPending && pendingClassName
        )}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

NavLink.displayName = 'NavLink'

export { NavLink }
