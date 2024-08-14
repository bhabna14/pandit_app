import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import CheckBox from '@react-native-community/checkbox';
import { base_url } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const AddressPage = (props) => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [spinner, setSpinner] = useState(false);

  const [presentAddress, setPresentAddress] = useState('');
  const [post, setPost] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [sameAsPresent, setSameAsPresent] = useState(true);

  const [permanentAddress, setPermanentAddress] = useState('');
  const [permanentPost, setPermanentPost] = useState('');
  const [permanentDistrict, setPermanentDistrict] = useState('');
  const [permanentState, setPermanentState] = useState('');
  const [permanentCountry, setPermanentCountry] = useState('');
  const [permanentPincode, setPermanentPincode] = useState('');
  const [permanentLandmark, setPermanentLandmark] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveAddress = async () => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    setIsLoading(true);

    try {
      if (presentAddress === '') {
        setErrorMessage('Please Enter Your Present Address.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (post === '') {
        setErrorMessage('Please Enter Your Present Post.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (district === '') {
        setErrorMessage('Please Enter Your Present District.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (state === '') {
        setErrorMessage('Please Enter Your Present State.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (country === '') {
        setErrorMessage('Please Enter Your Present Country.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (pincode === '') {
        setErrorMessage('Please Enter Your Present Pincode.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (landmark === '') {
        setErrorMessage('Please Enter Your Present Landmark.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentAddress === '') {
        setErrorMessage('Please Enter Your Permanent Address.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentPost === '') {
        setErrorMessage('Please Enter Your Permanent Post.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentDistrict === '') {
        setErrorMessage('Please Enter Your Permanent District.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentState === '') {
        setErrorMessage('Please Enter Your Permanent State.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentCountry === '') {
        setErrorMessage('Please Enter Your Permanent Country.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentPincode === '') {
        setErrorMessage('Please Enter Your Permanent Pincode.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (permanentLandmark === '') {
        setErrorMessage('Please Enter Your Permanent Landmark.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('preaddress', presentAddress);
      formData.append('prepost', post);
      formData.append('predistrict', district);
      formData.append('prestate', state);
      formData.append('precountry', country);
      formData.append('prepincode', pincode);
      formData.append('prelandmark', landmark);

      formData.append('peraddress', permanentAddress);
      formData.append('perpost', permanentPost);
      formData.append('perdistri', permanentDistrict);
      formData.append('perstate', permanentState);
      formData.append('percountry', permanentCountry);
      formData.append('perpincode', permanentPincode);
      formData.append('perlandmark', permanentLandmark);

      // console.log("formData", formData);
      // return;

      const response = await fetch(base_url + 'api/pandit/saveaddress', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Save Address successfully', data);
        navigation.goBack();
      } else {
        // Handle error response
        setErrorMessage(data.message || 'Failed to save Address. Please try again1.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } catch (error) {
      // Handle error response
      setErrorMessage('Failed to save Address. Please try again2.');
      setShowError(true);
      console.log("Error", error);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (newValue) => {
    setSameAsPresent(newValue);
    if (newValue) {
      setPermanentAddress(presentAddress);
      setPermanentPost(post);
      setPermanentDistrict(district);
      setPermanentState(state);
      setPermanentCountry(country);
      setPermanentPincode(pincode);
      setPermanentLandmark(landmark);
    } else {
      setPermanentAddress('');
      setPermanentPost('');
      setPermanentDistrict('');
      setPermanentState('');
      setPermanentCountry('');
      setPermanentPincode('');
      setPermanentLandmark('');
    }
  };

  const getBankDetails = async () => {
    const token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      setSpinner(true);
      const response = await fetch(base_url + 'api/pandit/show-address', {
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
        console.log("getBankDetails", responseData.data);
        setPresentAddress(responseData.data.preaddress);
        setPost(responseData.data.prepost);
        setDistrict(responseData.data.predistrict);
        setState(responseData.data.prestate);
        setCountry(responseData.data.precountry);
        setPincode(responseData.data.prepincode);
        setLandmark(responseData.data.prelandmark);
        setPermanentAddress(responseData.data.peraddress);
        setPermanentPost(responseData.data.perpost);
        setPermanentDistrict(responseData.data.perdistri);
        setPermanentState(responseData.data.perstate);
        setPermanentCountry(responseData.data.percountry);
        setPermanentPincode(responseData.data.perpincode);
        setPermanentLandmark(responseData.data.perlandmark);
      }
    } catch (error) {
      setSpinner(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      getBankDetails();
    }
  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPart}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="chevron-left" color={'#555454'} size={30} />
          <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Address Details</Text>
        </TouchableOpacity>
      </View>
      {spinner === true ?
        <View style={{ flex: 1, alignSelf: 'center', top: '30%' }}>
          <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
        </View>
        :
        <ScrollView style={{ width: '100%', marginTop: 20 }}>
          {[
            { label: 'Present Address', value: presentAddress, onChange: setPresentAddress, placeholder: 'Enter Present Address' },
            { label: 'Post', value: post, onChange: setPost, placeholder: 'Enter Post' },
            { label: 'District', value: district, onChange: setDistrict, placeholder: 'Enter District' },
            { label: 'State', value: state, onChange: setState, placeholder: 'Enter State' },
            { label: 'Country', value: country, onChange: setCountry, placeholder: 'Enter Country' },
            { label: 'Pincode', value: pincode, onChange: setPincode, placeholder: 'Enter Pincode', keyboardType: 'number-pad', maxLength: 6 },
            { label: 'Landmark', value: landmark, onChange: setLandmark, placeholder: 'Enter Landmark' }
          ].map((field, index) => (
            <View key={index} style={{ width: '90%', alignSelf: 'center', marginBottom: 25 }}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <View style={styles.card}>
                <TextInput
                  style={styles.inputs}
                  onChangeText={(text) => {
                    field.onChange(text);
                    if (sameAsPresent) {
                      if (field.label === 'Present Address') setPermanentAddress(text);
                      if (field.label === 'Post') setPermanentPost(text);
                      if (field.label === 'District') setPermanentDistrict(text);
                      if (field.label === 'State') setPermanentState(text);
                      if (field.label === 'Country') setPermanentCountry(text);
                      if (field.label === 'Pincode') setPermanentPincode(text);
                      if (field.label === 'Landmark') setPermanentLandmark(text);
                    }
                  }}
                  value={field.value}
                  placeholder={field.placeholder}
                  placeholderTextColor="#424242"
                  underlineColorAndroid='transparent'
                  keyboardType={field.keyboardType || 'default'}
                  maxLength={field.maxLength || undefined}
                />
              </View>
            </View>
          ))}
          <View style={{ width: '90%', alignSelf: 'center', marginBottom: 25, flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              tintColors={'#000'}
              value={sameAsPresent}
              onValueChange={handleCheckboxChange}
            />
            <View>
              <Text style={{ color: '#000', fontSize: 15, fontWeight: '400' }}>The Permanent address is same</Text>
              <Text style={{ color: '#000', fontSize: 15, fontWeight: '400' }}>as The Present address..</Text>
            </View>
          </View>
          {!sameAsPresent && (
            <>
              {[
                { label: 'Permanent Address', value: permanentAddress, onChange: setPermanentAddress, placeholder: 'Enter Permanent Address' },
                { label: 'Post', value: permanentPost, onChange: setPermanentPost, placeholder: 'Enter Post' },
                { label: 'District', value: permanentDistrict, onChange: setPermanentDistrict, placeholder: 'Enter District' },
                { label: 'State', value: permanentState, onChange: setPermanentState, placeholder: 'Enter State' },
                { label: 'Country', value: permanentCountry, onChange: setPermanentCountry, placeholder: 'Enter Country' },
                { label: 'Pincode', value: permanentPincode, onChange: setPermanentPincode, placeholder: 'Enter Pincode', keyboardType: 'number-pad', maxLength: 6 },
                { label: 'Landmark', value: permanentLandmark, onChange: setPermanentLandmark, placeholder: 'Enter Landmark' }
              ].map((field, index) => (
                <View key={index} style={{ width: '90%', alignSelf: 'center', marginBottom: 25 }}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <View style={styles.card}>
                    <TextInput
                      style={styles.inputs}
                      onChangeText={field.onChange}
                      value={field.value}
                      placeholder={field.placeholder}
                      placeholderTextColor="#424242"
                      underlineColorAndroid='transparent'
                      keyboardType={field.keyboardType || 'default'}
                      maxLength={field.maxLength || undefined}
                    />
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      }
      {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#c80100" />
      ) : (
        !spinner === true &&
        <TouchableOpacity onPress={saveAddress} style={styles.saveAddress}>
          <Text style={{ color: '#000', fontSize: 17, fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default AddressPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f5f5'
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
  inputLabel: {
    color: '#000',
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 5
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
    color: '#000',
    padding: 10
  },
  saveAddress: {
    width: '90%',
    backgroundColor: '#ffcb44',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    marginVertical: 15
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 25
  },
});
