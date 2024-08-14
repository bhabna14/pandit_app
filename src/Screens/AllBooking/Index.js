import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { base_url } from '../../../App';
import moment from 'moment';

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [spinner, setSpinner] = useState(false);
    const [allBooking, setAllBooking] = useState([]);

    const getAllBooking = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            setSpinner(true);
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
                setSpinner(false);
                // console.log("responseData", responseData.data.today_pooja);
                setAllBooking(responseData.data.approved_pooja);
            }
        } catch (error) {
            setSpinner(false);
            console.log(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            getAllBooking();
        }
    }, [isFocused])

    const maskPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length <= 4) {
            return phoneNumber;
        }
        const visiblePart = phoneNumber.slice(0, 4);
        const maskedPart = '*'.repeat(phoneNumber.length - 4);
        return `${visiblePart}${maskedPart}`;
    };

    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', item)} style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{item?.pooja?.pooja_name}</Text>
                {item?.user?.name ?
                    <Text style={styles.bookingDate}>{item?.user?.name}</Text>
                    :
                    <Text style={styles.bookingDate}>{maskPhoneNumber(item.user.mobile_number)}</Text>
                }
                <Text style={styles.bookingDate}>{moment(item.booking_date).format('Do MMMM YYYY')}</Text>
                <Text style={styles.bookingDate}>{moment(item?.booking_date).format('h:mma')}</Text>
            </TouchableOpacity>
            <View style={styles.actionsContainer}>
                {item.status === 'pending' && item.application_status === 'pending' && item.payment_status === 'pending' && item.pooja_status === 'pending' &&
                    <Text style={{ color: '#f5982f', fontSize: 17, fontWeight: '500' }}>Pending</Text>
                }
                {item.status === 'pending' && item.application_status === 'approved' && item.payment_status === 'pending' && item.pooja_status === 'pending' &&
                    < Text style={{ color: '#f5e93d', fontSize: 17, fontWeight: '500' }}>Payment Pending</Text>
                }
                {item.status === 'paid' && item.application_status === 'approved' && item.payment_status === 'paid' && item.pooja_status === 'pending' &&
                    < Text style={{ color: '#0bbfad', fontSize: 17, fontWeight: '500' }}>Payment Done</Text>
                }
                {item.status === 'paid' && item.application_status === 'approved' && item.payment_status === 'paid' && item.pooja_status === 'completed' &&
                    < Text style={{ color: '#0bbfad', fontSize: 17, fontWeight: '500' }}>Completed</Text>
                }
                {item.status === 'rejected' && item.application_status === 'rejected' && item.payment_status === 'rejected' && item.pooja_status === 'rejected' &&
                    < Text style={{ color: '#cf0a0e', fontSize: 17, fontWeight: '500' }}>Rejected</Text>
                }
                {item.status === 'canceled' && item.application_status === 'approved' && item.payment_status === 'refundprocess' && item.pooja_status === 'canceled' &&
                    < Text style={{ color: '#e85659', fontSize: 17, fontWeight: '500' }}>Cancel</Text>
                }
                {item.status === 'paid' && item.application_status === 'approved' && item.payment_status === 'paid' && item.pooja_status === 'started' &&
                    < Text style={{ color: '#323be3', fontSize: 17, fontWeight: '500' }}>Pooja Stated</Text>
                }
            </View>
        </View >
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={styles.headerTitle}>All Booking</Text>
                </TouchableOpacity>
            </View>
            {spinner ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#ffcb44" />
                </View>
            ) : (
                allBooking.length > 0 ?
                    <FlatList
                        data={allBooking}
                        // inverted
                        renderItem={renderBookingItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                    />
                    :
                    <View style={{ flex: 1, top: '40%' }}>
                        <Text style={{ color: '#000', fontSize: 18, fontWeight: '500', textAlign: 'center' }}>No Booking Found</Text>
                    </View>
            )}
        </SafeAreaView>
    );
};

export default Index;

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
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 10,
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
        width: '70%',
        // backgroundColor: 'green'
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
    },
    actionsContainer: {
        width: '30%',
        // backgroundColor: 'red',
        // flexDirection: 'row',
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
})