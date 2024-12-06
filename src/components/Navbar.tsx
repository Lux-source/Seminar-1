import {
  ArrowRightStartOnRectangleIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import NavbarButton from '@/components/NavbarButton'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import NavbarCartButton from './NavbarCartButton';

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className='fixed top-0 z-50 w-full bg-gray-800 bg-opacity-90 backdrop-blur-lg backdrop-filter dark:bg-gray-800 dark:bg-opacity-90'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='flex flex-1 items-stretch justify-start'>
            <Link
              className="flex flex-shrink-0 items-center space-x-4 text-gray-300 hover:text-gray-100 dark:text-gray-300 dark:hover:text-gray-100"
              href='/'
            >
              <img
                className='block h-8 w-auto'
                src='/img/logo.svg'
                alt='Eterna logo'
              />
              <div className='inline-block w-auto text-xl font-semibold'>
                Eterna
              </div>
            </Link>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center space-x-4'>
            {session ? (
              <>
                <NavbarCartButton userId={session.userId} href='/cart'>
                  <span className='sr-only'>Cart</span> 
                  <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarCartButton>
                <NavbarButton href='/profile'>
                  <span className='sr-only'>User profile</span>
                  <UserIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarButton>
                <NavbarButton href='#'>
                  <span className='sr-only'>Sign out</span>
                  <ArrowRightStartOnRectangleIcon
                    className='h-6 w-6'
                    aria-hidden='true'
                  />
                </NavbarButton>
              </>
            ) : (
              <>
                <Link
                  href='/auth/signup'
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Sign up
                </Link>
                <Link
                  href='/auth/signin'
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}