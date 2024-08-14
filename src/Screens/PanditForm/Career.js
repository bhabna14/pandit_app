import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import FilePickerManager from 'react-native-file-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { base_url } from '../../../App';

const Career = (props) => {
    const navigation = useNavigation();
    const [qualification, setQualification] = useState('');
    const [totalExperience, setTotalExperience] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [idProofs, setIdProofs] = useState([
        { id: 1, idProof: '', idProofValue: null, fileName: '' }
    ]);
    const [educations, setEducations] = useState([
        { id: 1, education: '', educationValue: null, fileName: '' }
    ]);
    const [vedics, setVedics] = useState([
        { id: 1, vedic: '', fileName: '' }
    ]);
    const [idProofList, setIdProofList] = useState([
        { label: 'Adhar Card', value: 'Adhar Card' },
        { label: 'Pan Card', value: 'Pan Card' },
        { label: 'Voter Card', value: 'Voter Card' },
        { label: 'DL', value: 'DL' },
        { label: 'Health Card', value: 'Health Card' }
    ]);
    const [educationList, setEducationList] = useState([
        { label: '10th', value: '10th' },
        { label: '+2', value: '+2' },
        { label: '+3', value: '+3' },
        { label: 'Master degree', value: 'Master degree' }
    ]);

    const pickFile = (index, isEducation = false, isVedic = false) => {
        const options = {
            title: 'Select Profile Photo',
            maxFilesize: 3,
            filetype: ['pdf', 'png', 'jpg', 'jpeg'],
        };
        FilePickerManager.showFilePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled file picker');
            } else if (response.error) {
                console.log('Error occurred:', response.error);
            } else {
                const { uri, type, fileName, fileSize } = response;
                const allowedTypes = options.filetype;
                const maxSize = options.maxFilesize * 1024 * 1024;
                if (!allowedTypes.includes(type.split('/')[1])) {
                    console.log(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`);
                    alert(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`);
                    return;
                }

                if (fileSize > maxSize) {
                    console.log(`File size exceeds the limit of ${options.maxFilesize} MB.`);
                    return;
                }
                console.log(
                    'Selected file uri:', response.uri,
                    'Selected file type:', response.type, // mime type
                    'Selected file fileName:', response.fileName,
                    'Selected file fileSize:', response.fileSize
                );

                if (isVedic) {
                    setVedics(prevVedics => {
                        const updatedVedics = [...prevVedics];
                        updatedVedics[index].fileName = fileName;
                        return updatedVedics;
                    });
                } else if (isEducation) {
                    setEducations(prevEducations => {
                        const updatedEducations = [...prevEducations];
                        updatedEducations[index].fileName = fileName;
                        return updatedEducations;
                    });
                } else {
                    setIdProofs(prevIdProofs => {
                        const updatedIdProofs = [...prevIdProofs];
                        updatedIdProofs[index].fileName = fileName;
                        return updatedIdProofs;
                    });
                }
            }
        });
    };

    const addMoreField = (isEducation = false, isVedic = false) => {
        if (isVedic) {
            setVedics(prevVedics => [
                ...prevVedics,
                { id: prevVedics.length + 1, vedic: '', fileName: '' }
            ]);
        } else if (isEducation) {
            setEducations(prevEducations => [
                ...prevEducations,
                { id: prevEducations.length + 1, education: '', educationValue: null, fileName: '' }
            ]);
        } else {
            setIdProofs(prevIdProofs => [
                ...prevIdProofs,
                { id: prevIdProofs.length + 1, idProof: '', idProofValue: null, fileName: '' }
            ]);
        }
    };

    const removeField = (index, isEducation = false, isVedic = false) => {
        if (isVedic) {
            setVedics(prevVedics => prevVedics.filter((_, i) => i !== index));
        } else if (isEducation) {
            setEducations(prevEducations => prevEducations.filter((_, i) => i !== index));
        } else {
            setIdProofs(prevIdProofs => prevIdProofs.filter((_, i) => i !== index));
        }
    };

    const pressHandlerNext = async () => {
        navigation.navigate('Home');
        return;
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);
        try {
            if (qualification === '') {
                setErrorMessage('Please enter your highest qualification');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }
            if (totalExperience === '') {
                setErrorMessage('Please Enter your total experience');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('qualification', qualification);
            formData.append('experience', totalExperience);

            console.log("formData", formData);
            return;

            const response = await fetch(base_url + 'api/career/save', {
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
                navigation.navigate('Career');
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to save profile details. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        } catch (error) {
            // Handle error response
            setErrorMessage('Failed to save profile details. Please try again.');
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
                    <Text style={styles.headerText}>Career Detail's</Text>
                </View>
                <ScrollView style={styles.form}>
                    <View style={styles.card}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Highest Qualification</Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={setQualification}
                                value={qualification}
                                placeholder="Enter Highest Qualification"
                                placeholderTextColor={'#b2b8b4'}
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Total Experience</Text>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={setTotalExperience}
                                value={totalExperience}
                                placeholder="Enter Total Experience"
                                placeholderTextColor={'#b2b8b4'}
                                underlineColorAndroid='transparent'
                            />
                        </View>
                        {idProofs.map((proof, index) => (
                            <View key={proof.id} style={styles.inputContainer}>
                                <Text style={styles.label}>ID Proof</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: '80%' }}>
                                        <DropDownPicker
                                            style={styles.inputs}
                                            placeholder={!isFocus ? 'Select Your ID Proof' : '...'}
                                            open={proof.idProof}
                                            value={proof.idProofValue}
                                            items={idProofList}
                                            setOpen={() => {
                                                const updatedIdProofs = [...idProofs];
                                                updatedIdProofs[index].idProof = !proof.idProof;
                                                setIdProofs(updatedIdProofs);
                                            }}
                                            setValue={(callback) => {
                                                const updatedIdProofs = [...idProofs];
                                                updatedIdProofs[index].idProofValue = callback(proof.idProofValue);
                                                setIdProofs(updatedIdProofs);
                                            }}
                                            setItems={setIdProofList}
                                            itemSeparator={true}
                                            listMode="SCROLLVIEW"
                                            autoScroll={true}
                                            dropDownDirection="TOP"
                                        />
                                    </View>
                                    {index === 0 ? (
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => addMoreField(false)}>
                                            <AntDesign name={"plussquare"} color={'#016a59'} size={35} />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => removeField(index, false)}>
                                            <AntDesign name={"minussquare"} color={'#c41414'} size={35} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {proof.idProofValue && (
                                    <TouchableOpacity style={styles.filePicker} onPress={() => pickFile(index, false)}>
                                        <TextInput
                                            style={styles.filePickerText}
                                            type='text'
                                            editable={false}
                                            value={proof.fileName ? proof.fileName : `Select Your ${proof.idProofValue}`}
                                            placeholderTextColor={'#000'}
                                            color={'#000'}
                                        />
                                        <View style={styles.chooseBtn}>
                                            <Text style={styles.chooseBtnText}>Choose File</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        {educations.map((education, index) => (
                            <View key={education.id} style={styles.inputContainer}>
                                <Text style={styles.label}>Education</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: '80%' }}>
                                        <DropDownPicker
                                            style={styles.inputs}
                                            placeholder={!isFocus ? 'Select Your Education' : '...'}
                                            open={education.education}
                                            value={education.educationValue}
                                            items={educationList}
                                            setOpen={() => {
                                                const updatedEducations = [...educations];
                                                updatedEducations[index].education = !education.education;
                                                setEducations(updatedEducations);
                                            }}
                                            setValue={(callback) => {
                                                const updatedEducations = [...educations];
                                                updatedEducations[index].educationValue = callback(education.educationValue);
                                                setEducations(updatedEducations);
                                            }}
                                            setItems={setEducationList}
                                            itemSeparator={true}
                                            listMode="SCROLLVIEW"
                                            autoScroll={true}
                                            dropDownDirection="TOP"
                                        />
                                    </View>
                                    {index === 0 ? (
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => addMoreField(true)}>
                                            <AntDesign name={"plussquare"} color={'#016a59'} size={35} />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => removeField(index, true)}>
                                            <AntDesign name={"minussquare"} color={'#c41414'} size={35} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {education.educationValue && (
                                    <TouchableOpacity style={styles.filePicker} onPress={() => pickFile(index, true)}>
                                        <TextInput
                                            style={styles.filePickerText}
                                            type='text'
                                            editable={false}
                                            value={education.fileName ? education.fileName : `Select Your ${education.educationValue}`}
                                            placeholderTextColor={'#000'}
                                            color={'#000'}
                                        />
                                        <View style={styles.chooseBtn}>
                                            <Text style={styles.chooseBtnText}>Choose File</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        {vedics.map((vedic, index) => (
                            <View key={vedic.id} style={styles.inputContainer}>
                                <Text style={styles.label}>Vedic</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: '80%' }}>
                                        <TextInput
                                            style={styles.inputs}
                                            onChangeText={(text) => {
                                                const updatedVedics = [...vedics];
                                                updatedVedics[index].vedic = text;
                                                setVedics(updatedVedics);
                                            }}
                                            value={vedic.vedic}
                                            placeholder="Enter Vedic"
                                            placeholderTextColor={'#b2b8b4'}
                                            underlineColorAndroid='transparent'
                                        />
                                    </View>
                                    {index === 0 ? (
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => addMoreField(false, true)}>
                                            <AntDesign name={"plussquare"} color={'#016a59'} size={35} />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => removeField(index, false, true)}>
                                            <AntDesign name={"minussquare"} color={'#c41414'} size={35} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {vedic.vedic && (
                                    <TouchableOpacity style={styles.filePicker} onPress={() => pickFile(index, false, true)}>
                                        <TextInput
                                            style={styles.filePickerText}
                                            type='text'
                                            editable={false}
                                            value={vedic.fileName ? vedic.fileName : `Select Your ${vedic.vedic}`}
                                            placeholderTextColor={'#000'}
                                            color={'#000'}
                                        />
                                        <View style={styles.chooseBtn}>
                                            <Text style={styles.chooseBtnText}>Choose File</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={pressHandlerNext} style={styles.nextBtn}>
                    <Text style={styles.nextBtnText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default Career;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        flexDirection: 'row',
    },
    headerText: {
        color: '#000',
        fontSize: 22,
        fontWeight: '700',
        marginLeft: 20,
        textDecorationLine: 'underline',
    },
    form: {
        flex: 1,
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#262626',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputs: {
        borderColor: '#cdc3c3',
        borderWidth: 0.7,
        width: '100%',
        borderRadius: 10,
        paddingLeft: 15,
        color: '#000',
    },
    filePicker: {
        borderColor: '#cdc3c3',
        borderWidth: 0.7,
        width: '100%',
        borderRadius: 10,
        paddingLeft: 15,
        flexDirection: 'row',
        marginTop: 10,
    },
    filePickerText: {
        width: '70%',
    },
    chooseBtn: {
        backgroundColor: '#016a59',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 10,
        borderBottomEndRadius: 10,
    },
    chooseBtnText: {
        color: '#fff',
        fontWeight: '500',
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    nextBtn: {
        width: '90%',
        height: 50,
        backgroundColor: '#c41414',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
        borderRadius: 10,
    },
});
