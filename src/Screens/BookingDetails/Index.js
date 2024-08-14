import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const BookingDetails = (props) => {

    const navigation = useNavigation();

    useEffect(() => {
        console.log("pooja details", props.route.params);
    }, [])

    const maskPhoneNumber = (phoneNumber) => {
        if (phoneNumber.length <= 4) {
            return phoneNumber;
        }
        const visiblePart = phoneNumber.slice(0, 4);
        const maskedPart = '*'.repeat(phoneNumber.length - 4);
        return `${visiblePart}${maskedPart}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={styles.headerTitle}>Booking Details</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.detailsTable}>
                    {props?.route?.params?.user?.name ?
                        <DetailRow label="User Name" value={props?.route?.params?.user?.name} />
                        :
                        <DetailRow label="User Name" value={maskPhoneNumber(props?.route?.params?.user?.mobile_number)} />
                    }
                    <DetailRow label="Pooja Name" value={props?.route?.params?.pooja?.pooja_name} />
                    <DetailRow label="User Mobile" value={maskPhoneNumber(props?.route?.params?.user?.mobile_number)} />
                    <DetailRow label="Pooja Fee" value={`₹${props?.route?.params?.pooja_fee}`} />
                    {/* <DetailRow label="Paid Amount" value={`₹${props?.route?.params?.paid === null ? 0 : props?.route?.params?.paid}`} /> */}
                    <DetailRow label="Date & Time" value={moment(props?.route?.params?.booking_date).format('Do MMMM YYYY h:mma')} />
                    <DetailRow label="Address" value={props?.route?.params?.address?.area + ", " + props?.route?.params?.address?.city + ", " + props?.route?.params?.address?.state + ", " + props?.route?.params?.address?.pincode} isLastItem={true} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const DetailRow = ({ label, value, isLastItem }) => (
    <View style={[styles.detailRow, isLastItem && styles.lastDetailRow]}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default BookingDetails;

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
    contentContainer: {
        padding: 20,
    },
    detailsTable: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    lastDetailRow: {
        borderBottomWidth: 0,
    },
    detailLabel: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    detailValue: {
        width: '50%',
        color: '#555',
        fontSize: 16,
        textAlign: 'right',
    },
});
