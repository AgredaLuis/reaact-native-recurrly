import { useAuth } from '@clerk/expo';
import { styled } from 'nativewind';
import { Text, Pressable, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const { signOut } = useAuth();

    return (
        <SafeAreaView className="flex-1 p-5 bg-background">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
            </View>
            
            <Pressable 
                className="items-center rounded-2xl bg-destructive py-4 mt-auto mb-10"
                onPress={() => signOut()}
            >
                <Text className="text-base font-sans-bold text-white">Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}
export default Settings