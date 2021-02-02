import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, TextInput, Clipboard, StyleSheet, Text, View, Button, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
// import { Clipboard } from '@react-native-community/clipboard';


export default function App() {

  const [contacts, setContacts] = useState([]);
  const [permissions, setPermissions] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('9999999999');
  const [address, setAddress] = useState({});
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = () => {
    // console.log(address);
    Clipboard.setString(`${address.name}, ${address.street}, ${address.city}, ${address.state}, ${address.zip}`);
    console.log(address.name, address.street, address.city, address.state, address.zip);
    // console.log(JSON.stringify(address));
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString('');
    setCopiedText(text);
  };


  const listContacts = async () => {
    const contactList = await Contacts.getContactsAsync();
    setContacts(contactList.data);
  }

  const getPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    console.log({ status });
    if (status === 'granted') {
      setPermissions(true);
    } else { setPermissions(false) }
  }

  useEffect(() => {
    getPermissions();
  }, [])

  const sendAddress = (contact) => {
    console.log({ contact })
    let mailingAddress = { name: contact.name, street: contact.addresses[0].street, city: contact.addresses[0].city, state: contact.addresses[0].region, zip: contact.addresses[0].postalCode };
    setAddress(mailingAddress);
  }
  const sendEmail = async () => {
    console.log('made it to sendEmail')
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text></Text>
      <Text></Text>
      <Button
        onPress={listContacts}
        title="Show Contacts"
      ></Button>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Button title={item.name} onPress={() => sendAddress(item)} />}
      ></FlatList>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titleText}>
            Click contact above to populate with address
        </Text>
          <Text style={styles.titleTextsmall}>
          </Text>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <TouchableOpacity onPress={copyToClipboard}>
                <Text>Name: {address.name}</Text>
                <Text>Street: {address.street}</Text>
                <Text>City: {address.city}</Text>
                <Text>State: {address.state}</Text>
                <Text>Zipcode: {address.zip}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={fetchCopiedText}>
                <Text>View copied text</Text>
              </TouchableOpacity>

              <Text style={styles.copiedText}>{copiedText}</Text>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
});
