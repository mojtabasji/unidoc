import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import {
    Container, Header, Text, Body, Title, Left,
    Right, Button, Icon, Content, Fab, Card, Item, Input, Footer, StyleProvider,
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import Home from './Home.js';
import Document from './Document.js';
import Search from './Search.js';
import Myfile from './Myfile.js';
import Ads from './Ads';
import * as database from '../database';
import * as Font from 'expo-font';

// #############  <Text style={{ color: Platform.OS === 'ios' ? 'white' : 'blue', fontWeight: 'bold' }} >i</Text>

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

const moon = {
    searchClr: '#a5ecfc',
    fabClr: '#FF449F',
    fabBtnClr: '#DDB149',
    HederClr: '#254B62',
    FooterClr: '#1D3E53',
    bgClr: '#77ABB7',
    cardClr: '#476D7C',
};

const sunny = {
    searchClr: 'white',
    fabClr: '#1b64a6',
    fabBtnClr: '#8fb9de',
    HederClr: 'white',
    FooterClr: 'white',
    bgClr: 'white',
    cardClr: 'white',
};

const snow = {
    searchClr: 'white',
    fabClr: '#0890f7',
    fabBtnClr: '#3fa56e',
    HederClr: '#A4EBF3',
    FooterClr: '#7e9fb0',
    bgClr: '#e3f7f7',
    cardClr: '#CCF2F4',
};

let themcolor = {};


class primary extends React.Component {
    state = {
        selectedPage: 3,
        fontsLoaded: false,
        theme: 'sunny',
    }


    changeTheme = async () => {
         switch (this.state.theme) {
            case 'moon':
                this.setState({ theme: 'sunny' });
                themcolor = sunny;
                break;
            case 'sunny':
                this.setState({ theme: 'snow' });
                themcolor = snow;
                break;
            case 'snow':
                this.setState({ theme: 'moon' });
                themcolor = moon;
                break;
            default:
                this.setState({ theme: 'sunny' });
                themcolor = sunny;
                break;
        };
        let tis=this;
        await this.forceUpdate();
        await database.setData({status: 'logedIn', passwordhash: tis.props.State.passwordHash, username: tis.props.State.userName, theme:tis.state.theme }).then(
            (resp) => { console.log(resp); }).catch(
                (err) => { console.log(err); }
            );
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        let getState = this.props.restoreState('Primary');
        if (getState != 'notFound') {
            this.setState(getState);
        }
        database.getData().then((data) => {
            console.log("theme from db:", data);
            try {
                switch (data.theme) {
                    case 'moon':
                        themcolor = moon;
                        break;
                    case 'sunny':
                        themcolor = sunny;
                        break;
                    case 'snow':
                        themcolor = snow;
                        break;
                };
            } catch { };
            this.setState({ theme: data.theme });
        }
        );
    }


    /*     
    <Image style={style.back_arrow} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/arrow_left2-128.png' }} /> */

    render() {
        return (
            <Container style={{ backgroundColor: themcolor.bgClr }}>
                <Header style={{ backgroundColor: themcolor.HederClr }}>
                    <View style={{ width: 50, marginBottom: 5, marginLeft: 5, flexDirection: 'row', }}>
                        <TouchableOpacity onPress={() => { this.goback() }} style={{ justifyContent: 'center' }} transparent>
                            <Icon name={"chevron-back-outline"} style={{ fontSize: 30, marginTop: 7 }}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.changeTheme}>
                            {this.state.fontsLoaded && <Title style={[style.namelogo, { fontFamily: 'GerthDemo', height: 30 }]}>UniDoc <Icon name={this.state.theme} style={{ fontSize: 15 }}></Icon></Title>}
                        </TouchableOpacity>
                    </Body>
                    <View style={{ width: 50 }}>
                        {false && <TouchableOpacity onPress={() => { this.connectToUs() }} style={{ width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 15 }}>
                            <Icon name="help-circle-outline"></Icon>
                        </TouchableOpacity>}
                    </View>
                </Header>
                {this.showpage()}
                {this.AdsPage()}
                {this.fabBtn()}
                <Footer style={{ backgroundColor: themcolor.FooterClr }}>
                    <View style={style.footer}>
                        {this.pagesSelect()}
                    </View>
                </Footer>
            </Container>
        );
    }

    connectToUs = () => {
        Alert.alert(
            "ارتباط با ما",
            "مشتاقانه منتظر نظرات، پیشنهادات، انتقادات و در میان گذاشتن مشکلات برای بهبود عملکرد تیم ما از سمت شما هستم.\ninstagram: @mojtaba_sji",
            [
                {
                    text: "بعدا",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "حتما", onPress: () => { Linking.openURL('https://www.instagram.com/mojtaba_sji/'); } }
            ],
            { cancelable: false }
        );
    }

    goback = () => {
        let tmp = this.state.selectedPage;
        if (tmp > 10) { tmp /= 10; tmp = parseInt(tmp); }
        this.setState({ selectedPage: tmp });
    }

    AdsPage = () => {
        if (this.state.selectedPage == 4) {
            return (
                <Ads pageChanger={this.pageChanger}></Ads>
            );
        }
    }

    showpage = () => {
        let selectedpageroot = this.state.selectedPage;
        if (selectedpageroot > 10) { selectedpageroot /= 10; selectedpageroot = parseInt(selectedpageroot); }

        switch (selectedpageroot) {
            case 1:
                return (
                    <Content>
                        <Home Stater={this.props.Stater} pager={this.state.selectedPage} State={this.props.State}
                            pageChanger={this.pageChanger} themcolor={themcolor}></Home>
                    </Content>);
            case 2:
                return (
                    <Content>
                        <Document storeState={this.props.storeState} restoreState={this.props.restoreState}
                            pageChanger={this.pageChanger} adsControll={this.props.adsControll}
                            themcolor={themcolor} pager={this.state.selectedPage}></Document>
                    </Content>
                );
            case 3:
                return (
                    <Content>
                        <Search storeState={this.props.storeState} restoreState={this.props.restoreState}
                            adsControll={this.props.adsControll} pageChanger={this.pageChanger}
                            themcolor={themcolor} pager={this.state.selectedPage}></Search>
                    </Content>
                );

            case 4:
                {
                    return;
                }
            default:
                return;
        }
    }

    fabBtn = () => {
        if (this.state.selectedPage == 1) {
            //alert('in');
            return (
                <Fab
                    active={this.state.fabactive}
                    direction="up"
                    containerStyle={{ marginBottom: 50 }}
                    style={{ backgroundColor: themcolor.fabClr }}
                    position="bottomLeft"
                    onPress={() => this.setState({ fabactive: !this.state.fabactive })}>
                    <Icon name={'share'} />
                    <Button onPress={() => { this.logOut() }} style={{ backgroundColor: themcolor.fabBtnClr }}>
                        <View>
                            <Icon name="exit" />
                        </View>
                    </Button>
                    <Button onPress={() => { this.setState({ selectedPage: 14 }) }} style={{ backgroundColor: themcolor.fabBtnClr }}>
                        <Icon name="settings" />
                    </Button>
                    <Button onPress={() => { this.setState({ selectedPage: 13 }) }} style={{ backgroundColor: themcolor.fabBtnClr }}>
                        <Icon name="add" />
                    </Button>
                </Fab>
            );
        }
    }



    logOut = () => {
        this.props.Stater({ logedin: false, page: -1, });
        this.storLogout();
    }

    storLogout = async () => {

        database.setData({ status: 'logedOut', passwordhash: 'passwordhash', username: 'username',theme:'sunny' }).then(
            (resp) => { console.log(resp); }).catch(
                (err) => { console.log(err); }
            );
    };

    pageChanger = async (val) => {
        await this.setState({ selectedPage: val });
        await this.props.storeState('Primary', this.state);
    }

    pagesSelect = () => {
        let val = this.state.selectedPage;
        while (val > 10) {
            val /= 10;
        }
        val = parseInt(val);
        switch (val) {
            case 1:
                {
                    return (
                        <View style={{ justifyContent: 'center', flexDirection: "row" }}>
                            <Button onPress={() => { this.pageChanger(3) }} style={style.footer_items, { flex: 1, justifyContent: 'center' }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/search.png")} />
                            </Button>
                            <Button onPress={() => { this.pageChanger(2) }} style={style.footer_items, { flex: 1, justifyContent: 'center', }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/document.png")} />
                            </Button>
                            <Button onPress={() => { this.pageChanger(1) }} style={style.footer_items, { flex: 1, justifyContent: 'center' }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/home_selected.png")} />
                            </Button>
                        </View>
                    );
                }
            case 2:
                {
                    return (
                        <View style={{ justifyContent: 'center', flexDirection: "row" }}>
                            <Button onPress={() => { this.pageChanger(3) }} style={style.footer_items, { flex: 1, justifyContent: 'center' }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/search.png")} />
                            </Button>
                            <Button onPress={() => { this.pageChanger(2) }} style={style.footer_items, { flex: 1, justifyContent: 'center', }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/document_selected.png")} />
                            </Button>
                            <Button onPress={() => { this.pageChanger(1) }} style={style.footer_items, { flex: 1, justifyContent: 'center' }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/home.png")} />
                            </Button>
                        </View>
                    );
                }
            case 3:
                {
                    return (
                        <View style={{ justifyContent: 'center', flexDirection: "row" }}>
                            <Button onPress={() => { this.pageChanger(3) }} style={style.footer_items, { flex: 1, justifyContent: 'center' }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/search_selected.png")} />
                            </Button>
                            <Button onPress={() => { this.pageChanger(2) }} style={style.footer_items, { flex: 1, justifyContent: 'center', }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/document.png")} />
                            </Button>
                            <Button onPress={() => { this.pageChanger(1) }} style={style.footer_items, { flex: 1, justifyContent: 'center' }} transparent>
                                <Image style={style.footer_items} source={require("../storage/images/home.png")} />
                            </Button>
                        </View>
                    );
                }
            default:
                { return; }
        }
    }
}

const style = StyleSheet.create({
    continer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    namelogo: {
        fontSize: 28,
        color: 'black',
    },
    back_arrow: {
        width: 50,
        height: 50,
        marginTop: 20,
    },
    footer: {
        alignItems: 'flex-start',
        flexDirection: "row",
        elevation: 3,
        shadowOffset: { height: -5, }, shadowOpacity: 0.2,
        borderColor: 'gray',
        borderTopWidth: 0.5,
    },
    footer_items: {
        width: 32,
        height: 32,
    }
});

export default primary;