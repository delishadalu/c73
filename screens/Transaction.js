import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import * as Permission from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config';
import firebase from 'firebase';

export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      handleCameraPermission: false,
      scannedData: 'open the QR code',
      buttonState: 'normal',
      bookId: '',
      studentId: '',
    };
  }

  handleCameraPermission = async (id) => {
    var { status } = await Permission.askAsync(Permission.CAMERA);
    //console.log(status)
    this.setState({
      handleCameraPermission: status === 'granted',
      buttonState: id,
    });
  };
  handleBarCodeScanner = async ({ data }) => {
    if (this.state.buttonState === 'studentId') {
      this.setState({
        studentId: data,
        buttonState: 'normal',
      });
    } else if (this.state.buttonState === 'bookId') {
      this.setState({
        bookId: data,
        buttonState: 'normal',
      });
    }
  };

  handleTransaction = async () => {
    await db
      .collection('books')
      .doc(this.state.bookId)
      .get()
      .then((resp) => {
        var books = resp.data();

        if (books.bookAvail === true) {
          this.bookIssued();
        } else {
          this.bookReturned();
        }
      });

    this.setState({
      bookId: '',
      studentId: '',
    });
  };

  bookIssued = () => {
    db.collection('transactions').add({
      bookId: this.state.bookId,
      studentId: this.state.studentId,
      transactionType: 'issued',
      data: firebase.firestore.Timestamp.now().toDate(),
    });
    db.collection('books').doc(this.state.bookId).update({
      bookAvail: false,
    });
    db.collection('students')
      .doc(this.state.studentId)
      .update({
        noOfBooksIssued: firebase.firestore.FieldValue.increment(1),
      });
    alert('Book issued by student');
    //ToastAndroid.show('Book issued by student', ToastAndroid.SHORT);
  };

  bookReturned = () => {
    db.collection('transactions').add({
      bookId: this.state.bookId,
      studentId: this.state.studentId,
      transactionType: 'returned',
      data: firebase.firestore.Timestamp.now().toDate(),
    });
    db.collection('books').doc(this.state.bookId).update({
      bookAvail: true,
    });
    db.collection('students')
      .doc(this.state.studentId)
      .update({
        noOfBooksIssued: firebase.firestore.FieldValue.increment(-1),
      });
    alert('Book returned to the library');
  };

  render() {
    if (this.state.buttonState !== 'normal') {
      return (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={this.handleBarCodeScanner}
        />
      );
    }
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ImageBackground
          style={{ flex: 1, alignItems: 'center' }}
          source={require('../assets/background2.png')}>
          <View style={{ flex: 0.5 }}>
            <Image
              style={{ width: 150, height: 150, marginTop: 20 }}
              source={require('../assets/appIcon.png')}
            />
          </View>
          <Image
            style={{ width: 150, height: 75, marginTop: 50 }}
            source={require('../assets/appName.png')}
          />
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TextInput
              onChangeText={(data) => this.setState({ studentId: data })}
              placeholder="student ID"
              style={{ borderWidth: 4, width: 200 }}
              value={this.state.studentId}
            />
            <TouchableOpacity
              onPress={() => this.handleCameraPermission('studentId')}>
              <Text>Scan</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TextInput
              onChangeText={(data) => this.setState({ bookId: data })}
              placeholder="Book ID"
              style={{ borderWidth: 4, width: 200 }}
              value={this.state.bookId}
            />
            <TouchableOpacity
              onPress={() => this.handleCameraPermission('bookId')}>
              <Text>Scan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ backgroundColor: 'red', marginTop: 20 }}
            onPress={this.handleTransaction}>
            <Text>submit</Text>
          </TouchableOpacity>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
