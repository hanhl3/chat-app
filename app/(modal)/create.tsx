import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const Page = () => {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [icon, setIcon] = useState('')

    const router = useRouter()

    const startGroup = useMutation(api.groups.createGroup)

    const onCreateGroup = async () => {
        await startGroup({
            description: desc,
            icon_url: icon,
            name: name,
        })
        router.back()
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={(text) => setName(text)}
            ></TextInput>

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.textInput}
                value={desc}
                onChangeText={(text) => setDesc(text)}
            ></TextInput>

            <Text style={styles.label}>Icon</Text>
            <TextInput
                style={styles.textInput}
                value={icon}
                onChangeText={(text) => setIcon(text)}
            ></TextInput>

            <TouchableOpacity style={styles.button} onPressIn={() => onCreateGroup()}>
                <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F5E4',
        padding: 10,
    },
    label: {
        marginVertical: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#EEA217',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
