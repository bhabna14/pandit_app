import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FilePickerManager from 'react-native-file-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { base_url } from '../../../App';

const Index = (props) => {

    const navigation = useNavigation();
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

    const handleSubmit = async () => {
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
            formData.append('pooja_id', props.route.params.id);
            formData.append('pooja_name', props.route.params.pooja_name);
            formData.append('fee', totalFees);
            formData.append('duration', duration + " " + durationTypeValue);
            formData.append('done_count', poojaCount);
            if (imageFile) {
                formData.append('image', {
                    uri: imageFile.uri,
                    type: imageFile.type,
                    name: imageFile.name
                });
            }
            if (videoFile) {
                formData.append('video', {
                    uri: videoFile.uri,
                    type: videoFile.type,
                    name: videoFile.name
                });
            }

            const response = await fetch(`${base_url}api/save-pooja-details`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Save Pooja details successfully', data);
                navigation.navigate('Home');
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to save pooja details. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }

        } catch (error) {
            setErrorMessage('Failed to save Pooja details. Please try again.');
            setShowError(true);
            console.log("Error", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // console.log("pooja details", props.route.params);
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.headerBack}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>Add Pooja Details</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 5, }}>
                <Image
                    source={{ uri: props.route.params.pooja_photo_url }}
                    style={styles.headerImage}
                />
                <View style={{ width: '94%', alignSelf: 'center', marginVertical: 10 }}>
                    <Text style={styles.headerText}>{props.route.params.pooja_name}</Text>
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
                <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
            )}
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
});
