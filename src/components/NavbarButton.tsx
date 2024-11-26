import { ReactNode } from 'react'
import Link from 'next/link'

export const navbarButtonClasses =
'rounded-full p-2 text-gray-400 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-300';

interface NavbarButtonProps {
  href: string;
  children: ReactNode;
}

export default function NavbarButton({ href, children }: NavbarButtonProps) {
  return (
    <Link href={href} className={navbarButtonClasses}>
      {children}
    </Link>
  )
}