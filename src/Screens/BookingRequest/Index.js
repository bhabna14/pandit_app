import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { base_url } from '../../../App';
import moment from 'moment';
import { RadioButton } from 'react-native-paper';

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [spinner, setSpinner] = useState(false);
    const [poojaReqst, setPoojaReqst] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const allReason = [
        { reason: 'I am not available at this time' },
        { reason: 'I am not available in this city' },
        { reason: 'Personal problem' },
    ]
    const [selectedReason, setSelectedReason] = useState(null);
    const [rejectedId, setRejectedId] = useState(null);

    const [rejectModal, setRejectModal] = useState(false);
    const closeRejectModal = () => { setRejectModal(false) };

    const getAllBookingReqst = async () => {
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
                // console.log("responseData", responseData.data.request_pooja);
                setPoojaReqst(responseData.data.request_pooja);
            }
        } catch (error) {
            setSpinner(false);
            console.log(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            getAllBookingReqst();
        }
    }, [isFocused])

    const handleApprove = async (id) => {
        // console.log(`Approved request with id: ${id}`);

        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);
        try {
            const response = await fetch(`${base_url}api/bookings/${id}/approve`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Approve Pooja Request successfully', data);
                getAllBookingReqst();
            } else {
                console.log(data.message || 'Failed to Approve pooja Request. Please try again.')
            }
        } catch (error) {
            console.log("Error", error || 'Failed to Approve pooja Request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const clickReject = (id) => {
        setRejectModal(true);
        setRejectedId(id);
    }

    const handleReject = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);
        try {

            const formData = new FormData();
            formData.append('pandit_cancel_reason', selectedReason);

            const response = await fetch(`${base_url}api/bookings/${rejectedId}/reject`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Pooja Reject successfully', data);
                closeRejectModal(false);
                getAllBookingReqst();
            } else {
                console.log(data.message || 'Failed to Reject pooja Request. Please try again.')
            }
        } catch (error) {
            console.log("Error", error || 'Failed to Reject pooja Request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <Text style={styles.headerTitle}>Pooja Request</Text>
                </TouchableOpacity>
            </View>
            {spinner ?
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#ffcb44" />
                </View>
                :
                poojaReqst.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={poojaReqst}
                        // inverted
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
                                {isLoading ?
                                    <ActivityIndicator size="large" color="#c80100" />
                                    :
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                                            <Text style={styles.buttonText}>Approve</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.rejectButton} onPress={() => clickReject(item.id)}>
                                            <Text style={styles.buttonText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        )}
                    />
                    :
                    <View style={{ flex: 1, top: '40%' }}>
                        <Text style={{ color: '#000', fontSize: 18, fontWeight: '500', textAlign: 'center' }}>No Pooja Request Found</Text>
                    </View>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={rejectModal}
                onRequestClose={closeRejectModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Reject reason</Text>
                            <TouchableOpacity onPress={closeRejectModal}>
                                <Ionicons name="close" size={30} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{}}>
                            {allReason.map((reasonObj, index) => (
                                <View key={index} style={styles.reasonContainer}>
                                    <RadioButton
                                        value={reasonObj.reason}
                                        status={selectedReason === reasonObj.reason ? 'checked' : 'unchecked'}
                                        onPress={() => setSelectedReason(reasonObj.reason)}
                                    />
                                    <Text style={styles.reasonText}>{reasonObj.reason}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        {isLoading ?
                            <ActivityIndicator size="large" color="#c80100" />
                            :
                            <TouchableOpacity
                                style={[styles.submitBtn, { backgroundColor: selectedReason ? '#e63946' : '#ccc' }]}
                                onPress={() => handleReject()}
                                disabled={!selectedReason}
                            >
                                <Text style={styles.submitBtnText}>Reject</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </Modal>
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
    bookingContainer: {
        width: '95%',
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    bookingInfo: {
        flex: 1,
        marginRight: 5
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        padding: 20,
    },
    header: {
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: '#000',
        fontSize: 17,
        fontWeight: '500',
    },
    reasonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    reasonText: {
        fontSize: 16,
        color: '#000',
    },
    submitBtn: {
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
})