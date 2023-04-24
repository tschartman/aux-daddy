import HomeScreen from '@/components/HomeScreen';
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <HomeScreen/>
  );
}