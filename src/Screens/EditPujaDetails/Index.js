import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator, Modal } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FilePickerManager from 'react-native-file-picker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { base_url } from '../../../App';

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [totalFees, setTotalFees] = useState('');
    const [duration, setDuration] = useState('');
    const [poojaCount, setPoojaCount] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const pickImage = () => {
        const options = {
            title: 'Select Image',
            maxFilesize: 3, // 3 MB
            filetype: ['png', 'jpg', 'jpeg'],
        };
        FilePickerManager.showFilePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Error occurred:', response.error);
            } else {
                const { uri, type, fileName, fileSize } = response;
                const allowedTypes = options.filetype;
                const maxSize = options.maxFilesize * 1024 * 1024;
                if (!allowedTypes.includes(type.split('/')[1])) {
                    const errorMessage = `Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`;
                    console.log(errorMessage);
                    setErrorMessage(errorMessage);
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 5000);
                    return;
                }
                if (fileSize > maxSize) {
                    const errorMessage = `File size exceeds the limit of ${options.maxFilesize} MB.`;
                    console.log(errorMessage);
                    setErrorMessage(errorMessage);
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 5000);
                    return;
                }
                setImageFile({ uri, type, name: fileName });
            }
        });
    };

    const pickVideo = () => {
        const options = {
            title: 'Select Video',
            maxFilesize: 50, // 50 MB
            filetype: ['mp4'],
        };
        FilePickerManager.showFilePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.error) {
                console.log('Error occurred:', response.error);
            } else {
                const { uri, type, fileName, fileSize } = response;
                const allowedTypes = options.filetype;
                const maxSize = options.maxFilesize * 1024 * 1024;

                // Check if the type is present and valid
                if (!type) {
                    const errorMessage = `Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`;
                    console.log(errorMessage);
                    setErrorMessage(errorMessage);
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 5000);
                    return;
                }

                // Get the file extension from the type
                const fileExtension = type.split('/')[1];

                // Validate the file type
                if (!allowedTypes.includes(fileExtension)) {
                    const errorMessage = `Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`;
                    console.log(errorMessage);
                    setErrorMessage(errorMessage);
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 5000);
                    return;
                }

                // Validate the file size
                if (fileSize > maxSize) {
                    const errorMessage = `File size exceeds the limit of ${options.maxFilesize} MB.`;
                    console.log(errorMessage);
                    setErrorMessage(errorMessage);
                    setShowError(true);
                    setTimeout(() => {
                        setShowError(false);
                    }, 5000);
                    return;
                }

                setVideoFile({ uri, type, name: fileName });
            }
        });
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isFocus, setIsFocus] = useState(false);
    const [durationTypeOpen, setDurationTypeOpen] = useState(false);
    const [durationTypeValue, setDurationTypeValue] = useState(null);
    const [durationTypeList, setDurationTypeList] = useState([
        { label: 'Hour', value: 'Hour' },
        { label: 'Minute', value: 'Minute' },
        { label: 'Day', value: 'Day' },
    ]);

    const updatePoojaDetails = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);
        try {
            if (totalFees === '') {
                setErrorMessage('Please Enter Total Fee For This Pooja');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (duration === '') {
                setErrorMessage('Please Enter Duration For This Pooja');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (durationTypeValue === null) {
                setErrorMessage('Please Select Duration Type');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (poojaCount === '') {
                setErrorMessage('Please Enter Total Pooja You Have Done');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            const formData = new FormData();
            formData.append('pooja_fee', totalFees);
            formData.append('pooja_duration', duration + durationTypeValue);
            formData.append('pooja_done', poojaCount);
            if (imageFile?.type) {
                formData.append('pooja_photo', {
                    uri: imageFile.uri,
                    type: imageFile.type,
                    name: imageFile.name
                });
            }
            if (videoFile?.type) {
                formData.append('pooja_video', {
                    uri: videoFile.uri,
                    type: videoFile.type,
                    name: videoFile.name
                });
            }

            const response = await fetch(`${base_url}api/update-pooja-details/${props.route.params.id}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Update Pooja details successfully', data);
                navigation.navigate('Home');
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to Update Pooja details. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }

        } catch (error) {
            setErrorMessage('Failed to Update Pooja details. Please try again.');
            setShowError(true);
            console.log("Error", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const getPoojaDetails = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            const response = await fetch(`${base_url}api/get-pooja-details/${props.route.params.id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
            const responseData = await response.json();
            if (responseData.status === 200) {
                // console.log("getProfile-------", responseData.data);
                setTotalFees(responseData.data.pooja_fee);
                const match = responseData.data.pooja_duration.match(/^(\d+)\s*(\w+)$/);
                setDuration(match[1]);
                setDurationTypeValue(match[2]);
                setPoojaCount(responseData.data.pooja_done);
                setImageFile(responseData.data.pooja_photo);
                setVideoFile(responseData.data.pooja_video);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const removePooja = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            const response = await fetch(`${base_url}api/delete-pooja/${props.route.params.pooja_id}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                // console.log('Delete Pooja Item successfully', data);
                navigation.replace('Home');
            } else {
                console.log("Failed to Delete pooja Item. Please try again.", error);
            }
        } catch (error) {
            console.log("Failed to Delete pooja Item. Please try again.", error);
        }
    }

    const [cnfmRemovePoojaModal, setCnfmRemovePoojaModal] = useState(false);
    const closeCnfmRemovePoojaModal = () => { setCnfmRemovePoojaModal(false) };

    useEffect(() => {
        if (isFocused) {
            getPoojaDetails();
            // console.log("pooja details", props.route.params);
        }
    }, [isFocused])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.headerBack}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>Edit Pooja Details</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 5, }}>
                <Image
                    source={{ uri: props.route.params.pooja_photo_url }}
                    style={styles.headerImage}
                />
                <View style={{ width: '94%', alignSelf: 'center', marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.headerText}>{props.route.params.pooja_name}</Text>
                    <TouchableOpacity onPress={() => setCnfmRemovePoojaModal(true)} style={{ backgroundColor: 'red', padding: 8, borderRadius: 6 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove Pooja</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.form}>
                    <View style={[styles.inputContainer, { marginRight: 10 }]}>
                        <Text style={styles.label}>Total Fees</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setTotalFees}
                            value={totalFees}
                            placeholder="Enter Total Fees"
                            placeholderTextColor={'#b2b8b4'}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Total Duration</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setDuration}
                                value={duration}
                                keyboardType='number-pad'
                                placeholder="Enter Duration"
                                placeholderTextColor={'#b2b8b4'}
                            />
                        </View>
                        <View style={[styles.inputContainer, { marginLeft: 10 }]}>
                            <Text style={styles.label}></Text>
                            <DropDownPicker
                                style={styles.input}
                                placeholder={!isFocus ? 'Duration Type' : '...'}
                                open={durationTypeOpen}
                                value={durationTypeValue}
                                items={durationTypeList}
                                setOpen={setDurationTypeOpen}
                                setValue={setDurationTypeValue}
                                setItems={setDurationTypeList}
                                itemSeparator={true}
                                listMode="SCROLLVIEW"
                                autoScroll={true}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>How Many Pooja You Have Done</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPoojaCount}
                            value={poojaCount}
                            placeholder="Enter Pooja Count"
                            placeholderTextColor={'#b2b8b4'}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.fileInputContainer}>
                        <Text style={styles.label}>Upload Image</Text>
                        <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
                            <TextInput
                                style={styles.filePickerText}
                                editable={false}
                                value={imageFile ? imageFile.name : 'Select Image'}
                                placeholderTextColor={'#000'}
                                color={'#000'}
                            />
                            <View style={styles.chooseBtn}>
                                <Text style={styles.chooseBtnText}>Choose</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fileInputContainer}>
                        <Text style={styles.label}>Upload Video</Text>
                        <TouchableOpacity style={styles.filePicker} onPress={pickVideo}>
                            <TextInput
                                style={styles.filePickerText}
                                editable={false}
                                value={videoFile ? videoFile.name : 'Select Video'}
                                placeholderTextColor={'#000'}
                                color={'#000'}
                            />
                            <View style={styles.chooseBtn}>
                                <Text style={styles.chooseBtnText}>Choose</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
            {isLoading ? (
                <ActivityIndicator size="large" color="#c80100" />
            ) : (
                <TouchableOpacity onPress={updatePoojaDetails} style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
            )}

            {/* Start Delete Pooja Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={cnfmRemovePoojaModal}
                onRequestClose={closeCnfmRemovePoojaModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10 }}>
                            <View style={{ alignItems: 'center' }}>
                                <MaterialIcons name="report-gmailerrorred" size={100} color="red" />
                                <Text style={{ color: '#000', fontSize: 23, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.3 }}>Are You Sure To Delete This Pooja</Text>
                                <Text style={{ color: 'gray', fontSize: 17, fontWeight: '500', marginTop: 4 }}>You won't be able to revert this!</Text>
                            </View>
                        </View>
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 }}>
                            <TouchableOpacity onPress={closeCnfmRemovePoojaModal} style={styles.cancelDeleteBtn}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={removePooja} style={styles.confirmDeleteBtn}>
                                <Text style={styles.btnText}>Yes, delete it!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End Delete Pooja Modal */}

        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ededed',
    },
    headerImage: {
        width: '100%',
        height: 210,
        resizeMode: 'cover',
    },
    scrollView: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#fff'
    },
    headerPart: {
        backgroundColor: '#fff',
        paddingVertical: 13,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    headerBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
        textTransform: 'capitalize'
    },
    form: {
        paddingHorizontal: 20,
        marginTop: 10,
        paddingBottom: 20, // Adjust padding to make sure the submit button is not covered
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    inputContainer: {
        flex: 1,
        marginBottom: 15,
    },
    label: {
        color: '#333',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
    },
    fileInputContainer: {
        marginBottom: 15,
    },
    filePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    filePickerText: {
        flex: 1,
        color: '#000',
    },
    chooseBtn: {
        backgroundColor: '#016a59',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10,
    },
    chooseBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitBtn: {
        // position: 'absolute',
        // bottom: 20,
        // left: 20,
        // right: 20,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
        backgroundColor: '#c41414',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        marginVertical: 10,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
        textAlign: 'center',
        width: '90%'
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
        borderRadius: 15, // Slightly more rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 }, // More pronounced shadow
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        padding: 20,
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
});
