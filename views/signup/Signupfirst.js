import React from 'react';
import { StyleSheet, View, Image,TextInput, TouchableHighlight } from 'react-native';
import { Text } from 'native-base';
import axios from 'axios';
import Server from '../../Server';

class signupfirst extends React.Component {

    checkusername =()=>{
        let tis = this;
        this.props.Stater({loading:true});
        axios.post(Server.url+'user/check',{
            userName:tis.props.State.userName,
        })
        .then(function(response){
            if(response.data.isUniqe != true)
                alert('please choise another userName');
            tis.props.Stater({loading:false});
        }).catch(function(err){
            tis.props.Stater({loading:false});
        })
    }

    render() {
        return (
            <View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../storage/images/fullname.png')} />
                    <TextInput style={styles.inputs}
                        placeholder="full name"
                        underlineColorAndroid='transparent'
                        onChangeText={(fullName) => this.props.Stater({ fullName })} value={this.props.State.fullName} />
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../storage/images/username.png')} />
                    <TextInput style={styles.inputs}
                        placeholder="User name"
                        underlineColorAndroid='transparent'
                        onChangeText={(userName) => this.props.Stater({ userName })}
                        onEndEditing={()=>{this.checkusername()}}  value={this.props.State.userName}/>
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../storage/images/password.png')} />
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => this.props.Stater({ password })} value={this.props.State.password}/>
                </View>
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

export default signupfirst;