import React from 'react';
import { StyleSheet, View, Image, Platform, ActivityIndicator } from 'react-native';
import { icon, Card, CardItem, Button, Text, Left, Right } from 'native-base';
import Server from '../Server';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';



class myfile extends React.Component {

    state = {
        loading: false,
        file: '',
    }

    componentDidMount() {
        let tmp = '';
        let tis = this;
        axios.get(Server.url + 'user/profile/myfiles/show/' + tis.props.fileId)
            .then(function (response) {
                tmp = response.data;
            })
            .then(function () {
                tis.setState({ file: tmp });
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    render() {
        return (
            <View style={styles.continer}>
                <Card style={{ padding: 20, borderRadius: 10, backgroundColor: 'ghostwhite' }}>
                    <View style={{ flex: 1, flexDirection: 'row-reverse', }}>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Image style={styles.filePic} source={require('../storage/images/pdf.png')}></Image>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'right' }}>{this.state.file.title}</Text>
                            <Text style={{ fontSize: 20, textAlign: 'right', margin: 10, color: 'gray' }}>{this.state.file.userName}</Text>
                            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                                <Right style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                    <Button style={{ margin: 10 }} onPress={() => { this.downloadFunction() }} rounded small>
                                        <Text>دریافت</Text>
                                    </Button>
                                    {this.state.loading &&
                                        <ActivityIndicator color={'green'}></ActivityIndicator>}
                                </Right>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 24, textAlign: 'right' }}>{this.state.file.courseName}</Text>
                        <View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 10, borderWidth: 1, padding: 10, borderRadius: 8, borderColor: 'gray' }}>
                            <Right style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 22, fontWeight: '300' }}>{this.state.file.term}</Text>
                                    <Text style={{ fontSize: 20, color: 'gray' }}>ترم</Text>
                                </View>
                            </Right>
                            <Left style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 22, fontWeight: '300' }}>{this.state.file.filetypeName}</Text>
                                    <Text style={{ fontSize: 20, color: 'gray' }}>نوع قابل</Text>
                                </View>
                            </Left>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                            <Image style={{ width: 30, height: 30, margin: 20 }} source={require('../storage/images/university.png')}></Image>
                            <Text style={{ fontSize: 24, marginTop: 20 }}>{this.state.file.universityName}</Text>
                        </View>
                        <View style={{ backgroundColor: 'black', width: 300, height: 1 }}></View>
                        <Text style={{ margin: 10 }}>توضیحات :</Text>
                        <Text style={{ fontSize: 20, textAlign: 'right' }}>{this.state.file.description}</Text>

                    </View>
                </Card>
            </View>
        );
    }

    downloadFunction = async () => {
        this.setState({loading: true});
        if (Platform.OS === 'android') {
            IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
        }
        let down = Server.geturl + this.state.file.url;
        down = down.replace(/ /g, '%20');
        console.log(down);
        let tis = this;
        let docname = down.split('/');
        docname = docname[docname.length - 1];
        let path = FileSystem.cacheDirectory + docname;
        //alert(path);
        await FileSystem.downloadAsync(
            down,
            path,
        )
            .then(({ uri }) => {
                if (Platform.OS === 'ios') {

                    Sharing.shareAsync(uri);
                }
                else {
                    FileSystem.getContentUriAsync(uri).then(cUri => {
                        console.log(cUri);
                        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                            data: cUri,
                            flags: 1,
                        });
                    });
                }
                tis.setState({loading:false});
            })
            .catch(error => {
                console.error(error);
                tis.setState({loading: false});
            });


    }
}


const styles = StyleSheet.create({
    continer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 13,
        marginRight: 13,
        marginTop: 20,
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    filePic: {
        height: 130,
        width: 130,
    },
});

export default myfile;