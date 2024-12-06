import SignUpForm from '@/components/SignUpForm';

export default function Signup() {
import SignUpForm from '@/components/SignUpForm';

export default function Signup() {
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-sm text-center">
      <img
          className='mx-auto h-10 w-auto'
          src='/img/logo.svg'
          alt='GameShop logo'
        />
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
        Create your account
        </h2>
      </div>

      <div className="mx-auto mt-10 w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
