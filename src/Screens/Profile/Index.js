import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableHighlight, Dimensions, Image, Modal, Alert, ScrollView, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import ProfileImgMenu from '../../Component/ProfileImgMenu'
import ShowDP from '../../Component/ShowDP';
import { base_url } from '../../../App';

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [spinner, setSpinner] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [imageSource, setImageSource] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [name, setName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');
    // const [DOB, setDOB] = useState(new Date());
    // const [open, setOpen] = useState(false)
    const [gender, setGender] = useState('');
    const [genderID, setGenderID] = useState(null);
    const [genderitems, setGenderItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
        { label: 'Prefer not to disclose', value: 'Prefer_not_to_disclose' }
    ]);
    const [profileDetails, setProfileDetails] = useState({});

    const [profileModal, setProfileModal] = useState(false);
    const closeProfileModal = () => { setProfileModal(false); }
    const [updateProfileErrorVisible, setUpdateProfileErrorVisible] = useState(false);
    const [updateProfileError, setUpdateProfileError] = useState('');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            getProfile();
            console.log("Refreshing Successful")
        }, 2000);
    }, []);

    const getProfile = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            setSpinner(true);
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
                setSpinner(false);
                setProfileDetails(responseData?.data?.pandit_profile);
                setName(responseData?.data?.pandit_profile?.name);
                setPhoneNumber(responseData?.data?.pandit_profile_login?.mobile_no);
                setWhatsappNumber(responseData?.data?.pandit_profile?.whatsappno);
                setEmail(responseData?.data?.pandit_profile?.email);
                setAbout(responseData?.data?.pandit_profile?.about_pandit);
                setImageSource(responseData?.data?.pandit_profile?.profile_photo_url);
            }
        } catch (error) {
            console.log(error);
            setSpinner(false);
        }
    }

    const EditProfile = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');

        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const emailRegex = /^\w+([\D.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (name === '') {
            setUpdateProfileErrorVisible(true);
            setUpdateProfileError('Enter Your Name');
            setTimeout(() => {
                setUpdateProfileErrorVisible(false);
            }, 5000);
            return;
        }
        if (about === '') {
            setUpdateProfileErrorVisible(true);
            setUpdateProfileError('Enter Your About Pandit.');
            setTimeout(() => {
                setUpdateProfileErrorVisible(false);
            }, 5000);
            return;
        }
        if (whatsappNumber && phoneRegex.test(whatsappNumber) === false) {
            setUpdateProfileErrorVisible(true);
            setUpdateProfileError('Please Enter Your Valid Whatsapp Number.');
            setTimeout(() => {
                setUpdateProfileErrorVisible(false);
            }, 5000);
            return;
        }
        if (email && emailRegex.test(email) === false) {
            setUpdateProfileErrorVisible(true);
            setUpdateProfileError('Please Enter Your Valid Email.');
            setTimeout(() => {
                setUpdateProfileErrorVisible(false);
            }, 5000);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('whatsappno', whatsappNumber);
        formData.append('about', about);

        try {
            const response = await fetch(base_url + 'api/profile/updatepanditprofile', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: formData,
            });
            const responseData = await response.json();
            if (response.ok) {
                console.log("Profile Updated successfully", responseData);
                closeProfileModal();
                getProfile();
            } else {
                console.error('Failed to Edit Profile:', responseData.message);
            }
        } catch (error) {
            console.log("Error when Edit Profile:", error);
        }
    }

    const [profileImgMenu, setProfileImgMenu] = useState(false);
    const [showProfileImage, setShowProfileImage] = useState(false);

    const selectImage = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0].uri
                setImageSource(source);
                // console.log("selected image-=-=", response.assets[0])

                let imageBody = new FormData();
                imageBody.append('profile_photo',
                    {
                        uri: response.assets[0].uri,
                        name: response.assets[0].fileName,
                        filename: response.assets[0].fileName,
                        type: response.assets[0].type
                    });

                fetch(base_url + 'api/update-photo',
                    {
                        method: 'POST',
                        headers: {
                            "Content-Type": "multipart/form-data",
                            'Authorization': `Bearer ${access_token}`
                        },
                        body: imageBody
                    })
                    .then((response) => response.json())
                    .then(async (responseData) => {
                        console.log("Profile-picture Update----", responseData);
                    })
                    .catch((error) => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            }
        });
    };

    useEffect(() => {
        if (isFocused) {
            getProfile();
        }
    }, [isFocused])

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
            <ProfileImgMenu isVisible={profileImgMenu} onClose={() => setProfileImgMenu(false)} selectImage={selectImage} showProfileImage={() => setShowProfileImage(true)} />
            <ShowDP showProfileImage={showProfileImage} onClose={() => setShowProfileImage(false)} imageSource={imageSource} />
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Profile</Text>
                </TouchableOpacity>
            </View>
            {spinner === true ?
                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
                </View>
                :
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{ flex: 1 }}>
                    <View style={{ width: '100%', height: 320, backgroundColor: '#ffcb44', alignItems: 'center' }}>
                        {imageSource ?
                            <Image source={{ uri: imageSource }} style={{ height: '100%', width: '100%', resizeMode: 'cover' }} />
                            :
                            <Image source={require("../../assets/images/profileAvtar.png")} style={{ height: '100%', width: '100%', resizeMode: 'cover' }} />
                        }
                    </View>
                    <View style={{ flex: 1, marginTop: -15, backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingTop: 15 }}>
                        <View style={{ width: '92%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '20%' }}>
                                <View style={{ height: 48, width: 48, backgroundColor: '#b5b3b3', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                                    <Image source={require("../../assets/images/user.png")} style={{ width: 35, height: 35 }} />
                                </View>
                            </View>
                            <View style={{ width: '73%' }}>
                                <View style={{}}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {profileDetails.name && <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginRight: 4 }}>{profileDetails.name}</Text>}
                                        {profileDetails.email && !profileDetails.name && <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginRight: 4 }}>{profileDetails.email}</Text>}
                                        {phoneNumber && !profileDetails.email && !profileDetails.name && <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginRight: 4 }}>{phoneNumber}</Text>}
                                        <Feather name="check-circle" color={'#28a745'} size={16} />
                                    </View>
                                    {profileDetails.email && profileDetails.name && <Text style={{ color: '#555454', fontSize: 12, fontWeight: '400' }}>{profileDetails.email}</Text>}
                                    {phoneNumber && !profileDetails.email && profileDetails.name && <Text style={{ color: '#555454', fontSize: 12, fontWeight: '400' }}>{phoneNumber}</Text>}
                                    {phoneNumber && profileDetails.email && !profileDetails.name && <Text style={{ color: '#555454', fontSize: 12, fontWeight: '400' }}>{phoneNumber}</Text>}
                                    {phoneNumber && profileDetails.email && profileDetails.name && <Text style={{ color: '#555454', fontSize: 12, fontWeight: '400' }}>{phoneNumber}</Text>}
                                </View>
                            </View>
                            <View style={{ width: '7%' }}>
                                <TouchableOpacity onPress={() => setProfileModal(true)}>
                                    <Feather name="edit" color={'#28a745'} size={22} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#000', width: '100%', height: 0.4, marginTop: 10 }}></View>
                        {/* <View style={{ backgroundColor: '#737373', width: '100%', marginTop: 10 }}>
                            <View style={{ width: '92%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '400' }}>Accounts Credits</Text>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '400' }}>₹ 150</Text>
                            </View>
                        </View> */}
                        <View style={{ width: '100%', backgroundColor: '#fff', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('AllBooking')} style={styles.cell}>
                                <View>
                                    <Text style={styles.mainLable}>Bookings History</Text>
                                    <Text style={styles.subLable}>See all your bookings.</Text>
                                </View>
                                <Feather name="chevron-right" color={'#555454'} size={30} />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity onPress={() => props.navigation.navigate('AreaOfService')} style={styles.cell}>
                                <View>
                                    <Text style={styles.mainLable}>Area Of Service</Text>
                                    <Text style={styles.subLable}>Add all your comfortable zones/areas</Text>
                                </View>
                                <Feather name="chevron-right" color={'#555454'} size={30} />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity onPress={() => props.navigation.navigate('BankDetails')} style={styles.cell}>
                                <View>
                                    <Text style={styles.mainLable}>Bank Details</Text>
                                    <Text style={styles.subLable}>Add your bank account details</Text>
                                </View>
                                <Feather name="chevron-right" color={'#555454'} size={30} />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity style={styles.cell} onPress={() => props.navigation.navigate('Address')}>
                                <View>
                                    <Text style={styles.mainLable}>Address</Text>
                                    <Text style={styles.subLable}>Add your address</Text>
                                </View>
                                <Feather name="chevron-right" color={'#555454'} size={30} />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity style={styles.cell} onPress={() => props.navigation.navigate('AboutUs')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#dc3545', width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                        <Feather name="truck" color={'#fff'} size={18} />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginLeft: 10 }}>About us</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity style={styles.cell} onPress={() => props.navigation.navigate('ContactUs')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#ffcb44', width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                        <Feather name="phone" color={'#fff'} size={18} />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginLeft: 10 }}>Contact</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity style={styles.cell} onPress={() => props.navigation.navigate('TermsOfUse')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#28a745', width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                        <Feather name="info" color={'#fff'} size={18} />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginLeft: 10 }}>Terms of use</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#000', width: '100%', height: 0.4 }}></View>
                            <TouchableOpacity style={styles.cell} onPress={() => props.navigation.navigate('PrivacyPolicy')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: '#ffc107', width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                        <Feather name="lock" color={'#fff'} size={18} />
                                    </View>
                                    <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginLeft: 10 }}>Privacy policy</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={profileModal}
                onRequestClose={() => { setProfileModal(false) }}
            >
                <View style={styles.fullModal}>
                    <View style={styles.headerPart}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Edit Profile</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                            <TouchableOpacity onPress={closeProfileModal} style={{ marginLeft: 20 }}>
                                <MaterialIcons name="close" color={'#000'} size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={{ marginVertical: 10, alignItems: 'center' }}>
                            <View style={styles.profileBorder}>
                                <TouchableOpacity onPress={() => setProfileImgMenu(true)} style={styles.profileContainer}>
                                    {imageSource ?
                                        <Image source={{ uri: imageSource }} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 90 }} />
                                        :
                                        <Image source={require("../../assets/images/profileAvtar.png")} style={{ width: '100%', height: '85%', resizeMode: 'contain' }} />
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setProfileImgMenu(true)} style={styles.cameraBtm}>
                                    <Feather name="edit" style={{ color: '#fff' }} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '90%', height: '100%', alignSelf: 'center', marginTop: 14 }}>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8 }}>Name</Text>
                                <View style={styles.cardStyle}>
                                    <TextInput
                                        style={styles.inputs}
                                        onChangeText={setName}
                                        type='text'
                                        value={name}
                                        placeholder="Enter Your Name"
                                        placeholderTextColor="#b7b7c2"
                                        underlineColorAndroid='transparent'
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8 }}>Phone Number</Text>
                                <View style={[styles.cardStyle, { backgroundColor: '#e8e8eb', borderColor: '#868687', }]}>
                                    <TextInput
                                        style={[styles.inputs, { color: '#6a6a6b' }]}
                                        onChangeText={setPhoneNumber}
                                        type='number'
                                        editable={false}
                                        keyboardType='numeric'
                                        value={phoneNumber}
                                        placeholder="Enter Your Phone Number"
                                        placeholderTextColor="#b7b7c2"
                                        underlineColorAndroid='transparent'
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8 }}>WhatsApp Number</Text>
                                <View style={styles.cardStyle}>
                                    <TextInput
                                        style={[styles.inputs, { color: '#6a6a6b' }]}
                                        onChangeText={setWhatsappNumber}
                                        value={whatsappNumber}
                                        type='number'
                                        // editable={false}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        placeholder="Enter Your Phone Number"
                                        placeholderTextColor="#b7b7c2"
                                        underlineColorAndroid='transparent'
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8 }}>Email ID</Text>
                                <View style={styles.cardStyle}>
                                    <TextInput
                                        style={styles.inputs}
                                        onChangeText={setEmail}
                                        type='email'
                                        value={email}
                                        autoCapitalize='none'
                                        keyboardType='email-address'
                                        placeholder="Enter Your Email ID"
                                        placeholderTextColor="#b7b7c2"
                                        underlineColorAndroid='transparent'
                                    />
                                </View>
                            </View>
                            {/* <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8 }}>Date Of Birth</Text>
                                <TouchableOpacity onPress={() => setOpen(true)} style={styles.cardStyle}>
                                    <TextInput
                                        style={styles.inputs}
                                        type='text'
                                        value={DOB ? DOB.toISOString().split('T')[0] : ''}
                                        editable={false}
                                        placeholder="Enter Your Date Of Birth"
                                        placeholderTextColor="#b7b7c2"
                                        underlineColorAndroid='transparent'
                                    />
                                </TouchableOpacity>
                                    <View>
                                        <DatePicker
                                            modal
                                            mode="date"
                                            open={open}
                                            date={DOB}
                                            onConfirm={(data) => {
                                                setOpen(false)
                                                setDOB(data)
                                            }}
                                            onCancel={() => {
                                                setOpen(false);
                                            }}
                                        />
                                    </View>
                            </View> */}
                            {/* <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8, marginBottom: 4 }}>Gender</Text>
                                <DropDownPicker
                                    style={{ zIndex: 10, borderWidth: 0, backgroundColor: "#fff", borderWidth: 0.4, borderColor: '#000', marginBottom: 15 }}
                                    placeholder={!isFocus ? 'Gender' : '...'}
                                    open={gender}
                                    value={genderID}
                                    items={genderitems}
                                    listMode="SCROLLVIEW"
                                    // dropDownDirection="TOP"
                                    disableBorderRadius={true}
                                    dropDownContainerStyle={{
                                        backgroundColor: "#fff",
                                        borderWidth: 0.8,
                                        borderColor: '#000',
                                        // zIndex: 9
                                    }}
                                    itemSeparator={true}
                                    autoScroll={true}
                                    setOpen={setGender}
                                    setValue={setGenderID}
                                    setItems={setGenderItems}
                                />
                            </View> */}
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: '#000', fontSize: 16, marginLeft: 8 }}>About Yourself</Text>
                                <View style={styles.cardStyle}>
                                    <TextInput
                                        style={{ width: '80%', alignSelf: 'center', marginLeft: 0, fontSize: 16, color: '#000' }}
                                        onChangeText={setAbout}
                                        type='text'
                                        value={about}
                                        placeholder="Enter About Yourself"
                                        placeholderTextColor="#b7b7c2"
                                        underlineColorAndroid='transparent'
                                        multiline
                                    />
                                </View>
                            </View>
                            <Text style={styles.errorText}>{updateProfileErrorVisible ? updateProfileError : ''}</Text>
                            <View style={{ width: '100%', alignItems: 'flex-end', marginTop: 20, marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => EditProfile()} style={styles.saveBtm}>
                                    <Text style={{ fontSize: 20, fontWeight: '500' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
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
    cell: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: 65,
        alignItems: 'center'
    },
    mainLable: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    subLable: {
        color: '#6c757d',
        fontSize: 13.5,
        fontWeight: '400'
    },
    fullModal: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        bottom: 0,
        position: 'absolute',
        alignSelf: 'center',
        borderRadius: 10
    },
    profileBorder: {
        borderColor: '#88888a',
        borderWidth: 2,
        height: 120,
        width: 120,
        padding: 2,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileContainer: {
        backgroundColor: '#ffcb44',
        width: '100%',
        height: '100%',
        borderRadius: 90,
        alignItems: 'center',
    },
    profileIcon: {
        color: '#000',
    },
    cameraBtm: {
        position: 'absolute',
        right: 0,
        bottom: 6,
        backgroundColor: '#9c9998',
        borderRadius: 20,
        padding: 6
    },
    cardStyle: {
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 4,
        marginBottom: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 0.4
    },
    inputs: {
        height: 50,
        width: '80%',
        alignSelf: 'center',
        marginLeft: 0,
        fontSize: 16,
        color: '#000'
    },
    saveBtm: {
        backgroundColor: '#ffcb44',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 6
    },
    errorText: {
        color: '#f00c27',
        marginTop: 10,
        // fontWeight: '500'
    },
})