import { useSignUp, useAuth } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native'

export default function SignUpScreen() {
    const { signUp, errors, fetchStatus } = useSignUp()
    const { isSignedIn } = useAuth()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [code, setCode] = React.useState('')

    const handleSubmit = async () => {
        if (!signUp) return;
        
        try {
            const { error } = await signUp.password({
                emailAddress,
                password,
            })
            if (error) {
                console.error(JSON.stringify(error, null, 2))
                return
            }

            if (!error) await signUp.verifications.sendEmailCode()
        } catch (err) {
            console.error('Sign-up error:', err)
        }
    }

    const handleVerify = async () => {
        if (!signUp) return;
        
        try {
            await signUp.verifications.verifyEmailCode({
                code,
            })
            if (signUp.status === 'complete') {
                await signUp.finalize({
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
                console.error('Sign-up attempt not complete:', signUp)
            }
        } catch (err) {
            console.error('Verification error:', err)
        }
    }

    if (signUp?.status === 'complete' || isSignedIn) {
        return null
    }

    if (
        signUp?.status === 'missing_requirements' &&
        signUp.unverifiedFields.includes('email_address') &&
        signUp.missingFields.length === 0
    ) {
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
                                <Text className="auth-title">Verify your account</Text>
                                <Text className="auth-subtitle">We sent a code to your email.</Text>
                            </View>

                            <View className="auth-card">
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification Code</Text>
                                        <TextInput
                                            className="auth-input"
                                            style={{ textAlign: 'center', fontSize: 24, letterSpacing: 4 }}
                                            value={code}
                                            placeholder="123456"
                                            placeholderTextColor="#cccccc"
                                            onChangeText={(text) => setCode(text)}
                                            keyboardType="numeric"
                                            maxLength={6}
                                        />
                                    </View>
                                    
                                    <Pressable
                                        className={`auth-button ${(fetchStatus === 'fetching' || !code) ? 'auth-button-disabled' : ''}`}
                                        onPress={handleVerify}
                                        disabled={!code || fetchStatus === 'fetching'}
                                    >
                                        <Text className="auth-button-text !text-white">Verify</Text>
                                    </Pressable>

                                    {errors?.fields?.code && (
                                        <Text className="auth-error text-center">{errors.fields.code.message}</Text>
                                    )}

                                    <Pressable
                                        className="auth-secondary-button mt-2"
                                        onPress={() => signUp.verifications.sendEmailCode()}
                                    >
                                        <Text className="auth-secondary-button-text">I need a new code</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
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
                            <Text className="auth-title">Create an account</Text>
                            <Text className="auth-subtitle">Sign up to start managing your subscriptions</Text>
                        </View>

                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Email</Text>
                                    <TextInput
                                        className="auth-input"
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="Enter email"
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
                                        placeholder="Enter password"
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
                                    <Text className="auth-button-text !text-white">Sign up</Text>
                                </Pressable>

                                {errors?.fields?.emailAddress && (
                                    <Text className="auth-error text-center">{errors.fields.emailAddress.message}</Text>
                                )}
                                {errors?.fields?.password && (
                                    <Text className="auth-error text-center">{errors.fields.password.message}</Text>
                                )}

                                <View className="auth-link-row">
                                    <Text className="auth-link-copy">Already have an account?</Text>
                                    <Link href="/(auth)/sign-in" asChild>
                                        <Pressable>
                                            <Text className="auth-link">Sign in</Text>
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