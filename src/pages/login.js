import { signIn } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  if (session) {
    router.replace('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 bg-stone-100">
      <div className="bg-stone-200 p-8 w-80 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-stone-800">Please log in</h1>
        <button
          onClick={() => signIn()}
          className="bg-stone-800 text-white px-4 py-2 rounded w-full"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Login;