import React from 'react';
import { StyleSheet, View, Image, TextInput, ActivityIndicator, AsyncStorage } from 'react-native';
import { Button, Text, Left, Right, Picker, Icon } from 'native-base';
import Server from '../Server';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import FastImage from 'react-native-fast-image';

class Editprofile extends React.Component {

    state = {
        userName: this.props.HomeState.data.userName,
        fullName: this.props.HomeState.data.fullName,
        university: this.props.HomeState.data.university_id,
        field: this.props.HomeState.data.field_id,
        phone: this.props.HomeState.data.phone,
        password: '',
        passwordhit: '',
        Universitis: [],
        fields: [],
        picuri: '',
    }


    componentDidMount() {
        let tis = this;
        axios.get(Server.url + 'universitis')
            .then(function (res) {
                tis.setState({ Universitis: res.data.universitis });
            })
            .catch(function (err) {
                console.log(err.message);
            });

        this.setfields();
    }

    setfields = () => {
        let tis = this;
        axios.post(Server.url + 'fields', {
            university_id: tis.state.university,
        })
            .then(function (res) {
                tis.setState({ fields: res.data.fields });
            })
            .catch(function (err) {
                console.log(err);
            });

    }

    checkusername = () => {
        if (this.state.userName != this.props.HomeState.data.userName) {
            let tis = this;
            axios.post(Server.url + 'user/check', {
                userName: tis.state.userName,
            })
                .then(function (response) {
                    if (response.data.isUniqe != true) {
                        alert('already exist.\n please choise another userName');
                        tis.setState({ userName: '' });
                    }
                }).catch(function (err) {
                    console.log(err);
                })
        }
    }


    render() {
        return (
            <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}>
                {this.state.sending && <ActivityIndicator size={'large'} color="red" style={{ position: 'absolute' }}></ActivityIndicator>}
                <View style={{ flex: 1, alignItems: 'center', margin: 10 }} >
                    {this.imageload()}
                    <View>
                        <Button onPress={() => this.picselect()} transparent style={{}}>
                            <Text>Change picture</Text>
                        </Button>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={Styles.lable}> نام کاربری :</Text>
                        <TextInput
                            onChangeText={(val) => { this.setState({ userName: val }) }}
                            onEndEditing={() => { this.checkusername() }}
                            style={Styles.t_inp} value={this.state.userName} placeholder={'user name'}></TextInput>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={Styles.lable}> نام کامل :</Text>
                        <TextInput
                            onChangeText={(val) => { this.setState({ fullName: val }) }}
                            style={Styles.t_inp} value={this.state.fullName} placeholder={'full name'}></TextInput>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center', }}>
                        <Text style={Styles.lable}> دانشگاه :</Text>
                        <View style={Styles.PickerView}>
                            <Picker style={{ flex: 1, height: 20 }}
                                placeholder="university"
                                mode={'dropdown'}
                                selectedValue={this.state.university}
                                onValueChange={async (val) => {
                                    await this.setState({ university: val });
                                    this.setfields();
                                }} >
                                {this.state.Universitis.map((val) => { return (<Picker.Item label={val.name} value={val.id} style={{ textAlign: 'right', fontSize: 10 }}></Picker.Item>) })}
                            </Picker>
                            <Left>
                                <Icon name={'chevron-down-circle-outline'} style={{ fontSize: 20, margin: 5 }}></Icon>
                            </Left>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={Styles.lable}> رشته :</Text>
                        <View style={Styles.PickerView}>
                            <Picker style={{ flex: 1, height: 20 }}
                                placeholder="field"
                                mode={'dropdown'}
                                selectedValue={this.state.field}
                                onValueChange={async (val) => {
                                    await this.setState({ field: val });
                                    this.setfields();
                                }} >
                                {this.state.fields.map((val) => { return (<Picker.Item label={val.name} value={val.id} style={{ textAlign: 'right', fontSize: 10 }}></Picker.Item>) })}
                            </Picker>
                            <Left>
                                <Icon name={'chevron-down-circle-outline'} style={{ fontSize: 20, margin: 5 }}></Icon>
                            </Left>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={Styles.lable}>  تلفن :</Text>
                        <TextInput
                            onChangeText={(val) => { this.setState({ phone: val }) }}
                            style={Styles.t_inp} value={this.state.phone} placeholder={'full name'}></TextInput>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={Styles.lable}> رمز عبور :</Text>
                        <TextInput
                            onChangeText={(val) => { this.setState({ password: val }) }}
                            style={Styles.t_inp} secureTextEntry placeholder={'password'}></TextInput>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <Text style={Styles.lable}> تکرار رمز عبور :</Text>
                        <TextInput
                            onChangeText={(val) => { this.setState({ passwordhit: val }) }}
                            style={Styles.t_inp} secureTextEntry placeholder={'password hit'}></TextInput>
                    </View>

                    <Button onPress={() => { this.updatebtn() }} block info style={[Styles.t_inp, { height: 40, marginTop: 20 }]}>
                        <Text>Update</Text>
                    </Button>

                </View>
            </View>
        );
    }

    storLogin = async () => {
        try {
            await AsyncStorage.setItem(
                'status',
                'logedIn'
            );
            await AsyncStorage.setItem(
                'passwordHash',
                this.state.passwordHash
            );
            await AsyncStorage.setItem(
                'userName',
                this.state.userName
            );
        } catch (error) {
            // Error saving data
        }
    };

    updatebtn = () => {
        this.setState({ sending: true });
        if (this.state.userName != '' &&
        this.state.fullName != '' &&
        this.state.university != '' &&
        this.state.field != '' &&
        this.state.phone != ''
        ) {
            let data = new FormData();
            data.append('userName', this.state.userName);
            data.append('fullName', this.state.fullName);
            data.append('university', this.state.university);
            data.append('field', this.state.field);
            data.append('phone', this.state.phone);
            if (this.state.password != '') {
                if (this.state.password == this.state.passwordhit) {
                    data.append('password', this.state.password);
                }
                else {
                    alert('تکرار پسورد صجیج نیست');
                    return;
                }
            }
            let tis = this;
            axios.post(Server.url + 'user/profile/update', data,
                {
                    headers: {
                        Cookie: ";userName=" + tis.props.State.userName + ";" + " passwordHash=" + tis.props.State.passwordHash + ";",
                        'Content-Type': 'multipart/form-data; ',
                    }
                })
                .then((res) => {
                    
                    if (res.data.logedin == true) {
                        tis.setState({ passwordHash: res.data.passwordHash });
                        tis.props.Stater({ logedin: true, passwordHash: res.data.passwordHash, userName: tis.state.userName });
                        
                        tis.storLogin();
                        tis.setState({ sending: false });
                        tis.props.pageChanger(1);
                    }
                }).catch((val) => { console.log(val) });

            this.setState({ sending: false });

        }
    }


    picselect = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            let Fname = result.uri; Fname = Fname.split('/'); Fname = Fname[Fname.length - 1];
            this.setState({ sending: true });
            let tis = this;
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            let content = 'data:' + mime.lookup(Fname) + ';base64,' + base64;
            let data = new FormData();
            data.append('submit', 'ok');
            data.append('File', JSON.stringify({
                name: Fname, content: content,
            }));
            axios.post(Server.url + 'user/profile/image/update', data,
                {
                    headers: {
                        Cookie: "userName=" + tis.props.State.userName + ";" + " passwordHash=" + tis.props.State.passwordHash + ";",
                        'Content-Type': 'multipart/form-data; ',
                    }
                })
                .then((res) => {
                    tis.props.HomeStater({ 'data.pic': res.data.url });
                    tis.render();
                    tis.setState({ sending: false });
                });
        }
    };

    imageload = () => {
        if (this.props.HomeState.data.pic == null) {
            return (
                <Image style={Styles.profile_pic} source={require('../storage/images/user-profile.png')}>
                </Image>
            )
        }
        else {
            return (
                <Image style={Styles.profile_pic} source={{ uri: Server.geturl + this.props.HomeState.data.pic }}>
                </Image>
            )
        }
    }
}

const Styles = StyleSheet.create({
    profile_pic: {
        width: 150,
        height: 150,
        borderRadius: 70,
    },
    lable: {
        flex: 1,
        textAlign: 'right',
        margin: 5,
    },
    t_inp: {
        height: 40,
        margin: 5,
        borderRadius: 10,
        borderWidth: 1,
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'right',
        flex: 2,
    },
    PickerView: {
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderBottomWidth: 1,
        width: 230,
        height: 35,
        margin: 5,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    }
});

export default Editprofile;