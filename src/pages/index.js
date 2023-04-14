import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import LoginScreen from '@/components/LoginScreen'
import HomeScreen from '@/components/HomeScreen'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <LoginScreen />
    );
  }

  return (
    <HomeScreen />
  );
}