import { Button } from 'native-base';
import React from 'react';
import { View, StyleSheet, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Picker } from 'native-base';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import Server from '../Server';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';


const pa = 'data:image/jpeg;base64,';

class Addfile extends React.Component {
    state = {
        sending: false,
        fileuri: '',
        title: '',
        filetypeList: [],
        filetype: '',
        courseList: [],
        course: '',
        term: '',
        description: '',
    }

    componentDidMount() {
        let courseList = '';
        let tis = this;
        axios.get(Server.url + 'user/course?'+ "passwordHash=" + tis.props.State.passwordHash + "&" + "userName=" + tis.props.State.userName,)
            .then(function (response) {
                courseList = response.data;
            })
            .then(function () {
                tis.setState({ courseList });
                //console.log('add file didmount course: ', tis.state.courseList);
            })
            .catch(function (err) {
                console.log(err);
            })


        let filetypeList = '';
        axios.get(Server.url + 'user/filetype?'+ "passwordHash=" + tis.props.State.passwordHash + "&" + "userName=" + tis.props.State.userName,)
            .then(function (response) {
                filetypeList = response.data;
            })
            .then(function () {
                tis.setState({ filetypeList });
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    render() {
        return (
            <View style={Style.continer}>
                <View style={Style.inpout}>
                    <Button onPress={() => { this.pickerfile() }} style={{ height: 30, flex: 1, justifyContent: 'center', margin: 10 }}>
                        <Text >انتخاب :</Text></Button>
                    <Text style={Style.textinp} >{this.state.filename}</Text>
                </View>

                <View style={Style.inpout}>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', margin: 10 }}>عنوان :</Text>
                    <TextInput style={Style.textinp} onChangeText={(val) => { this.setState({ title: val }) }} value={this.state.title}></TextInput>
                </View>

                <View style={Style.inpout}>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', margin: 10 }}>نوع فایل :</Text>
                    <Picker style={[Style.textinp, { borderRadius: 6, width: 200, height: 40, padding: 10, backgroundColor: 'white' }]}
                        selectedValue={this.state.filetype}
                        placeholder={'لطفا انتخاب کنید'}
                        onValueChange={async (val) => {
                            await this.setState({ filetype: val });
                        }} >
                        {this.state.filetypeList.map((val) => { return (<Picker.Item label={val.name} value={val.id}></Picker.Item>) })}
                    </Picker>
                </View>

                <View style={Style.inpout}>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', margin: 10 }}>درس :</Text>
                    <Button onPress={()=>{alert('در صورتی که درس مد نظر خودتون رو پیدا نکردید کافیه فقط یه پیغام تو شبکه‌های اجتماعی به ما بدید. \n insatgram: @mojtaba_sji\n ابتدا از درست انتخاب شدن دانشگاه و رشتتون مطمئن بشید. مرسی :)')}} 
                    style={{width:20, height:25,borderRadius:70, backgroundColor:'pink',justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'700'}}>i</Text></Button>
                    <Picker style={[Style.textinp, { borderRadius: 6, width: 200, height: 40, padding: 10, backgroundColor: 'white' }]}
                        selectedValue={this.state.course}
                        placeholder={'لطفا انتخاب کنید'}
                        onValueChange={async (val) => {
                            await this.setState({ course: val });
                        }} >
                        {this.state.courseList.map((val) => { return (<Picker.Item label={val.name} value={val.id}></Picker.Item>) })}
                    </Picker>
                </View>

                <View style={Style.inpout}>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', margin: 10 }}>ترم :</Text>
                    <TextInput keyboardType={'numeric'} style={Style.textinp} onChangeText={(val) => { this.setState({ term: val }) }} value={this.state.term}></TextInput>
                </View>

                <View style={Style.inpout}>
                    <Text style={{ fontSize: 18, flex: 1, textAlign: 'right', margin: 10 }}>توضیحات :</Text>
                    <TextInput multiline style={[Style.textinp, { height: 200 }]} onChangeText={(val) => { this.setState({ description: val }) }} value={this.state.description}></TextInput>
                </View>
                {this.state.sending && <ActivityIndicator size="small" color="#0000ff"></ActivityIndicator>}
                <View style={Style.inpout} >
                    <Button disabled={this.state.sending} onPress={() => { this.fileupload() }} block success style={{ flex: 1, backgroundColor: this.state.sending?'gray':'lightgreen', }}>
                        <Text>ارسال</Text>
                    </Button>
                </View>

            </View>
        );
    };

    checkinputs = () => {
        if ((this.state.selectedFile != null) && (this.state.title != '') && (this.state.filetype != '') && (this.state.cource != '') && (this.state.term != '')) {
            return true;
        }
        else {
            return false;
        }
    }

    fileupload = async () => {
        if (this.checkinputs()) {
            this.setState({ sending: true });
            let tis = this;
            const base64 = await FileSystem.readAsStringAsync(this.state.selectedFile.uri, { encoding: 'base64' });
            let content = 'data:' + mime.lookup(this.state.selectedFile.name) + ';base64,' + base64;
            let data = new FormData();
            data.append('submit', 'ok');
            data.append('title', this.state.title);
            data.append('File', JSON.stringify({
                name: this.state.selectedFile.name, content: content,
            }));
            data.append('filetype', this.state.filetype);
            data.append('course', this.state.course);
            data.append('term', this.state.term);
            data.append('description', this.state.description);
           /* FileSystem.uploadAsync(Server.url + 'user/profile/myfile/save', data, {
                headers: {
                    Cookie: ";userName=" + tis.props.State.userName + ";" + " passwordHash=" + tis.props.State.passwordHash + ";",
                    'Content-Type': 'multipart/form-data; ',

                },
            })*/
            axios.post(Server.url + 'user/profile/myfile/save?'+"userName=" + tis.props.State.userName + "&passwordHash=" + tis.props.State.passwordHash, data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data; ',

                    },
                    maxContentLength: Infinity,
                })
                .then((res) => {
                    console.log('res : ', res.data);
                    tis.setState({ sending: false });
                    tis.props.HomeStater({fileAdded:true});
                    Alert.alert("اپلود",
                        'ارسال فایل انجام شد',
                        [{
                            text: 'تایید',
                            onPress: () => {
                                tis.props.pageChanger(1);
                            },
                        }
                        ]
                    )
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ sending: false });
                })
        }
        else {
            Alert.alert('خطا', 'لطفا فیلدها را تکمیل کنید', [{ text: 'تایید' }]);
        }
    }

    pickerfile = async () => {
        await DocumentPicker.getDocumentAsync({ type: '*/*', })
            .then((res) => {
                this.setState({ filename: res.name });
                this.setState({ selectedFile: res });
            });
    }

}

const Style = StyleSheet.create({
    continer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        margin: 10,
    },
    inpout: {
        flex: 1,
        flexDirection: 'row-reverse',
        margin: 10,
    },
    textinp: {
        margin: 10,
        borderRadius: 4,
        borderWidth: 1,
        flex: 2,
        padding: 5,
    },
});

export default Addfile;