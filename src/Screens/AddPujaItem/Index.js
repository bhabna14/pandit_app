import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from '../../../App';

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [spinner, setSpinner] = useState(false);
    const [poojaItemList, setPoojaItemList] = useState([]);
    const [poojaDetails, setPoojaDetails] = useState(props.route.params);
    const [openAddModal, setOpenAddModal] = useState(false);
    const closeAddModal = () => { setOpenAddModal(false) };
    const [openEditModal, setOpenEditModal] = useState(false);
    const closeEditModal = () => { setOpenEditModal(false); setPujaItemValue(null); };
    const [isFocus, setIsFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [pujaItem, setPujaItem] = useState('');
    const [pujaItemValue, setPujaItemValue] = useState(null);
    const [pujaItemList, setPujaItemList] = useState(null);

    const [pujaVariant, setPujaVariant] = useState('');
    const [pujaVariantValue, setPujaVariantValue] = useState(null);
    const [pujaVariantList, setPujaVariantList] = useState([]);
    const [allVariant, setAllVariant] = useState([]);

    const getPoojaVariant = async () => {
        try {
            const response = await fetch(`${base_url}api/list-pooja-item`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
            if (response.ok) {
                setAllVariant(responseData.data);
                // console.log("responseData for pooja variant", responseData.data);
            }
        } catch (error) {
            console.log("Error when get pooja variant", error);
        }
    }

    const getPoojaItemById = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            setSpinner(true);
            const response = await fetch(`${base_url}api/pooja-item-list/${props.route.params.pooja_id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const responseData = await response.json();
            if (responseData.status === 200) {
                setSpinner(false);
                // console.log("responseData", responseData);
                setPoojaItemList(responseData.data);
            }
        } catch (error) {
            setSpinner(false);
            console.log(error);
        }
    }

    const savePoojaItemById = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);
        try {
            if (pujaItemValue === null) {
                setErrorMessage('Please Select Any Item');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            } if (pujaVariantValue === null) {
                setErrorMessage('Please Select Any Variant');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }

            const response = await fetch(base_url + 'api/save-pooja-item-list', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    pooja_id: props.route.params.pooja_id,
                    pooja_name: props.route.params.pooja_name,
                    item_id: pujaItemValue,
                    variant_id: pujaVariantValue
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // console.log('Save Pooja Item successfully', data);
                closeAddModal();
                getPoojaItemById();
                setPujaVariantValue(null);
                setPujaItemValue(null);
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to save pooja Item. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        } catch (error) {
            setErrorMessage('Failed to save pooja Item. Please try again.');
            setShowError(true);
            console.log("Error", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    }

    const [editItem, setEditItem] = useState(null);

    const clickEdit = (item) => {
        // console.log("Item Id", item);
        setEditItem(item);
        const variantParent = allVariant.find((variant) => variant.id === item.item_id)
        const variantList = variantParent.variants?.map((variant) => ({ ...variant, label: variant.title, value: variant.id }));
        setPujaVariantList(variantList)
        setOpenEditModal(true);
        setPujaItemValue(item.item_id);
        setPujaVariantValue(item.variant_id);
    }

    const EditPoojaItemById = async () => {
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        setIsLoading(true);
        try {
            if (pujaVariantValue === null) {
                setErrorMessage('Please Select Any Variant');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }

            const response = await fetch(base_url + 'api/update-pooja-items/' + editItem.id, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    pooja_id: props.route.params.pooja_id,
                    pooja_name: props.route.params.pooja_name,
                    item_id: pujaItemValue,
                    variant_id: pujaVariantValue
                }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Update Pooja Item successfully', data);
                closeEditModal();
                getPoojaItemById();
                setPujaVariantValue(null);
                setPujaItemValue(null);
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to Update pooja Item. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        } catch (error) {
            setErrorMessage('Failed to Update pooja Item. Please try again.');
            setShowError(true);
            console.log("Error", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    }

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const closeDeleteModal = () => { setOpenDeleteModal(false) }
    const [deleteId, setDeleteId] = useState(null);

    const clickDelete = (id) => {
        setOpenDeleteModal(true);
        setDeleteId(id);
    }

    const deleteItem = async () => {
        // console.log("Delete Item", deleteId);
        var access_token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            const response = await fetch(`${base_url}api/delete-pooja-items/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                // console.log('Delete Pooja Item successfully', data);
                setDeleteId(null);
                closeDeleteModal();
                getPoojaItemById();
            } else {
                console.log("Failed to Delete pooja Item. Please try again.", error);
            }
        } catch (error) {
            console.log("Failed to Delete pooja Item. Please try again.", error);
        }
    }

    // useEffect(() => {
    //     const variantList = allVariant?.map((variant) => ({ ...variant, label: variant.title, value: variant.id }))
    //     setPujaVariantList(variantList)
    // }, [pujaItemValue])


    useEffect(() => {
        const tempItems = []
        allVariant.forEach((item) => tempItems.push({ ...item, label: item.item_name, value: item.id }))
        setPujaItemList(tempItems)
        // console.log("allItem", tempItems);
    }, [allVariant])

    useEffect(() => {
        if (isFocused) {
            getPoojaItemById();
            getPoojaVariant();
            setPoojaDetails(props.route.params);
            // console.log("object", props.route.params);
        }
    }, [isFocused])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.headerBack}>
                    <Feather name="chevron-left" color={'#555454'} size={30} />
                    <Text style={styles.headerText}>Add Pooja Samagri</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: poojaDetails.pooja_photo_url }}
                    style={styles.headerImage}
                />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{poojaDetails.pooja_name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EditPujaDetails', poojaDetails)} style={{ backgroundColor: 'red', padding: 8, borderRadius: 6 }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit Pooja</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {spinner ?
                <View style={{ flex: 1, alignSelf: 'center', top: '30%' }}>
                    <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
                </View>
                :
                poojaItemList.length > 0 ?
                    <ScrollView contentContainerStyle={styles.scrollViewList}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={poojaItemList}
                            inverted
                            scrollEnabled={false}
                            keyExtractor={(key) => key.id.toString()}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemContainer} key={index}>
                                    <View style={{ width: '40%' }}>
                                        <Text style={styles.itemText}>{item.item_name}</Text>
                                    </View>
                                    <View style={{ width: '40%', alignItems: 'center' }}>
                                        <Text style={styles.itemText}>{item.title}</Text>
                                    </View>
                                    <View style={styles.itemActions}>
                                        <TouchableOpacity onPress={() => clickEdit(item)} style={styles.actionButton}>
                                            <MaterialIcons name="edit" size={24} color="#016a59" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => clickDelete(item.id)} style={styles.actionButton}>
                                            <MaterialIcons name="delete" size={24} color="#c41414" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    </ScrollView>
                    :
                    <View style={{ flex: 1, top: '20%' }}>
                        <Text style={{ color: '#000', fontSize: 18, fontWeight: '500', textAlign: 'center' }}>Add Samagri For This Pooja</Text>
                    </View>
            }
            <TouchableOpacity onPress={() => setOpenAddModal(true)} style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add Pooja Samagri</Text>
            </TouchableOpacity>

            {/* Start Add Item Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={openAddModal}
                onRequestClose={closeAddModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 17, fontWeight: '500' }}>Add Pooja Samagri</Text>
                            <TouchableOpacity onPress={closeAddModal}>
                                <Ionicons name="close" size={30} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.form}>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.label}>Select Samagri</Text>
                                <View style={styles.dropdownContainer}>
                                    <DropDownPicker
                                        style={styles.dropdown}
                                        placeholder={!isFocus ? 'Select Samagri' : '...'}
                                        open={pujaItem}
                                        value={pujaItemValue}
                                        items={pujaItemList}
                                        setOpen={setPujaItem}
                                        setValue={setPujaItemValue}
                                        setItems={setPujaItemList}
                                        // itemSeparator={true}
                                        searchable={true}
                                        listMode="SCROLLVIEW"
                                        autoScroll={true}
                                        onSelectItem={(selectedVariant) => {
                                            const variantList = selectedVariant.variants?.map((variant) => ({ ...variant, label: variant.title, value: variant.id }))
                                            setPujaVariantList(variantList)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputContainer, { zIndex: 999 }]}>
                                <Text style={styles.label}>Select Variant</Text>
                                <View style={styles.dropdownContainer}>
                                    <DropDownPicker
                                        style={styles.dropdown}
                                        placeholder={!isFocus ? 'Select Variant' : '...'}
                                        open={pujaVariant}
                                        value={pujaVariantValue}
                                        items={pujaVariantList}
                                        setOpen={setPujaVariant}
                                        setValue={setPujaVariantValue}
                                        setItems={setPujaVariantList}
                                        itemSeparator={true}
                                        // searchable={true}
                                        listMode="SCROLLVIEW"
                                        autoScroll={true}
                                    />
                                </View>
                            </View>
                        </View>
                        {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#c80100" />
                        ) : (
                            <TouchableOpacity onPress={() => savePoojaItemById()} style={styles.submitBtn}>
                                <Text style={styles.submitBtnText}>Save</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            {/* End Add Item Modal */}

            {/* Start Edit Item Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={openEditModal}
                onRequestClose={closeEditModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={{ width: '90%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 17, fontWeight: '500' }}>Edit Pooja Samagri</Text>
                            <TouchableOpacity onPress={closeEditModal}>
                                <Ionicons name="close" size={30} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.form}>
                            <View style={[styles.inputContainer]}>
                                <Text style={styles.label}>Select Samagri</Text>
                                <View style={styles.dropdownContainer}>
                                    <DropDownPicker
                                        style={[styles.dropdown, { backgroundColor: '#dedede' }]}
                                        placeholder={!isFocus ? 'Select Samagri' : '...'}
                                        open={pujaItem}
                                        value={pujaItemValue}
                                        items={pujaItemList}
                                        setOpen={setPujaItem}
                                        setValue={setPujaItemValue}
                                        setItems={setPujaItemList}
                                        // itemSeparator={true}
                                        disabled={true}
                                        searchable={true}
                                        listMode="SCROLLVIEW"
                                        autoScroll={true}
                                        onSelectItem={(selectedVariant) => {
                                            const variantList = selectedVariant.variants?.map((variant) => ({ ...variant, label: variant.title, value: variant.id }))
                                            setPujaVariantList(variantList)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.inputContainer, { zIndex: 999 }]}>
                                <Text style={styles.label}>Select Variant</Text>
                                <View style={styles.dropdownContainer}>
                                    <DropDownPicker
                                        style={styles.dropdown}
                                        placeholder={!isFocus ? 'Select Variant' : '...'}
                                        open={pujaVariant}
                                        value={pujaVariantValue}
                                        items={pujaVariantList}
                                        setOpen={setPujaVariant}
                                        setValue={setPujaVariantValue}
                                        setItems={setPujaVariantList}
                                        itemSeparator={true}
                                        // searchable={true}
                                        listMode="SCROLLVIEW"
                                        autoScroll={true}
                                    />
                                </View>
                            </View>
                        </View>
                        {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#c80100" />
                        ) : (
                            <TouchableOpacity onPress={() => EditPoojaItemById()} style={styles.submitBtn}>
                                <Text style={styles.submitBtnText}>Save</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            {/* End Edit Item Modal */}

            {/* Start Delete Item Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={openDeleteModal}
                onRequestClose={closeDeleteModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10 }}>
                            <View style={{ alignItems: 'center' }}>
                                <MaterialIcons name="report-gmailerrorred" size={100} color="red" />
                                <Text style={{ color: '#000', fontSize: 23, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.3 }}>Are You Sure To Delete This Pooja Samagri</Text>
                                <Text style={{ color: 'gray', fontSize: 17, fontWeight: '500', marginTop: 4 }}>You won't be able to revert this!</Text>
                            </View>
                        </View>
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 }}>
                            <TouchableOpacity onPress={closeDeleteModal} style={styles.cancelDeleteBtn}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={deleteItem} style={styles.confirmDeleteBtn}>
                                <Text style={styles.btnText}>Yes, delete it!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End Delete Item Modal */}

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
    scrollViewList: {
        width: '100%',
        marginTop: 10,
    },
    headerPart: {
        backgroundColor: '#fff',
        paddingVertical: 13,
        paddingHorizontal: 15,
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
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 10,
        color: '#000',
        textTransform: 'capitalize'
    },
    headerContainer: {
        width: '100%',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    headerTextContainer: {
        width: '94%',
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    form: {
        marginTop: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#444', // Slightly lighter label color
        fontSize: 18, // Larger font size for better readability
        marginBottom: 8,
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
    submitBtn: {
        backgroundColor: '#e63946', // Changed to a more vibrant red
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20, // Adjusted vertical margins
        shadowColor: '#000', // Added shadow effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    addBtn: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#016a59',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
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
    dropdownContainer: {
        width: '100%',
    },
    dropdown: {
        width: '100%',
        backgroundColor: '#f9f9f9', // Lighter background color
        borderWidth: 1,
        borderColor: '#ddd', // Lighter border color
        borderRadius: 10, // More rounded corners
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000', // Subtle shadow for dropdown
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    itemContainer: {
        backgroundColor: '#fff',
        width: '94%',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        shadowOffset: { height: 10, width: 10 },
        shadowOpacity: 0.6,
        shadowColor: 'black',
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        color: '#000',
        fontSize: 16,
    },
    itemActions: {
        flexDirection: 'row',
        width: '20%'
    },
    actionButton: {
        marginHorizontal: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5
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
