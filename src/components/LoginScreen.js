import { signIn } from "next-auth/react";

const LoginScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="bg-stone-200 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-stone-800">Please log in</h1>
        <button
          onClick={() => signIn()}
          className="bg-stone-800 text-white px-4 py-2 rounded"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;