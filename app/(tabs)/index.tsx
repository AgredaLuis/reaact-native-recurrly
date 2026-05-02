import "@/global.css";
import { Link } from "expo-router";
import { styled } from 'nativewind';
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";


const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Go to Sign in</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4"> Go to Sign up</Link>
      <Link href="/subscriptions/spotify" className="mt-4 rounded bg-primary text-white p-4"> Go to Subscriptions with Id</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4"> Go to Sign up</Link>
    </SafeAreaView>
  );
}