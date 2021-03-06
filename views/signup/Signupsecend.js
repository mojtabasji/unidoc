import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ImageBackground, TextInput, TouchableHighlight } from 'react-native';
import { Text, Picker, Button, Icon } from 'native-base';
import axios from 'axios';
import Server from '../../Server';

class signupsecend extends React.Component {

    state = {
        Universitis: [],
        uniselected: 0,
        fields: [],
        fieldselected: '',
        loading: false,
    }


    componentDidMount() {
        alert('اطلاعات شما تنها برای عملکرد نرم‌افزار مورد استفاده قرار میگیرد و به صورت محرمانه حفظ خواهد شد.');
        this.props.Stater({ loading: true });
        let tis = this;
        //console.log('get universities: ' + Server.url + 'universitis')
        axios.get(Server.url + 'universitis')
            .then(function (res) {
                tis.setState({ Universitis: res.data.universitis });
                //console.log( tis.state.Universitis);
            })
            .catch(function (err) {
                console.log(err.message);
            });

        this.props.Stater({ loading: false });

    }

    setfields = () => {
        this.props.Stater({ loading: true });
        let tis = this;
        axios.post(Server.url + 'fields', {
            university_id: tis.state.uniselected,
        })
            .then(function (res) {
                tis.setState({ fields: res.data.fields });
            })
            .catch(function (err) {
                console.log(err);
            });

        this.props.Stater({ loading: false });
    }


    render() {
        return (
            <View>
                <View style={[styles.inputContainer,{height:50}]}>
                    <Image style={styles.inputIcon} source={require('../../storage/images/university.png')} />
                    <Picker style={[{backgroundColor:'red', height:100},styles.inputs]}
                        placeholder="university"
                        selectedValue={this.state.uniselected}
                        onValueChange={async (val) => {
                            await this.setState({ uniselected: val });
                            this.props.Stater({ university: val });
                            this.setfields();
                        }} >
                        {this.state.Universitis.map((val) => { return (<Picker.Item label={val.name} value={val.id} style={{ height: 30 }}></Picker.Item>) })}
                    </Picker>
                </View>
                        
                <View style={[styles.inputContainer,{height:50}]}>
                    <Image style={styles.inputIcon} source={require('../../storage/images/filed.png')} />
                    <Picker style={[styles.inputs]}
                        mode={'dropdown'}
                        placeholder="field"
                        selectedValue={this.state.fieldselected}
                        onValueChange={(val) => {
                            this.setState({ fieldselected: val });
                            this.props.Stater({ field: val });
                        }} >
                        {this.state.fields.map((val) => { return (<Picker.Item label={val.name} value={val.id}></Picker.Item>) })}
                    </Picker>
                </View>

                <View style={{ flexDirection: "row", }}>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={require('../../storage/images/phone.png')} />
                        <TextInput style={styles.inputs}
                            placeholder="Phone"
                            textContentType='telephoneNumber'
                            underlineColorAndroid='transparent'
                            onChangeText={(phone) => this.props.Stater({ phone })} />

                        <TouchableOpacity onPress={() => { alert('صحت شماره تلفن شما در این نسخه چک نمی شود ولی در نسخه‌های بعدی برای احراز هویت استفاده خواهد شد.\n برای اینکه در آینده دسترسی خودتون رو از دست ندید توصیه میکنیم که شماره تلفن صحیح وارد کنید') }}
                            style={{ borderRadius: 70, position: 'absolute', right: 0, }}><Icon name="help-circle-outline"></Icon></TouchableOpacity>
                    </View>
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
        padding: 10,
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
export default signupsecend;