import React from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Card, Left, Right, Picker, Button } from 'native-base';
import Server from '../Server';
import axios from 'axios';

class Editefile extends React.Component {

    state = {
        title: '',
        filetype: '',
        filetypeList: [],
        courseList: [],
        term: '',
        course: '',
        description: '',
    }


    componentDidMount() {
        let courselist = '';
        let tis = this;
        axios.get(Server.url + 'user/course?'+ "userName=" + tis.props.State.userName + "& passwordHash=" + tis.props.State.passwordHash,)
            .then(function (response) {
                courselist = response.data;
            })
            .then(function () {
                tis.setState({ courseList: courselist });
            })
            .catch(function (err) {
                console.log(err);
            })


        let filetypeList = '';
        axios.get(Server.url + 'user/filetype?'+ "userName=" + tis.props.State.userName + "& passwordHash=" + tis.props.State.passwordHash,)
            .then(function (response) {
                filetypeList = response.data;
            })
            .then(function () {
                tis.setState({ filetypeList });
            })
            .catch(function (err) {
                console.log(err);
            })


        let tmp = '';
        axios.get(Server.url + 'user/profile/myfiles/show/' + tis.props.fileId)
            .then(function (response) {
                tmp = response.data;
            })
            .then(function () {
                tis.setState({ title: tmp.title, filetype: tmp.filetype_id, term: tmp.term, course: tmp.course_id, description: tmp.description });
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    render() {
        return (
            <View style={Styles.continer}>
                <Card style={{ padding: 20, borderRadius: 10, backgroundColor: 'ghostwhite', flex: 1, justifyContent: 'flex-end' }}>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginBottom: 10 }}>
                        <Right>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>نام فایل :</Text>
                        </Right>
                        <Left>
                            <TextInput value={this.state.title} onChangeText={(val) => { this.setState({ title: val }) }} style={{ borderRadius: 6, width: 200, height: 40, textAlign: 'right', padding: 10, backgroundColor: 'white' }} placeholder="full name"></TextInput>
                        </Left>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginBottom: 10 }}>
                        <Right>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>نوع فایل :</Text>
                        </Right>
                        <Left>
                            <Picker style={{ borderRadius: 6, width: 200, height: 40, textAlign: 'right', padding: 10, backgroundColor: 'white' }}
                                selectedValue={this.state.filetype}
                                onValueChange={async (val) => {
                                    await this.setState({ filetype: val });
                                }} >
                                {this.state.filetypeList.map((val) => { return (<Picker.Item label={val.name} value={val.id}></Picker.Item>) })}
                            </Picker>
                        </Left>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginBottom: 10 }}>
                        <Right>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>ترم :</Text>
                        </Right>
                        <Left>
                            <TextInput value={this.state.term.toString()} onChangeText={(val) => { this.setState({ term: val }) }} style={{ borderRadius: 6, width: 200, height: 40, textAlign: 'right', padding: 10, backgroundColor: 'white' }} placeholder="full name"></TextInput>
                        </Left>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginBottom: 10 }}>
                        <Right>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>درس :</Text>
                        </Right>
                        <Left>
                            <Picker style={{ borderRadius: 6, width: 200, height: 40, textAlign: 'right', padding: 10, backgroundColor: 'white' }}
                                selectedValue={this.state.course}
                                onValueChange={async (val) => {
                                    await this.setState({ course: val });
                                }} >
                                {this.state.courseList.map((val) => { return (<Picker.Item label={val.name} value={val.id}></Picker.Item>) })}
                            </Picker>
                        </Left>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', marginBottom: 10 }}>
                        <Right style={{ alignSelf: 'stretch' }}>
                            <Text style={{ fontSize: 16, fontWeight: '500' }}>توضیحات :</Text>
                        </Right>
                        <Left>
                            <TextInput value={this.state.description} onChangeText={(val) => { this.setState({ description: val }) }} multiline style={{ borderRadius: 6, width: 200, height: 200, textAlign: 'right', padding: 10, backgroundColor: 'white' }} placeholder="full name"></TextInput>
                        </Left>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 10 }}>
                        <Button rounded onPress={() => { this.updateBtn(); }} style={{ padding: 12, marginLeft: 30, backgroundColor: 'lightskyblue' }}>
                            <Text style={{ fontSize: 18 }}>update</Text>
                        </Button>
                        <Button onPress={() => { this.deleteBtn(); }} rounded style={{ padding: 12, marginRight: 30, backgroundColor: 'coral' }}>
                            <Text style={{ fontSize: 18 }}>Delete</Text>
                        </Button>
                    </View>
                </Card>
            </View>
        )
    }

    deleteBtn = () => {
        Alert.alert(
            "حذف فایل",
            "آیا مطمئن هستید می‌ خواهید این فایل را حذف کنید؟؟",
            [
                {
                    text: 'بله',
                    onPress: () => {
                        let tis = this;
                        axios.post(Server.url + 'user/profile/myfile/delete/' + tis.props.fileId)
                            .then(function (resp) {
                                alert('فایل حذف شد');
                                tis.props.pageChanger(1);
                            })
                    },
                },
                {
                    text: 'خیر',
                    onPress: () => { },
                }
            ]
        )
    }

    updateBtn = () => {
        let tis = this;
        axios.post(Server.url + 'user/profile/myfile/update/' + tis.props.fileId, {
            title: tis.state.title,
            filetype: tis.state.filetype,
            term: tis.state.term,
            course: tis.state.course,
            description: tis.state.description,
        })
            .then((resp) => {
                alert('updated successfully');
                tis.props.pageChanger(1);
            })
            .catch(function (err) {
                alert(err);
            })
    }
}

const Styles = StyleSheet.create({
    continer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 13,
        marginRight: 13,
        marginTop: 20,
    },
});

export default Editefile;