import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, Modal, Alert, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import DropDownPicker from 'react-native-dropdown-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { base_url } from '../../../App';

const Index = (props) => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [spinner, setSpinner] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [addAddressModal, setAddAddressModal] = useState(false);
  const closeAddAddressModal = () => {
    setAddAddressModal(false);
    setStateValue(null);
    setDistValue(null);
    setDistList([]);
    setSubDistValue(null);
    setSubDistList([]);
    setVillageValue(null);
    setVillageList([]);
  }
  const [editAddressModal, setEditAddressModal] = useState(false);
  const closeEditAddressModal = () => {
    setEditAddressModal(false);
    setStateValue(null);
    setDistValue(null);
    setDistList([]);
    setSubDistValue(null);
    setSubDistList([]);
    setVillageValue(null);
    setVillageList([]);
  }

  const [isFocus, setIsFocus] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryValue, setCountryValue] = useState('India');
  const [countryList, setCountryList] = useState([
    { label: 'India', value: 'India' },
  ]);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [stateList, setStateList] = useState([
    { label: 'Odisha', value: "21" },
  ]);

  const [distOpen, setDistOpen] = useState(false);
  const [distValue, setDistValue] = useState(null);
  const [distList, setDistList] = useState([]);

  const [subDistOpen, setSubDistOpen] = useState(false);
  const [subDistValue, setSubDistValue] = useState(null);
  const [subDistList, setSubDistList] = useState([]);

  const [villageOpen, setVillageOpen] = useState(false);
  const [villageValue, setVillageValue] = useState(null);
  const [villageList, setVillageList] = useState([]);

  const getDistrictByState = async () => {
    try {
      const response = await fetch(base_url + 'api/get-districts/21', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      if (responseData.status === 200) {
        // console.log("getProfile-------", responseData.data);
        const districts = responseData.data.map(district => ({
          label: district.districtName,
          value: district.districtCode,
        }));
        setDistList(districts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getSubDistrictByDistrict = async () => {
    try {
      const response = await fetch(`${base_url}api/get-subdistricts/${distValue}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      if (responseData.status === 200) {
        // console.log("getProfile-------", responseData.data);
        const subDistricts = responseData.data.map(subDist => ({
          label: subDist.subdistrictName,
          value: subDist.subdistrictCode,
        }));
        setSubDistList(subDistricts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getVillageBySubDistrict = async () => {
    try {
      const response = await fetch(`${base_url}api/get-village/${subDistValue}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      if (responseData.status === 200) {
        // console.log("getProfile-------", responseData.data);
        const villages = responseData.data.map(village => ({
          label: village.villageName,
          value: village.villageCode,
        }));
        setVillageList(villages);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (stateValue) {
      getDistrictByState();
      setDistValue(null);
      setSubDistValue(null);
      setVillageValue(null);
      setDistList([]);
      setSubDistList([]);
      setVillageList([]);
    }
  }, [stateValue]);

  useEffect(() => {
    if (distValue) {
      getSubDistrictByDistrict();
      setSubDistValue(null);
      setVillageValue(null);
      setSubDistList([]);
      setVillageList([]);
    }
  }, [distValue]);

  useEffect(() => {
    if (subDistValue) {
      getVillageBySubDistrict();
      setVillageValue(null);
      setVillageList([]);
    }
  }, [subDistValue]);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveArea = async () => {
    // console.log("village", villageValue);
    // return;
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    setIsLoading(true);
    try {
      if (stateValue === null) {
        setErrorMessage('Please Select Your State.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (distValue === null) {
        setErrorMessage('Please Select Your District.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (subDistValue === null) {
        setErrorMessage('Please Select Your Sub-district.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (villageValue === null) {
        setErrorMessage('Please Select Your Village.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('state', stateValue);
      formData.append('district', distValue);
      formData.append('city', subDistValue);
      formData.append('village', villageValue);

      const response = await fetch(`${base_url}api/save-poojaArea`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Save Area successfully', data);
        getAllArea();
        closeAddAddressModal();
      } else {
        // Handle error response
        setErrorMessage(data.message || 'Failed to save Area. Please try again.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }

    } catch (error) {
      setErrorMessage('Failed to save Area. Please try again.');
      setShowError(true);
      console.log("Error", error);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }

  const [openDeleteAreaModal, setOpenDeleteAreaModal] = useState(false);
  const closeDeleteAreaModal = () => { setOpenDeleteAreaModal(false); setDeleteAreaId(null); };
  const [deleteAreaId, setDeleteAreaId] = useState(null);

  const confirmDelete = (areaId) => {
    setDeleteAreaId(areaId);
    setOpenDeleteAreaModal(true);
  }

  const deleteArea = async () => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      const response = await fetch(`${base_url}api/delet-pooja-area/${deleteAreaId}`, {
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
        getAllArea();
        closeDeleteAreaModal();
      } else {
        console.log("Failed to Delete pooja Item. Please try again.", error);
      }
    } catch (error) {
      console.log("Failed to Delete pooja Item. Please try again.", error);
    }
  }

  const [editAreaId, setEditAreaId] = useState(null);

  const getAreaById = async (area) => {
    setEditAreaId(area.id);
    setEditAddressModal(true);
    // console.log("area", area);
    setStateValue(area.state_code);
    await getDistrictByState(area.state_code);
    setDistValue(area.district_code);
    await getSubDistrictByDistrict(area.district_code);
    setSubDistValue(area.subdistrict_code);
    await getVillageBySubDistrict(area.subdistrict_code);
    setVillageValue(area.village_code.split(','));
  }

  const editArea = async () => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    setIsLoading(true);
    try {
      if (villageValue === null) {
        setErrorMessage('Please Select Your Village.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('subdistrict_code', subDistValue);
      formData.append('village', villageValue);

      const response = await fetch(`${base_url}api/update-pooja-area/${editAreaId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Update Area successfully', data);
        getAllArea();
        closeEditAddressModal();
      } else {
        // Handle error response
        setErrorMessage(data.message || 'Failed to Update Area. Please try again.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }

    } catch (error) {
      setErrorMessage('Failed to Update Area. Please try again.');
      setShowError(true);
      console.log("Error", error);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  }

  const getAllArea = async () => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      setSpinner(true);
      const response = await fetch(base_url + 'api/manage-poojaArea', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      });
      const responseData = await response.json();
      if (responseData.status === 200) {
        setSpinner(false);
        // console.log("getAllArea-------", responseData.data);
        setAllAddresses(responseData.data);
      }
    } catch (error) {
      setSpinner(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      getAllArea();
    }
  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPart}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="chevron-left" color={'#555454'} size={30} />
          <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Area Of Service</Text>
        </TouchableOpacity>
      </View>
      {spinner === true ?
        <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}>
          {/* <Image style={{ width: 50, height: 50 }} source={require('../../assets/img/loading.gif')} /> */}
          <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
        </View>
        :
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 10 }}>
          <View style={styles.currentLocation}>
            <TouchableOpacity onPress={() => setAddAddressModal(true)} style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
              <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome6 name="plus" color={'#ffcb44'} size={22} />
                <Text style={{ color: '#ffcb44', fontSize: 16, fontWeight: '500', marginLeft: 10 }}> Add a new Area</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 20 }}>
            <View style={{ backgroundColor: '#7a7979', height: 0.4, width: 100, alignSelf: 'center', marginVertical: 10 }}></View>
            <Text style={{ color: '#7a7979', fontSize: 14, fontWeight: '500', letterSpacing: 2 }}>SAVED AREA</Text>
            <View style={{ backgroundColor: '#7a7979', height: 0.4, width: 100, alignSelf: 'center', marginVertical: 10 }}></View>
          </View>
          {allAddresses.length > 0 ?
            <View style={{ flex: 1 }}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={[...allAddresses].reverse()}
                scrollEnabled={false}
                keyExtractor={(key) => {
                  return key.id
                }}
                renderItem={(address) => {
                  return (
                    <View style={styles.addressBox}>
                      <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
                        <Fontisto name="world-o" color={'#555454'} size={22} />
                      </View>
                      <View style={{ width: '5%' }}></View>
                      <View style={{ width: '72%', alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#545353', letterSpacing: 0.6 }}>{address.item.villageNames}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#545353', letterSpacing: 0.6 }}>{address.item.subdistrictName},  {address.item.districtName}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#545353', letterSpacing: 0.6 }}>{address.item.stateName},  India</Text>
                      </View>
                      <View style={{ width: '13%', alignItems: 'flex-end', paddingRight: 5, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <TouchableOpacity onPress={() => getAreaById(address.item)} style={{ backgroundColor: '#fff' }}>
                          <MaterialCommunityIcons name="circle-edit-outline" color={'#ffcb44'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(address.item.id)} style={{ backgroundColor: '#fff' }}>
                          <MaterialCommunityIcons name="delete-circle-outline" color={'#ffcb44'} size={26} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                }}
              />
            </View>
            :
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 200 }}>
              <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>No Area Saved</Text>
            </View>
          }
        </ScrollView>
      }

      {/* Add Address */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addAddressModal}
        onRequestClose={closeAddAddressModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.headerPart}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
              <Text style={styles.topHeaderText}>Add Area</Text>
            </View>
            <TouchableOpacity onPress={closeAddAddressModal} style={{ alignSelf: 'flex-end' }}>
              <Ionicons name="close" color={'#000'} size={32} marginRight={8} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ width: '90%', flex: 1, alignSelf: 'center', marginTop: 20 }}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Country</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000 }]}
                placeholder={!isFocus ? 'Select Country' : '...'}
                open={countryOpen}
                value={countryValue}
                items={countryList}
                setOpen={setCountryOpen}
                setValue={setCountryValue}
                setItems={setCountryList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
              // multiple={true}
              // dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select State</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000 }]}
                placeholder={!isFocus ? 'Select State' : '...'}
                open={stateOpen}
                value={stateValue}
                items={stateList}
                setOpen={setStateOpen}
                setValue={setStateValue}
                setItems={setStateList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
              // multiple={true}
              // dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select District</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000 }]}
                placeholder={!isFocus ? 'Select District' : '...'}
                open={distOpen}
                value={distValue}
                items={distList}
                setOpen={setDistOpen}
                setValue={setDistValue}
                setItems={setDistList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
              // multiple={true}
              // dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Sub-district</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000 }]}
                placeholder={!isFocus ? 'Select Sub-district' : '...'}
                open={subDistOpen}
                value={subDistValue}
                items={subDistList}
                setOpen={setSubDistOpen}
                setValue={setSubDistValue}
                setItems={setSubDistList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                // multiple={true}
                dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Village</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 999 }]}
                // placeholder={!isFocus ? 'Select Village' : '...'}
                open={villageOpen}
                value={villageValue}
                items={villageList}
                setOpen={setVillageOpen}
                setValue={setVillageValue}
                setItems={setVillageList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                multiple={true}
                dropDownDirection={'TOP'}
              />
            </View>
          </ScrollView>
          {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
          {isLoading ? (
            <ActivityIndicator size="large" color="#c80100" />
          ) : (
            <TouchableOpacity onPress={saveArea} style={styles.saveAddress}>
              <Text style={{ color: '#000', fontSize: 17, fontWeight: '600' }}>Save Area</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* Edit Address */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editAddressModal}
        onRequestClose={closeEditAddressModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.headerPart}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 7 }}>
              <Text style={styles.topHeaderText}>Edit Area</Text>
            </View>
            <TouchableOpacity onPress={closeEditAddressModal} style={{ alignSelf: 'flex-end' }}>
              <Ionicons name="close" color={'#000'} size={32} marginRight={8} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ width: '90%', flex: 1, alignSelf: 'center', marginTop: 20 }}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Country</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000, backgroundColor: '#e6e6e6' }]}
                placeholder={!isFocus ? 'Select Country' : '...'}
                open={countryOpen}
                value={countryValue}
                items={countryList}
                setOpen={setCountryOpen}
                setValue={setCountryValue}
                setItems={setCountryList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                disabled={true}
              // multiple={true}
              // dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select State</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000, backgroundColor: '#e6e6e6' }]}
                placeholder={!isFocus ? 'Select State' : '...'}
                open={stateOpen}
                value={stateValue}
                items={stateList}
                setOpen={setStateOpen}
                setValue={setStateValue}
                setItems={setStateList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                disabled={true}
              // multiple={true}
              // dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select District</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000, backgroundColor: '#e6e6e6' }]}
                placeholder={!isFocus ? 'Select District' : '...'}
                open={distOpen}
                value={distValue}
                items={distList}
                setOpen={setDistOpen}
                setValue={setDistValue}
                setItems={setDistList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                disabled={true}
              // multiple={true}
              // dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Sub-district</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 1000, backgroundColor: '#e6e6e6' }]}
                placeholder={!isFocus ? 'Select Sub-district' : '...'}
                open={subDistOpen}
                value={subDistValue}
                items={subDistList}
                setOpen={setSubDistOpen}
                setValue={setSubDistValue}
                setItems={setSubDistList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                disabled={true}
                // multiple={true}
                dropDownDirection={'TOP'}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Village</Text>
              <DropDownPicker
                style={[styles.inputs, { zIndex: 999 }]}
                placeholder={!isFocus ? 'Select Village' : '...'}
                open={villageOpen}
                value={villageValue}
                items={villageList}
                setOpen={setVillageOpen}
                setValue={setVillageValue}
                setItems={setVillageList}
                itemSeparator={true}
                listMode="SCROLLVIEW"
                autoScroll={true}
                multiple={true}
                dropDownDirection={'TOP'}
              />
            </View>
          </ScrollView>
          {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
          {isLoading ? (
            <ActivityIndicator size="large" color="#c80100" />
          ) : (
            <TouchableOpacity onPress={editArea} style={styles.saveAddress}>
              <Text style={{ color: '#000', fontSize: 17, fontWeight: '600' }}>Update Area</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* Start Delete Area Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={openDeleteAreaModal}
        onRequestClose={closeDeleteAreaModal}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>
            <View style={{ width: '90%', alignSelf: 'center', marginBottom: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="report-gmailerrorred" size={100} color="red" />
                <Text style={{ color: '#000', fontSize: 23, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.3 }}>Are You Sure To Delete This Area</Text>
                <Text style={{ color: 'gray', fontSize: 17, fontWeight: '500', marginTop: 4 }}>You won't be able to revert this!</Text>
              </View>
            </View>
            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10 }}>
              <TouchableOpacity onPress={closeDeleteAreaModal} style={styles.cancelDeleteBtn}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteArea} style={styles.confirmDeleteBtn}>
                <Text style={styles.btnText}>Yes, delete it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* End Delete Area Modal */}

    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
    // backgroundColor: '#fff'
  },
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
  topHeaderText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 3,
    marginLeft: 5,
  },
  currentLocation: {
    backgroundColor: '#fff',
    marginTop: 15,
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10
  },
  addressBox: {
    width: '95%',
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 13,
    elevation: 5,
  },
  inputs: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    fontSize: 16,
    color: '#000'
  },
  inputLable: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 5
  },
  saveAddress: {
    width: '90%',
    backgroundColor: '#ffcb44',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    marginBottom: 15
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
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
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 15
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContainer: {
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
})