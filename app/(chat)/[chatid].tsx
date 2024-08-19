import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useConvex, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const Page = () => {
    const { chatid } = useLocalSearchParams()
    const [user, setUser] = useState<string | null>(null)

    const navigation = useNavigation()
    const convex = useConvex()

    useEffect(() => {
        const loadGroup = async () => {
            const groupInfo = await convex.query(api.groups.getGroup, {
                id: chatid as Id<'groups'>,
            })
            console.log(groupInfo)

            navigation.setOptions({
                headerTitle: groupInfo?.name,
            })
        }
        loadGroup()
    }, [chatid])

    // loadUser
    useEffect(() => {
        const loadUser = async () => {
            const userLocal = await AsyncStorage.getItem('user')
            setUser(userLocal)
        }
        loadUser()
    }, [])

    return (
        <View>
            <Text>{chatid}</Text>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({})
