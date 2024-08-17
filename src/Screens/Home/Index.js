import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Modal, Image, TouchableOpacity, RefreshControl, ScrollView, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableHighlight, LogBox, BackHandler, ToastAndroid } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import DrawerModal from '../../Component/DrawerModal';
import { base_url } from '../../../App';
import moment from 'moment';

const Index = (props) => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [spinner, setSpinner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => { setModalVisible(true) };
  const closeModal = () => { setModalVisible(false) };
  const [poojaReqst, setPoojaReqst] = useState([]);
  const [todatPoojas, setTodatPoojas] = useState([]);
  const [selectedPooja, setSelectedPooja] = useState([]);
  const [allPooja, setAllPooja] = useState([]);
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

  const [errorModal, setErrorModal] = useState(false);
  const closeErrorModal = () => { setErrorModal(false); }
  const [errormasg, setErrormasg] = useState(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getHomePageData();
      console.log("Refreshing Successful");
    }, 2000);
  }, []);

  const [profileDetails, setProfileDetails] = useState({});

  const getProfile = async () => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      const response = await fetch(base_url + 'api/show-profile-details', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      });
      const responseData = await response.json();
      if (responseData.status === 200) {
        // console.log("getProfile-------", responseData.data.pandit_profile);
        setProfileDetails(responseData?.data?.pandit_profile);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
        getHomePageData();
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
        getHomePageData();
      } else {
        console.log(data.message || 'Failed to Reject pooja Request. Please try again.')
      }
    } catch (error) {
      console.log("Error", error || 'Failed to Reject pooja Request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async (item) => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      const response = await fetch(`${base_url}api/bookings/start`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          booking_id: item.booking_id,
          pooja_id: item.pooja_id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Pooja Started successfully', data);
        getHomePageData();
      } else {
        console.log(data.message || 'Failed to Started pooja. Please try again.')
        setErrormasg(data.message || 'Failed to Started pooja. Please try again.');
        setErrorModal(true);
      }
    } catch (error) {
      console.log("Error", error || 'Failed to Started pooja. Please try again.');
      setErrormasg(error || 'Failed to Started pooja. Please try again.');
      setErrorModal(true);
    }
  }

  const handleEnd = async (item) => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      const response = await fetch(`${base_url}api/bookings/end`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          booking_id: item.booking_id,
          pooja_id: item.pooja_id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Pooja Ended successfully', data);
        getHomePageData();
      } else {
        console.log(data.message || 'Failed to Ended pooja. Please try again.');
        setErrormasg(data.message || 'Failed to Ended pooja. Please try again.');
        setErrorModal(true);
      }
    } catch (error) {
      console.log("Error", error || 'Failed to Ended pooja. Please try again.');
      setErrormasg(error || 'Failed to Ended pooja. Please try again.');
      setErrorModal(true);
    }
  }

  const getHomePageData = async () => {
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
        // console.log("responseData", responseData.data.today_pooja);
        setPoojaReqst(responseData.data.request_pooja);
        setTodatPoojas(responseData.data.today_pooja);
        setSelectedPooja(responseData.data.selected_pooja);
        setAllPooja(responseData.data.all_pooja_list);
      }
    } catch (error) {
      setSpinner(false);
      console.log(error);
    }
  }

  const [allBooking, setAllBooking] = useState([]);

  const getAllPendingPooja = async () => {
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
        const pendingPooja = responseData.data.approved_pooja.filter(item =>
          item.status === 'paid' &&
          item.application_status === 'approved' &&
          item.payment_status === 'paid' &&
          item.pooja_status === 'pending'
        );

        setAllBooking(pendingPooja);
      }
    } catch (error) {
      setSpinner(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      getHomePageData();
      getProfile();
      getAllPendingPooja();
    }
  }, [isFocused])

  const [backPressCount, setBackPressCount] = useState(0);

  useEffect(() => {
    const handleBackPress = () => {
      if (backPressCount === 1) {
        BackHandler.exitApp(); // Exit the app if back button is pressed twice within 2 seconds
        return true;
      }

      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      setBackPressCount(1);

      const timeout = setTimeout(() => {
        setBackPressCount(0);
      }, 2000); // Reset back press count after 2 seconds

      return true; // Prevent default behavior
    };

    if (isFocused) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => backHandler.remove(); // Cleanup the event listener when the component unmounts or navigates away
    }
  }, [backPressCount, isFocused]);

  const maskPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length <= 4) {
      return phoneNumber;
    }
    const visiblePart = phoneNumber.slice(0, 4);
    const maskedPart = '*'.repeat(phoneNumber.length - 4);
    return `${visiblePart}${maskedPart}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <DrawerModal visible={isModalVisible} navigation={navigation} onClose={closeModal} />
      <View style={{ width: '100%', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 13, elevation: 5 }}>
        <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          {profileDetails?.name ?
            <Text style={{ color: '#000', fontSize: 17 }}>Hey, <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>{profileDetails?.name?.split(' ')[0]}</Text></Text>
            :
            <Text style={{ color: '#000', fontSize: 17 }}>Hey, <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>Pandit</Text></Text>
          }
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={openModal} style={{ marginLeft: 8 }}>
              <Octicons name="three-bars" color={'#000'} size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {spinner === true ?
        <View style={{ flex: 1, alignSelf: 'center', top: '30%' }}>
          <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
        </View>
        :
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false} style={{ flex: 1, zIndex: 1, }}>
            {poojaReqst.length > 0 &&
              <View style={{ width: '95%', alignSelf: 'center', marginTop: 15 }}>
                <Text style={{ color: '#000', fontSize: 19, letterSpacing: 0.3, fontWeight: '600', marginBottom: 10 }}>Pooja Request</Text>
                <View style={[styles.bookingContainer, { backgroundColor: '#e3e1e1' }]}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[...poojaReqst].reverse()}
                    inverted
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
                </View>
              </View>
            }
            {todatPoojas.length > 0 &&
              <View style={{ width: '95%', alignSelf: 'center', marginTop: 15 }}>
                <Text style={{ color: '#000', fontSize: 19, letterSpacing: 0.3, fontWeight: '600', marginBottom: 10 }}>Today's Pooja</Text>
                <View style={[styles.bookingContainer, { backgroundColor: '#e3e1e1' }]}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={todatPoojas}
                    // data={[...todatPoojas].reverse()}
                    inverted
                    scrollEnabled={false}
                    keyExtractor={(key) => key.id.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.bookingContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', item)} style={styles.bookingInfo}>
                          <Text style={styles.bookingTitle}>{item?.pooja_name}</Text>
                          {item?.user?.name ?
                            <Text style={styles.bookingDate}>{item?.user?.name}</Text>
                            :
                            <Text style={styles.bookingDate}>{maskPhoneNumber(item.user.mobile_number)}</Text>
                          }
                          <Text style={styles.bookingDate}>{moment(item?.booking_date).format('Do MMMM YYYY')}</Text>
                          <Text style={styles.bookingDate}>{moment(item?.booking_date).format('h:mma')}</Text>
                        </TouchableOpacity>
                        {item?.status === 'paid' && item?.payment_status === 'paid' && item?.pooja_status === 'pending' &&
                          <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => handleStart(item)} style={{ backgroundColor: '#4caf50', width: 90, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                          </View>
                        }
                        {item?.status === 'paid' && item?.payment_status === 'paid' && item?.pooja_status === 'started' &&
                          <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => handleEnd(item)} style={{ backgroundColor: '#f44336', width: 90, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={styles.buttonText}>End</Text>
                            </TouchableOpacity>
                          </View>
                        }
                      </View>
                    )}
                  />
                </View>
              </View>
            }
            {selectedPooja.length > 0 &&
              <View style={{ width: '100%', marginTop: 15 }}>
                <View style={{ width: '92%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#000', fontSize: 17, letterSpacing: 0.3, fontWeight: '600' }}>Add your pooja item list</Text>
                </View>
                <View style={{ width: '96%', alignSelf: 'center', marginTop: 15 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={[...selectedPooja].reverse()}
                    scrollEnabled={false}
                    numColumns={3}
                    keyExtractor={(key) => key.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => props.navigation.navigate('AddPujaItem', item)} style={styles.mostPPlrItem}>
                        <View style={{ width: '100%', height: 70, borderRadius: 10 }}>
                          <Image source={{ uri: item.pooja_photo_url }} style={styles.mostPPImage} />
                        </View>
                        <View style={{ margin: 10, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ width: '100%', alignItems: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 15, fontWeight: '500', textTransform: 'capitalize', textAlign: 'center' }}>{item.pooja_name}</Text>
                          </View>

                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            }
            {allPooja.length > 0 &&
              <View style={{ width: '100%', marginTop: 15 }}>
                <View style={{ width: '92%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#000', fontSize: 17, letterSpacing: 0.3, fontWeight: '600' }}>Select which pooja you do</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('AllPuja')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#000', fontSize: 14, letterSpacing: 0.3, fontWeight: '500', marginRight: 3 }}>View all</Text>
                    <FontAwesome6 name="angles-right" color={'#000'} size={14} />
                  </TouchableOpacity>
                </View>
                <View style={{ width: '96%', alignSelf: 'center', marginTop: 15 }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={allPooja}
                    scrollEnabled={false}
                    numColumns={3}
                    keyExtractor={(key) => key.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => props.navigation.navigate('AddPujaDetails', item)} style={styles.mostPPlrItem}>
                        <View style={{ width: '100%', height: 70, borderRadius: 10 }}>
                          <Image source={{ uri: item.pooja_photo_url }} style={styles.mostPPImage} />
                        </View>
                        <View style={{ margin: 10, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                          <View style={{ width: '100%', alignItems: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 15, fontWeight: '500', textTransform: 'capitalize', textAlign: 'center' }}>{item.pooja_name}</Text>
                          </View>

                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            }
          </ScrollView>
        </KeyboardAvoidingView>
      }
      <View style={{ padding: 0, height: 58, borderRadius: 0, backgroundColor: '#fff', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', margin: 0 }}>
          <View style={{ padding: 0, width: '20%' }}>
            <View activeOpacity={0.6} underlayColor="#DDDDDD" style={{ backgroundColor: '#fff', padding: 10, flexDirection: 'column', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Octicons name="home" color={'#dc3545'} size={21} />
                <Text style={{ color: '#dc3545', fontSize: 11, fontWeight: '500', marginTop: 4, height: 17 }}>Home</Text>
              </View>
            </View>
          </View>
          <View style={{ padding: 0, width: '19%' }}>
            <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('BookingRequest')} style={{ backgroundColor: '#fff', padding: 10, flexDirection: 'column', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <AntDesign name="filetext1" color={'#000'} size={22} />
                {poojaReqst.length > 0 &&
                  <View style={styles.buble}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{poojaReqst.length}</Text>
                  </View>
                }
                <Text style={{ color: '#000', fontSize: 11, fontWeight: '500', marginTop: 4, height: 17 }}>Request</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ padding: 0, width: '23%' }}>
            <View style={{ backgroundColor: '#fff', padding: 8, height: 90, flexDirection: 'column', alignItems: 'center', bottom: 25, borderRadius: 100 }}>
              <TouchableHighlight onPress={() => navigation.navigate('Podcast')} activeOpacity={0.6} underlayColor="#DDDDDD" style={{ backgroundColor: '#dc3545', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 60 }}>
                <MaterialCommunityIcons style={{}} name="podcast" color={'#fff'} size={40} />
              </TouchableHighlight>
            </View>
          </View>
          <View style={{ padding: 0, width: '19%' }}>
            <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('PoojaPending')} style={{ backgroundColor: '#fff', padding: 10, flexDirection: 'column', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="live-tv" color={'#000'} size={22} />
                {allBooking.length > 0 &&
                  <View style={styles.buble}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{allBooking.length}</Text>
                  </View>
                }
                <Text style={{ color: '#000', fontSize: 11, fontWeight: '500', marginTop: 4, height: 17 }}>Booking</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{ padding: 0, width: '19%' }}>
            <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => props.navigation.navigate('Panji')} style={{ backgroundColor: '#fff', padding: 10, flexDirection: 'column', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', marginTop: 3 }}>
                <Fontisto name="date" color={'#000'} size={20} />
                <Text style={{ color: '#000', fontSize: 11, fontWeight: '500', marginTop: 4, height: 17 }}>Panji</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>

      {/* Start Reject Reason Modal */}
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
      {/* End Reject Reason Modal */}

      {/* Start Show Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModal}
        onRequestClose={closeErrorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="report-gmailerrorred" size={100} color="red" />
                <Text style={{ color: '#000', fontSize: 23, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.3 }}>{errormasg}</Text>
              </View>
            </View>
            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 }}>
              <TouchableOpacity onPress={closeErrorModal} style={styles.confirmDeleteBtn}>
                <Text style={styles.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* End Show Error Modal */}

    </SafeAreaView>
  );
}

export default Index;

const styles = StyleSheet.create({
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
  bookingContainer: {
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
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  bookingDate: {
    color: '#555',
    fontSize: 14,
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
  cancelDeleteBtn: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  confirmDeleteBtn: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7
  },
  buble: {
    backgroundColor: '#f44336',
    borderRadius: 100,
    width: 18,
    height: 18,
    position: 'absolute',
    left: 5,
    top: -3,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
