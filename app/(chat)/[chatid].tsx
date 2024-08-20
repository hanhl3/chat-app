import {
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useConvex, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as ImagePicker from 'expo-image-picker'


const Page = () => {
    const { chatid } = useLocalSearchParams()
    const [user, setUser] = useState<string | null>(null)
    const [newMessage, setNewMessage] = useState('')
    const navigation = useNavigation()
    const convex = useConvex()
    const message = useQuery(api.message.getMessage, {
        chatId: chatid as Id<'groups'>,
    })

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const listRef = useRef<FlatList>(null)

    useEffect(() => {
        const loadGroup = async () => {
            const groupInfo = await convex.query(api.groups.getGroup, {
                id: chatid as Id<'groups'>,
            })
            navigation.setOptions({
                headerTitle: groupInfo?.name,
            })
        }
        loadGroup()
    }, [chatid])

    // load message
    useEffect(() => {
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true })
        }, 300)
    }, [message])

    // loadUser
    useEffect(() => {
        const loadUser = async () => {
            const userLocal = await AsyncStorage.getItem('user')
            setUser(userLocal)
        }
        loadUser()
    }, [])

    // handel add message
    const addMessage = async () => {
        if (selectedImage) {
            setUploading(true)
            const url = `${process.env.EXPO_PUBLIC_CONVEX_SITE}/sendImage?user=${encodeURIComponent(user!)}&group_id=${chatid}&content=${encodeURIComponent(newMessage)}`

            const response = await fetch(selectedImage)
            const blob = await response.blob()

            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': blob.type! },
                body: blob,
            })

            setUploading(false)
        } else {
            const message = {
                content: newMessage,
                group_id: chatid as Id<'groups'>,
                user: user || 'lehanh',
                file: undefined,
            }
            await convex.mutation(api.message.sendMessage, message)
        }
        setNewMessage('')
        setSelectedImage(null)
    }

    // handle selecte image
    const handleSelectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            const uri = result.assets[0].uri
            setSelectedImage(uri)
        }
    }

    const renderMessage: ListRenderItem<Doc<'message'>> = ({ item }) => {
        const isUserMessage = item.user === user
        return (
            <View
                style={[
                    styles.messageContainer,
                    isUserMessage
                        ? styles.userMessageContainer
                        : styles.otherMessageContainer,
                ]}
            >
                {item.file && (
                    <Image
                        source={{ uri: item.file }}
                        style={{ width: 200, height: 100 }}
                    />
                )}
                <Text style={styles.messageText}>{item.content}</Text>
                <Text style={styles.timestamp}>
                    {new Date(item._creationTime).toLocaleTimeString()} -{' '}
                    {item.user}
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 105}
            >
                <FlatList
                    data={message}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item._id}
                    ref={listRef}
                />

                <View style={styles.sendContainer}>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: 200, height: 200 }}
                        />
                    )}

                    <TextInput
                        value={newMessage}
                        onChangeText={(text) => setNewMessage(text)}
                        style={styles.textInput}
                    ></TextInput>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSelectImage}
                    >
                        <AntDesign name="plus" size={16} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={addMessage}
                        disabled={newMessage === '' && selectedImage === null}
                    >
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {uploading && (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            )}
        </SafeAreaView>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F5EA',
    },
    chatContainer: {
        flex: 1,
    },
    sendContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#EEA217',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messageContainer: {
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    userMessageContainer: {
        backgroundColor: '#791363',
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        backgroundColor: '#191299',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        flexWrap: 'wrap',
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: 'grey',
    },
})
