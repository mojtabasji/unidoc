import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';
import Server from '../Server.js';
import axios from 'axios';
import Signupfirst from './signup/Signupfirst';
import Signupsecend from './signup/Signupsecend';
import { Text, Button, Fab } from 'native-base';
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
        fullName: '',
        userName: '',
        password: '',
        university: '',
        field: '',
        phone: '',

        page: 'first',
        loding: false,
        passwordHash: '',
    }

    _loadFontsAsync() {
        Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    
    componentDidMount(){
        this._loadFontsAsync();
      }

    Stater = (value) => {
        this.setState(value);
    }

    gotoLogin = () => {
        this.props.Stater({ page: -1 });
    }

    pageSwitch = () => {
        if (this.state.page == 'first') {
            return <Signupfirst Stater={this.Stater} State={this.state} ></Signupfirst>
        }
        else {
            return <Signupsecend Stater={this.Stater} State={this.state}></Signupsecend>
        }
    }

    goNext = () => {
        if (this.state.fullName != '' && this.state.userName != '' && this.state.password != '') { this.setState({ page: 'secend' }) }
        else { alert('pleas fill fileds first.') }
    }

    buttonSwich = () => {
        if (this.state.page == 'first') {
            return (<TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => { this.goNext() }}>
                <Text style={styles.loginText}>Next</Text>
            </TouchableHighlight>);
        }
        else {
            return (<View>
                <View>
                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => { this.setState({ page: 'first' }) }}>
                        <Text style={styles.loginText}>Back</Text>
                    </TouchableHighlight>
                </View>
                <View>
                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => { this.signUp() }}>
                        <Text style={styles.loginText}>sign up</Text>
                    </TouchableHighlight>
                </View>
            </View>);
        }
    }

    storLogin = () => {
        database.setData({ status: 'logedIn', passwordhash: this.state.passwordHash, username: this.state.userName }).then(
            (resp) => { console.log(resp); }).catch(
            (err) => { console.log(err); }
        );
    }


    signUp = () => {
        if (this.state.university != '' && this.state.field != '' && this.state.phone != '') {
            this.setState({ loading: true });
            let res = '';
            let tis = this;
            axios.post(Server.url + 'user/signup', {
                userName: tis.state.userName,
                password: tis.state.password,
                fullName: tis.state.fullName,
                university: tis.state.university,
                field: tis.state.field,
                phone: tis.state.phone,
            }).then(function (response) {
                res = response.data;

            }).then(function () {
                console.log(res);
                if (res.logedin == true) {
                    tis.setState({ passwordHash: res.passwordHash });
                    tis.props.Stater({ logedin: true, page: 0, passwordHash: res.passwordHash, userName: tis.state.userName });
                    tis.storLogin();
                }
            }).catch(function (err) {
                alert(err.message);
            })

            this.setState({ loading: false });
        }
        else {
            alert('please fill fields first.');
        }
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
                <Text style={[styles.namelogo,{fontFamily:'GerthDemo'}]}>Unidoc</Text>
                {this.pageSwitch()}
                {this.buttonSwich()}
                <TouchableHighlight style={styles.buttonContainer} onPress={() => this.gotoLogin()}>
                    <Text>Sign in</Text>
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

