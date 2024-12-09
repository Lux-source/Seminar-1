import SignInForm from '@/components/SignInForm'
import Link from 'next/link'
import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-sm text-center">
      <Image
          className='mx-auto h-10 w-auto'
          src='/img/logo.svg'
          alt='GameShop logo'
        />
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
        Sign in to your account
        </h2>
      </div>

      <div className="mx-auto mt-10 w-full max-w-sm">
        <SignInForm />

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Not a member?{' '}
          <Link
            href='/auth/signup'
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Register now!
          </Link>
        </p>
      </div>
    </div>
  )
}