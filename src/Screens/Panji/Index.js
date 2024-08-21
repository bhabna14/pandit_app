import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import { base_url } from '../../../App';

const Index = (props) => {

    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [poojaBooking, setPoojaBooking] = useState([]);
    const [dateWisePoojaList, setDateWisePoojaList] = useState([]);
    const [markedDates, setMarkedDates] = useState({});

    const getAllPoojaBooking = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            const response = await fetch(base_url + 'api/approved-pooja', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                const pendingPooja = responseData.data.approved_pooja.filter(item =>
                    item.status === 'paid' &&
                    item.application_status === 'approved' &&
                    item.payment_status === 'paid' &&
                    item.pooja_status === 'pending'
                );
                setPoojaBooking(pendingPooja);
                filterPoojaListByDate(pendingPooja, selectedDate);
                markPoojaDates(pendingPooja);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const filterPoojaListByDate = (list, date) => {
        const filteredList = list.filter(item => moment(item.booking_date).format('YYYY-MM-DD') === date);
        setDateWisePoojaList(filteredList);
    }

    const markPoojaDates = (list) => {
        const counts = list.reduce((acc, item) => {
            const date = moment(item.booking_date).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = {
                    selected: true,
                    selectedColor: 'blue',
                    customStyles: {
                        container: {
                            backgroundColor: 'transparent',
                        },
                        text: {
                            color: 'red',
                            fontWeight: 'bold',
                        }
                    },
                    poojaCount: 1
                };
            } else {
                acc[date].poojaCount += 1;
            }
            return acc;
        }, {});
        setMarkedDates(counts);
    }

    const handleDateChange = (day) => {
        const formattedDate = moment(day.dateString, 'YYYY-MM-DD').format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
        filterPoojaListByDate(poojaBooking, formattedDate);
    }

    useEffect(() => {
        getAllPoojaBooking();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Panji</Text>
                </TouchableOpacity>
            </View>
            <View style={{ padding: 10 }}>
                <Calendar
                    markedDates={{
                        ...markedDates,
                        [selectedDate]: {
                            selected: true,
                            selectedColor: 'blue',
                            marked: markedDates[selectedDate]?.poojaCount > 0,
                            customStyles: {
                                container: {
                                    backgroundColor: '#1e90ff',
                                },
                                text: {
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    textDecorationLine: markedDates[selectedDate]?.poojaCount > 0 ? 'underline' : 'none',
                                    textDecorationStyle: 'solid',
                                    textDecorationColor: '#ff0000',
                                    // Add the pooja count
                                    content: markedDates[selectedDate]?.poojaCount > 0 ? `(${markedDates[selectedDate].poojaCount})` : '',
                                }
                            },
                        },
                    }}
                    markingType={'custom'}  // Use custom marking type
                    onDayPress={handleDateChange}
                />
            </View>
            <ScrollView style={{ flex: 1, padding: 10 }}>
                {dateWisePoojaList.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={dateWisePoojaList}
                        scrollEnabled={false}
                        keyExtractor={(key) => key.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.bookingContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', item)} style={styles.bookingInfo}>
                                    <Text style={styles.bookingTitle}>{item?.pooja?.pooja_name}</Text>
                                    {item?.user?.name ?
                                        <Text style={styles.bookingDate}>{item?.user?.name}</Text>
                                        :
                                        <Text style={styles.bookingDate}>{maskPhoneNumber(item.user.mobile_number)}</Text>
                                    }
                                    <Text style={styles.bookingDate}>{moment(item?.booking_date).format('Do MMMM YYYY')}</Text>
                                    <Text style={styles.bookingDate}>{moment(item?.booking_date).format('h:mma')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    :
                    <View style={{ marginTop: 140 }}>
                        <Text style={{ color: '#000', fontSize: 18, fontWeight: '500', textAlign: 'center' }}>No Pooja Found</Text>
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    headerPart: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 13,
        paddingHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 13,
        elevation: 5
    },
    bookingContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    bookingInfo: {
        width: '100%',
    },
    bookingTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    bookingDate: {
        color: '#555',
        fontSize: 15,
        marginTop: 3,
    }
});
