import { useSignIn } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native'

export default function SignInScreen() {
    const { signIn, errors, fetchStatus } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleSubmit = async () => {
        if (!signIn) return;
        
        try {
            const { error } = await signIn.password({
                emailAddress,
                password,
            })
            
            if (error) {
                console.error(JSON.stringify(error, null, 2))
                return
            }

            if (signIn.status === 'complete') {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        const url = decorateUrl('/')
                        if (url.startsWith('http')) {
                            window.location.href = url
                        } else {
                            router.push(url as Href)
                        }
                    },
                })
            } else {
                console.error('Sign-in attempt not complete:', signIn)
            }
        } catch (err) {
            console.error('Sign-in error:', err)
        }
    }

    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView className="auth-screen" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View className="auth-content">
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurly</Text>
                                    <Text className="auth-wordmark-sub">SMART BILLING</Text>
                                </View>
                            </View>
                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text>
                        </View>

                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Email</Text>
                                    <TextInput
                                        className="auth-input"
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#666666"
                                        onChangeText={(text) => setEmailAddress(text)}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        className="auth-input"
                                        value={password}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#666666"
                                        secureTextEntry={true}
                                        onChangeText={(text) => setPassword(text)}
                                    />
                                </View>
                                
                                <Pressable
                                    className={`auth-button ${(fetchStatus === 'fetching' || !emailAddress || !password) ? 'auth-button-disabled' : ''}`}
                                    onPress={handleSubmit}
                                    disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                                >
                                    <Text className="auth-button-text !text-white">Sign in</Text>
                                </Pressable>

                                {errors?.fields?.identifier && (
                                    <Text className="auth-error text-center">{errors.fields.identifier.message}</Text>
                                )}
                                {errors?.fields?.password && (
                                    <Text className="auth-error text-center">{errors.fields.password.message}</Text>
                                )}

                                <View className="auth-link-row">
                                    <Text className="auth-link-copy">New to Recurly?</Text>
                                    <Link href="/(auth)/sign-up" asChild>
                                        <Pressable>
                                            <Text className="auth-link">Create an account</Text>
                                        </Pressable>
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}