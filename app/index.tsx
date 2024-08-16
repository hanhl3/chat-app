import { useQuery } from 'convex/react'
import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native'
import { api } from '../convex/_generated/api'
import { Link } from 'expo-router'

const Index = () => {
    const groups = useQuery(api.groups.getAllGroups) || []

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {groups.map((group) => (
                    <Link
                        href={{
                            pathname: '/(chat)/[chatid]',
                            params: { chatid: group._id },
                        }}
                        key={group._id}
                    >
                        <TouchableOpacity style={styles.group}>
                            <Image
                                source={{ uri: group.icon_url }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 7,
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16 }}>
                                    {group.name}
                                </Text>
                                <Text style={{ color: 'grey' }}>
                                    {group.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Link>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F8F5EA',
    },
    group: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 10,
        gap: 10,
        borderRadius: 10,
        shadowColor: '#000',
        elevation: 3,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
})

export default Index
