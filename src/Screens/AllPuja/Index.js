import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { base_url } from '../../../App';

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [spinner, setSpinner] = useState(false);
    const [allPooja, setAllPooja] = useState([]);

    const getAllPooja = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            setSpinner(true);
            const response = await fetch(base_url + 'api/all-pooja-list', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                setSpinner(false);
                // console.log("responseData", responseData.data.all_pooja_list);
                setAllPooja(responseData.data.all_pooja_list);
            }
        } catch (error) {
            setSpinner(false);
            console.log(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            getAllPooja();
        }
    }, [isFocused])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={styles.headerTitle}>All Pooja</Text>
                </TouchableOpacity>
            </View>
            {spinner ?
                <View style={{ flex: 1, alignSelf: 'center', top: '30%' }}>
                    <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
                </View>
                :
                <View style={{ width: '96%', flex: 1, alignSelf: 'center', marginTop: 15 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={allPooja}
                        // scrollEnabled={false}
                        numColumns={3}
                        keyExtractor={(key) => key.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => props.navigation.navigate('AddPujaDetails', item)} style={styles.mostPPlrItem}>
                                <View style={{ width: '100%', height: 70, borderRadius: 10 }}>
                                    <Image source={{ uri: item.pooja_photo_url }} style={styles.mostPPImage} />
                                </View>
                                <View style={{ margin: 10, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: '100%', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontSize: 15, fontWeight: '500', textTransform: 'capitalize' }}>{item.pooja_name}</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            }
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerPart: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 13,
        paddingHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    headerTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 5,
    },
    spinnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mostPPlrItem: {
        backgroundColor: '#fff',
        width: '30%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5,
        marginBottom: 10,
        marginHorizontal: '1.5%'
    },
    mostPPImage: {
        height: '100%',
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
})