import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Page = () => {
    const { chatid } = useLocalSearchParams()
    return (
        <View>
            <Text>{chatid}</Text>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({})
