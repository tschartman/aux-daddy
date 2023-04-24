import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (!session) {
      router.replace('/login');
      return null;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;