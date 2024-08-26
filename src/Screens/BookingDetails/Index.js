import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Rating } from 'react-native-ratings';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';

const BookingDetails = (props) => {

    const navigation = useNavigation();
    const [rating, setRating] = useState(props.route.params?.rating?.rating || 0);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.release(); // Release the sound object when the component is unmounted
            }
        };
    }, [sound]);

    const playAudio = (audioUrl) => {
        if (audioUrl) {
            const newSound = new Sound(audioUrl, null, (error) => {
                if (error) {
                    console.log('Failed to load the sound', error);
                    return;
                }
                setDuration(newSound.getDuration()); // Set the audio duration
                newSound.play((success) => {
                    if (success) {
                        console.log('Successfully finished playing');
                        setIsPlaying(false);
                        setCurrentPosition(0); // Reset position after finishing
                    } else {
                        console.log('Playback failed due to audio decoding errors');
                        setIsPlaying(false);
                    }
                });
            });
            setSound(newSound);
            setIsPlaying(true);
        }
    };

    const stopAudio = () => {
        if (sound) {
            sound.stop(() => {
                console.log('Audio stopped');
                setIsPlaying(false);
                setCurrentPosition(0);
            });
        }
    };

    const toggleAudio = () => {
        if (isPlaying) {
            stopAudio();
        } else {
            playAudio(props?.route?.params?.rating?.audio_file_url);
        }
    };

    const updateCurrentPosition = () => {
        if (sound) {
            sound.getCurrentTime((seconds) => {
                setCurrentPosition(seconds);
            });
        }
    };

    useEffect(() => {
        if (isPlaying && sound) {
            const interval = setInterval(updateCurrentPosition, 1000); // Update position every second
            return () => clearInterval(interval);
        }
    }, [isPlaying, sound]);

    const seekAudio = (value) => {
        if (sound) {
            sound.setCurrentTime(value);
            setCurrentPosition(value);
        }
    };

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
                    <DetailRow label="Booking ID" value={props?.route?.params?.booking_id} />
                    <DetailRow label="Pooja Name" value={props?.route?.params?.pooja?.pooja_name} />
                    <DetailRow label="User Mobile" value={maskPhoneNumber(props?.route?.params?.user?.mobile_number)} />
                    <DetailRow label="Pooja Fee" value={`₹${props?.route?.params?.pooja_fee}`} />
                    {/* <DetailRow label="Paid Amount" value={`₹${props?.route?.params?.paid === null ? 0 : props?.route?.params?.paid}`} /> */}
                    <DetailRow label="Date & Time" value={moment(props?.route?.params?.booking_date).format('Do MMMM YYYY h:mma')} />
                    <DetailRow label="Address" value={props?.route?.params?.address?.area + ", " + props?.route?.params?.address?.city + ", " + props?.route?.params?.address?.state + ", " + props?.route?.params?.address?.pincode} isLastItem={true} />
                </View>
                {props?.route?.params?.rating &&
                    <View style={[styles.detailsTable, { marginTop: 20, padding: 10 }]}>
                        <Text style={styles.sectionHeader}>Pooja Rating</Text>
                        <Rating
                            startingValue={rating}
                            // showRating={true}
                            readonly={true}
                            onFinishRating={(value) => setRating(value)}
                            style={{ width: 200, alignSelf: 'center', marginBottom: 10 }}
                        />
                        <Text style={styles.infoText}>Feedback:  {props?.route?.params?.rating?.feedback_message}</Text>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                            {props?.route?.params?.rating?.image_path_url &&
                                <View style={{ width: '48%' }}>
                                    <Text style={styles.infoText}>Image Review:</Text>
                                    <Image source={{ uri: props?.route?.params?.rating?.image_path_url }} style={{ width: 100, height: 120 }} />
                                </View>
                            }
                            {props?.route?.params?.rating?.audio_file_url &&
                                <View style={{ width: '48%', alignItems: 'center' }}>
                                    <Text style={styles.infoText}>Audio Review:</Text>
                                    <TouchableOpacity
                                        style={styles.audioContainer}
                                        onPress={toggleAudio}
                                    >
                                        <Text style={styles.audioText}>{isPlaying ? 'Stop Audio' : 'Play Audio'}</Text>
                                    </TouchableOpacity>
                                    <Slider
                                        style={{ width: '100%', height: 40 }}
                                        minimumValue={0}
                                        maximumValue={duration}
                                        value={currentPosition}
                                        onValueChange={seekAudio}
                                        minimumTrackTintColor="#1FB28A"
                                        maximumTrackTintColor="#9c9a9a"
                                        thumbTintColor="#1FB28A"
                                    />
                                    <Text style={styles.durationText}>
                                        {Math.floor(currentPosition)}s / {Math.floor(duration)}s
                                    </Text>
                                </View>
                            }
                        </View>
                    </View>
                }
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
        fontSize: 15,
        textAlign: 'right',
    },
    sectionHeader: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10
    },
    infoText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 5
    },
    audioContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
        width: 120,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    audioText: {
        fontSize: 16,
        color: '#007BFF',
    },
});
