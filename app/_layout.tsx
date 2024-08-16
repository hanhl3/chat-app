import Index from '.'
import { Link, Stack } from 'expo-router'
import { ConvexReactClient, ConvexProvider } from 'convex/react'
import { TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
})

export default function RootLayout() {
    return (
        <ConvexProvider client={convex}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                }}
            >
                <Stack.Screen
                    name='index'
                    options={{
                        headerTitle: 'My Chats',
                        headerRight: () => (
                            <Link href={'/(modal)/create'} asChild>
                                <TouchableOpacity>
                                <Ionicons name="add" size={32} color="white" />
                                </TouchableOpacity>
                            </Link>
                        )
                    }}
                >
                </Stack.Screen>
                <Stack.Screen
                    name='(modal)/create'
                    options={{
                        headerTitle: 'Create Chat',
                        presentation: 'modal',
                        headerLeft: () => (
                            <Link href={'/'} asChild>
                                <TouchableOpacity>
                                <Ionicons name="close-outline" size={32} color="white" />
                                </TouchableOpacity>
                            </Link>
                        )
                    }}
                >
                </Stack.Screen>
                <Stack.Screen
                    name='(chat)/[chatid]'
                    options={{
                        headerTitle: 'Chat',
                    }}
                >

                </Stack.Screen>
               
            </Stack>
        </ConvexProvider>
    ) 
}
