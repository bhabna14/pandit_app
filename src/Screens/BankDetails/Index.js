import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { base_url } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const BankDetailsForm = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [spinner, setSpinner] = useState(false);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [upiId, setUpiId] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveBankDetails = async () => {
    var access_token = await AsyncStorage.getItem('storeAccesstoken');
    setIsLoading(true);

    try {
      if (bankName === '') {
        setErrorMessage('Please Enter Your Bank Name.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (branchName === '') {
        setErrorMessage('Please Enter Your Branch Name.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (ifscCode === '') {
        setErrorMessage('Please Enter Your IFSC Code.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (accountHolderName === '') {
        setErrorMessage('Please Enter Account Holder Name.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (accountNumber === '') {
        setErrorMessage('Please Enter Your Account Number.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }
      if (upiId === '') {
        setErrorMessage('Please Enter Your UPI ID.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('bankname', bankName);
      formData.append('branchname', branchName);
      formData.append('ifsccode', ifscCode);
      formData.append('accname', accountHolderName);
      formData.append('accnumber', accountNumber);
      formData.append('upi_number', upiId);

      // console.log("formData", formData);
      // return;

      const response = await fetch(base_url + 'api/pandit/savebankdetails', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Save Bank Details successfully', data);
        navigation.goBack();
      } else {
        // Handle error response
        setErrorMessage(data.message || 'Failed to save Bank Details. Please try again1.');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } catch (error) {
      // Handle error response
      setErrorMessage('Failed to save Bank Details. Please try again2.');
      setShowError(true);
      console.log("Error", error);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const getBankDetails = async () => {
    const token = await AsyncStorage.getItem('storeAccesstoken');
    try {
      setSpinner(true);
      const response = await fetch(base_url + 'api/pandit/get-bank-details', {
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
        // console.log("getBankDetails", responseData.data);
        setBankName(responseData.data.bankname);
        setBranchName(responseData.data.branchname);
        setIfscCode(responseData.data.ifsccode);
        setAccountHolderName(responseData.data.accname);
        setAccountNumber(responseData.data.accnumber);
        setUpiId(responseData.data.upi_number);
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
          <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Bank Details</Text>
        </TouchableOpacity>
      </View>
      {spinner === true ?
        <View style={{ flex: 1, alignSelf: 'center', top: '30%' }}>
          <Text style={{ color: '#ffcb44', fontSize: 17 }}>Loading...</Text>
        </View>
        :
        <ScrollView style={{ width: '100%', marginTop: 20 }}>
          {[
            { label: 'Bank Name', value: bankName, onChange: setBankName, placeholder: 'Enter Bank Name' },
            { label: 'Branch Name', value: branchName, onChange: setBranchName, placeholder: 'Enter Branch Name' },
            { label: 'IFSC Code', value: ifscCode, onChange: setIfscCode, placeholder: 'Enter IFSC Code', maxLength: 11, autoCapitalize: 'characters' },
            { label: 'Account Holder Name', value: accountHolderName, onChange: setAccountHolderName, placeholder: 'Enter Account Holder Name' },
            { label: 'Account Number', value: accountNumber, onChange: setAccountNumber, placeholder: 'Enter Account Number', keyboardType: 'number-pad', maxLength: 18 },
            { label: 'UPI ID', value: upiId, onChange: setUpiId, placeholder: 'Enter UPI ID' }
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
                  autoCapitalize={field.autoCapitalize || 'none'}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      }
      {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#c80100" />
      ) : (
        !spinner === true &&
        <TouchableOpacity onPress={saveBankDetails} style={styles.saveDetails}>
          <Text style={{ color: '#000', fontSize: 17, fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default BankDetailsForm;

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
  saveDetails: {
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
