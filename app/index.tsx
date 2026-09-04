import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, this would check auth state and whether onboarding was completed
  return <Redirect href="/onboarding" />;
}
