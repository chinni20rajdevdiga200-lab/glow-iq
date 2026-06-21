import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ScanTab() {
  const router = useRouter();
  useEffect(() => { router.replace('/scan'); }, []);
  return null;
}
