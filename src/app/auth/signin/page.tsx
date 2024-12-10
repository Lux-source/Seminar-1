import SignInForm from '@/components/SignInForm';
import Link from 'next/link';
import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-md text-center">
        <Image
          className="mx-auto h-12 w-auto"
          src="/img/logo.svg"
          alt="GameShop logo"
        />
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
      </div>

      <div className="mx-auto mt-10 w-full max-w-md">
        <SignInForm />

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Not a member?{' '}
          <Link
            href="/auth/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Register now!
          </Link>
        </p>
      </div>
    </div>
  );
}
