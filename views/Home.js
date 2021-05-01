import React from 'react';
import { StyleSheet, View, Image, Platform, TouchableOpacity, AsyncStorage, RefreshControl, } from 'react-native';
import { Content, Container, Card, CardItem, Body, Button, Text, Right, Left, Icon, Fab } from 'native-base';
import axios from 'axios';
import Server from '../Server';
import Myfile from './Myfile';
import Editefile from './Editefile';
import Addfile from './Addfile';
import Editprofile from './Editprofile';

class home extends React.Component {

    state = {
        picUrl: '',
        data: '',
        files: [],
        selectedFileId: '',
        fabactive: false,
    }

    componentDidMount() {
        let picUrll = '';
        let tis = this;
        /*axios.get(Server.url + 'user/profile/pic' + '?userName=' + tis.props.State.userName)
            .then(function (response) {
                picUrll = response.data.picUrl;
            })
            .then(function () {
                tis.setState({ picUrl: picUrll });
            })
            .catch(function (err) {
                tis.setState({ picUrl: 'https://www.varastegan.ac.ir/teacher/wp-content/uploads/2018/11/user-profile.png' });
                console.log(err);
            })*/

        let data = '';
        axios.get(Server.url + 'user/profile/data', {
            headers: {
                Cookie:  ";passwordHash=" + tis.props.State.passwordHash + ";" +"userName=" + tis.props.State.userName + ";",
            }
        })
            .then(function (response) {
                //console.log('res : ', response.data);
                data = response.data.data;
            })
            .then(function () {
                tis.setState({ data: data });
            })
            .catch(function (err) {
                alert(tis.props.State.userName);
                console.log(err);
            })


        let myfiles = '';
        axios.get(Server.url + 'user/profile/myfiles', {
            headers: {
                Cookie: ";userName=" + tis.props.State.userName + ";" + " passwordHash=" + tis.props.State.passwordHash + ";",
            }
        })
            .then(function (response) {
                myfiles = response.data;
            })
            .then(function () {
                tis.setState({ files: myfiles });
                //console.log(myfiles);
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    render() {
        return (
            <View>
                {this.pageControll()}
            </View>
        );
    }


    imageload = () => {
        if (this.state.data.pic == null) {
            return (
                <Image style={styles.profile_pic} source={require('../storage/images/user-profile.png')}>
                </Image>
            )
        }
        else {
            return (
                <Image style={styles.profile_pic} source={{ uri: Server.geturl + this.state.data.pic }}>
                </Image>
            )
        }
    }

    pageControll = () => {
        switch (this.props.pager) {
            case 1:
                {
                    return (
                        <View style={styles.continer}>
                            <View style={{ flex: 1, flexDirection: 'row', height: 200, }}>
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.profile_info}>{this.state.data.fullName}</Text>
                                    <Text style={[styles.profile_info, { fontWeight: '300', fontSize: 18 }]}>{this.state.data.university}</Text>
                                    <Text style={[styles.profile_info, { fontWeight: '300', fontSize: 18 }]}>{this.state.data.field}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    {this.imageload()}
                                </View>
                            </View>
                            <View style={{}}>
                                {this.showCards()}
                            </View>
                        </View>);
                }
            case 11:
                {
                    return (
                        <Myfile pageChanger={this.props.pageChanger} pager={this.props.pager} fileId={this.state.selectedFileId}></Myfile>
                    )
                }
            case 12:
                {
                    return (
                        <Editefile pageChanger={this.props.pageChanger} State={this.props.State} pager={this.props.pager} fileId={this.state.selectedFileId}></Editefile>
                    )
                }
            case 13:
                {
                    return (
                        <Addfile pageChanger={this.props.pageChanger} State={this.props.State} pager={this.props.pager}></Addfile>
                    )
                }

            case 14:
                {
                    return (
                        <Editprofile pageChanger={this.props.pageChanger} Stater={this.props.Stater} State={this.props.State} HomeState={this.state} HomeStater={this.HomeStater} pager={this.props.pager}></Editprofile>
                    )
                }
            default:
                { return ('ok'); }

        }

    }

    HomeStater = (val) => {
        this.setState(val);
    }

    refreshFunction = () => {
        this.setState({ refreshing: false });
        alert('refreshing');
        this.setState({ loading: true });
        let picUrll = '';
        let tis = this;
        axios.get(Server.url + 'user/profile/pic' + '?userName=' + tis.props.State.userName)
            .then(function (response) {
                picUrll = response.data.picUrl;
            })
            .then(function () {
                tis.setState({ picUrl: picUrll });
            })
            .catch(function (err) {
                tis.setState({ picUrl: 'https://www.varastegan.ac.ir/teacher/wp-content/uploads/2018/11/user-profile.png' });
                console.log(err);
            })

        let data = '';
        axios.get(Server.url + 'user/profile/data', {
            headers: {
                Cookie: "userName=" + tis.props.State.userName + ";" + " passwordHash=" + tis.props.State.passwordHash + ";",
            }
        })
            .then(function (response) {
                data = response.data.data;
            })
            .then(function () {
                tis.setState({ data: data });
            })
            .catch(function (err) {
                console.log(err);
            })


        let myfiles = '';
        axios.get(Server.url + 'user/profile/myfiles', {
            headers: {
                Cookie: "userName=" + tis.props.State.userName + ";" + " passwordHash=" + tis.props.State.passwordHash + ";",
            }
        })
            .then(function (response) {
                myfiles = response.data;
            })
            .then(function () {
                tis.setState({ files: myfiles });
                tis.setState({ loading: false });
                //console.log(myfiles);
            })
            .catch(function (err) {
                console.log(err);
                tis.setState({ loading: false });
            });

    }

    showCards = () => {
        return this.state.files.map((item) => {
            return (
                <TouchableOpacity onPress={() => { this.props.pageChanger(11); this.setState({ selectedFileId: item.id }); }}>
                    <Card
                        style={{ direction: 'rtl' }}>
                        <CardItem style={{ flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                            <Left style={{ justifyContent: 'flex-end' }}>
                                <Text style={{ direction: 'ltr' }}>
                                    {item.type}
                                </Text>
                            </Left>
                        </CardItem>
                        <CardItem style={{ width: 330 }}>
                            <Text>
                                {item.university}
                            </Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            )
        })
    }


}

const styles = StyleSheet.create({
    continer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
    },
    profile_pic: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profile_info: {
        margin: 10,
        fontSize: 20,
        ...Platform.select({
            android: {
                fontFamily: 'sans-serif-thin',
            },
            ios: {
                fontFamily: 'Avenir-Heavy',
            },
        }),

    },
    card: {
        borderWidth: 10,
    },
});

export default home;