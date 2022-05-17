import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image, ImageBackground,
  Alert
} from 'react-native';
import Server from '../Server.js';
import axios from 'axios';
import * as database from '../database';
import * as Font from 'expo-font';

let customFonts = {
  'GerthDemo': require('../assets/fonts/GerthDemo.ttf'),
  'StyleScript-Regular': require('../assets/fonts/StyleScript-Regular.ttf'),
  'Cinzel-Regular': require('../assets/fonts/Cinzel/Cinzel-Regular.ttf'),
  'Cinzel-Bold': require('../assets/fonts/Cinzel/Cinzel-Bold.ttf'),
  'Cinzel-Medium': require('../assets/fonts/Cinzel/Cinzel-Medium.ttf'),

  'FrankRuhlLibre-Light': require('../assets/fonts/Frank_Ruhl_Libre/FrankRuhlLibre-Light.ttf'),
  'FrankRuhlLibre-Regular': require('../assets/fonts/Frank_Ruhl_Libre/FrankRuhlLibre-Regular.ttf'),
  
  'LobsterTwo-Regular': require('../assets/fonts/Lobster_Two/LobsterTwo-Regular.ttf'),
  'LobsterTwo-Italic': require('../assets/fonts/Lobster_Two/LobsterTwo-Italic.ttf'),
};

export default class LoginView extends Component {

  state = {
    passwordHash: '',
    userName: '',
    password: '',
    loding: false,
    fontsLoaded: false,
  }


  _loadFontsAsync() {
    Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount(){
    this._loadFontsAsync();
  }

  storLogin = () => {
    database.setData({ status: 'logedIn', passwordhash: this.state.passwordHash, username: this.state.userName, theme:'sunny' }).then(
      (resp) => { console.log(resp); }).catch(
        (err) => { console.log(err); }
      );
  }

  loginbtn = () => {
    let res = '';
    let tis = this;
    this.setState({ loding: true });
    axios.post(Server.url + "auth", {
      userName: this.state.userName,
      password: this.state.password,
    })
      .then(function (response) {
        res = response.data;
      })
      .then(function () {
        if (res.logedin == true) {
          tis.setState({ passwordHash: res.passwordHash });
          tis.props.Stater({ logedin: true, page: 0, passwordHash: res.passwordHash, userName: tis.state.userName });
          tis.storLogin();
        }
        else {
          alert('userName or password invalid.');
          tis.setState({ userName: '', password: '' });
        }
        tis.setState({ loding: false });
      })
      .catch(function (err) {
        console.log(err);
        tis.setState({ loding: false });
      })
  }

  gotoSignup = () => {
    this.props.Stater({ page: -2 });
  }

  loader = () => {
    if (this.state.loding)
      return (
        <ImageBackground style={{ width: 100, height: 80, position: 'absolute' }} source={require('../storage/images/loader.gif')} />
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../storage/images/logoroid.png')} />
        <Text style={[styles.namelogo,{fontFamily:'GerthDemo'}]}>UniDoc</Text>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('../storage/images/usernameField.png')} />
          <TextInput style={styles.inputs}
            placeholder="User Name"
            underlineColorAndroid='transparent'
            onChangeText={(userName) => this.setState({ userName })} value={this.state.userName} />
        </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require('../storage/images/password.png')} />
          <TextInput style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(password) => this.setState({ password })} value={this.state.password} />
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.loginbtn()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => { alert('متاسفانه این بخش هنوز تکمیل نشده است. برای رفع مشکل با ادمین در میان بگذارید.\ninstagram: @mojtaba_sji'); }}>
          <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.gotoSignup()}>
          <Text>Register</Text>
        </TouchableHighlight>
        {this.loader()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#add8e6',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },
  namelogo: {
    fontSize: 28,
    marginBottom: 20,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});

