import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { base_url } from '../../../App';

const PersonalDetails = (props) => {

    const navigation = useNavigation();
    const [isFocus, setIsFocus] = useState(false);
    const [title, setTitle] = useState('');
    const [titleValue, setTitleValue] = useState(null);
    const [titleList, setTitleList] = useState([
        { label: 'Pandit', value: 'Pandit' },
    ]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [blood, setBlood] = useState('');
    const [bloodValue, setBloodValue] = useState(null);
    const [bloodList, setBloodList] = useState([
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
    ]);
    const [idProof, setIdProof] = useState('');
    const [idProofValue, setIdProofValue] = useState(null);
    const [idProofList, setIdProofList] = useState([
        { label: 'Adhara Card', value: 'adhar' },
        { label: 'Voter Card', value: 'voter' },
        { label: 'Pan Card', value: 'pan' },
        { label: 'DL', value: 'DL' },
        { label: 'Health Card', value: 'health_card' },
    ]);
    const [aboutPandit, setAboutPandit] = useState('');
    const [idImageSource, setIdImageSource] = useState(null);
    const [idProofPhoto, setIdProofPhoto] = useState('Select Your ID Proof');
    const selectIdProof = async () => {
        // var access_token = await AsyncStorage.getItem('storeAccesstoken');
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
                const source = response.assets[0]
                setIdImageSource(source);
                setIdProofPhoto(response.assets[0].fileName);
                // console.log("selected image-=-=", response.assets[0])
            }
        });
    }

    const [imageSource, setImageSource] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState('Select Profile Picture');

    const selectProfilePhoto = async () => {
        // var access_token = await AsyncStorage.getItem('storeAccesstoken');
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
                const source = response.assets[0]
                setImageSource(source);
                setProfilePhoto(response.assets[0].fileName);
                // console.log("selected image-=-=", response.assets[0])
            }
        });
    };
    const [checked, setChecked] = useState(null);
    const [language, setLanguage] = useState('');
    const [languageValue, setLanguageValue] = useState(null);
    const [languageList, setLanguageList] = useState([
        { label: 'English', value: 'English' },
        { label: 'Odia', value: 'Odia' },
        { label: 'Hindi', value: 'Hindi' },
        { label: 'Bengali', value: 'Bengali' },
        { label: 'Kannada', value: 'Kannada' },
        { label: 'Nepali', value: 'Nepali' }
    ]);

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const pressHandlerNext = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);

        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const emailRegex = /^\w+([\D.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        try {
            if (titleValue === null) {
                setErrorMessage('Please select a title');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (name === '') {
                setErrorMessage('Please Enter your name');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (email && emailRegex.test(email) === false) {
                setErrorMessage('Please Enter Your Valid Email.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (phone === '' || phoneRegex.test(phone) === false) {
                setErrorMessage('Please Enter your Valid WhatsApp Number');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (bloodValue === null) {
                setErrorMessage('Please select your blood group');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (profilePhoto === 'Select Profile Picture') {
                setErrorMessage('Please select your Profile Picture');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (checked === null) {
                setErrorMessage('Please select your marital status');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (idProofValue === null) {
                setErrorMessage('Please select your ID Proof');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (idImageSource === null) {
                setErrorMessage('Please Choose your ID Proof File');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (languageValue === null) {
                setErrorMessage('Please select language');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (aboutPandit === '') {
                setErrorMessage('Please Enter About Pandit');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('title', titleValue);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('whatsappno', phone);
            formData.append('bloodgroup', bloodValue);
            formData.append('marital', checked);
            formData.append('language', languageValue);
            formData.append('profile_photo', {
                uri: imageSource.uri,
                name: imageSource.fileName,
                filename: imageSource.fileName,
                type: imageSource.type
            });
            formData.append('id_type', idProofValue);
            formData.append('upload_id', {
                uri: idImageSource.uri,
                name: idImageSource.fileName,
                filename: idImageSource.fileName,
                type: idImageSource.type
            });
            formData.append('about', aboutPandit);

            // console.log("formData", formData);
            // return;

            const response = await fetch(base_url + 'api/profile/save', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Save profile details successfully', data);
                navigation.navigate('Home');
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to save profile details. Please try again1.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        } catch (error) {
            // Handle error response
            setErrorMessage('Failed to save profile details. Please try again2.');
            setShowError(true);
            console.log("Error", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/bg1.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Personal Details</Text>
                </View>
                <ScrollView style={styles.form}>
                    <View style={styles.card}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Title</Text>
                            <DropDownPicker
                                style={styles.inputs}
                                placeholder={!isFocus ? 'Select Title' : '...'}
                                open={title}
                                value={titleValue}
                                items={titleList}
                                setOpen={setTitle}
                                setValue={setTitleValue}
                                setItems={setTitleList}
                                itemSeparator={true}
                                listMode="SCROLLVIEW"
                                autoScroll={true}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={setName}
                                value={name}
                                placeholder="Enter Name"
                                placeholderTextColor={'#b2b8b4'}
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email address <Text style={styles.optional}>(optional)</Text></Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={setEmail}
                                value={email}
                                autoCapitalize='none'
                                placeholder="Enter Your Email"
                                placeholderTextColor={'#b2b8b4'}
                                keyboardType="email-address"
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>WhatsApp Number</Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={setPhone}
                                value={phone}
                                maxLength={10}
                                autoCapitalize='none'
                                placeholder="Enter Your WhatsApp Number"
                                placeholderTextColor={'#b2b8b4'}
                                keyboardType="phone-pad"
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Blood Group</Text>
                            <DropDownPicker
                                style={styles.inputs}
                                placeholder={!isFocus ? 'Select Blood Group' : '...'}
                                open={blood}
                                value={bloodValue}
                                items={bloodList}
                                setOpen={setBlood}
                                setValue={setBloodValue}
                                setItems={setBloodList}
                                itemSeparator={true}
                                listMode="SCROLLVIEW"
                                autoScroll={true}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Profile Photo</Text>
                            <TouchableOpacity style={styles.filePicker} onPress={selectProfilePhoto}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={profilePhoto}
                                    placeholderTextColor={'#000'}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Marital Status</Text>
                            <View style={styles.radioContainer}>
                                <TouchableOpacity onPress={() => setChecked("Married")} style={styles.radioButton}>
                                    <Fontisto name={checked === "Married" ? "radio-btn-active" : "radio-btn-passive"} color={checked === "Married" ? '#b7070a' : '#000'} size={25} />
                                    <Text style={styles.radioLabel}>Married</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setChecked("Unmarried")} style={styles.radioButton}>
                                    <Fontisto name={checked === "Unmarried" ? "radio-btn-active" : "radio-btn-passive"} color={checked === "Unmarried" ? '#b7070a' : '#000'} size={25} />
                                    <Text style={styles.radioLabel}>Unmarried</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>ID Proof</Text>
                            <DropDownPicker
                                style={[styles.inputs, { zIndex: 1000 }]}
                                placeholder={!isFocus ? 'Select Your ID Proof' : '...'}
                                open={idProof}
                                value={idProofValue}
                                items={idProofList}
                                setOpen={setIdProof}
                                setValue={setIdProofValue}
                                setItems={setIdProofList}
                                itemSeparator={true}
                                listMode="SCROLLVIEW"
                                autoScroll={true}
                            />
                        </View>
                        {idProofValue &&
                            <View style={styles.inputContainer}>
                                {/* <Text style={styles.label}>Profile Photo</Text> */}
                                <TouchableOpacity style={styles.filePicker} onPress={selectIdProof}>
                                    <TextInput
                                        style={styles.filePickerText}
                                        editable={false}
                                        placeholder={idProofPhoto}
                                        placeholderTextColor={'#000'}
                                    />
                                    <View style={styles.chooseBtn}>
                                        <Text style={styles.chooseBtnText}>Choose File</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Select Language</Text>
                            <DropDownPicker
                                style={[styles.inputs, { zIndex: 999 }]}
                                placeholder={!isFocus ? 'Select Language' : '...'}
                                multiple={true}
                                open={language}
                                value={languageValue}
                                items={languageList}
                                setOpen={setLanguage}
                                setValue={setLanguageValue}
                                setItems={setLanguageList}
                                itemSeparator={true}
                                listMode="SCROLLVIEW"
                                autoScroll={true}
                                dropDownDirection={'TOP'}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>About Pandit</Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={setAboutPandit}
                                value={aboutPandit}
                                placeholder="Enter About Pandit"
                                placeholderTextColor={'#b2b8b4'}
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                            />
                        </View>
                    </View>
                </ScrollView>
                {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#c80100" />
                ) : (
                    <TouchableOpacity onPress={pressHandlerNext} style={styles.nextBTN}>
                        <Text style={styles.nextBtnText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    )
}

export default PersonalDetails

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        flexDirection: 'row',
    },
    headerText: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    form: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    optional: {
        color: '#909190',
        fontSize: 14,
    },
    inputs: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        height: 45,
        color: '#000',
    },
    filePicker: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filePickerText: {
        width: '70%',
        height: 45,
        lineHeight: 45,
        color: '#000',
    },
    chooseBtn: {
        backgroundColor: '#bbb',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    chooseBtnText: {
        color: '#fff',
        fontWeight: '500',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioButton: {
        alignItems: 'center',
    },
    radioLabel: {
        color: '#000',
        fontSize: 15,
        marginTop: 5,
    },
    nextBTN: {
        backgroundColor: '#c41414',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        marginTop: 10,
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    errorText: {
        color: 'red',
        marginTop: 15,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5
    },
});
