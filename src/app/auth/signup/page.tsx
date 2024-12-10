import SignUpForm from '@/components/SignUpForm';
import Image from 'next/image';

export default function Signup() {
  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 sm:p-8 lg:p-10">
      <div className="mx-auto w-full max-w-md text-center">
        <Image
          className="mx-auto h-12 w-auto"
          src="/img/logo.svg"
          alt="GameShop logo"
        />
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          Create your account
        </h2>
      </div>

      <div className="mx-auto mt-10 w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
