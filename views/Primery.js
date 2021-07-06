import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import {
    Container, Header, Text, Body, Title, Left,
    Right, Button, Icon, Footer, Content, Fab, Card, Item, Input,
} from 'native-base';
import Home from './Home.js';
import Document from './Document.js';
import Search from './Search.js';
import Myfile from './Myfile.js';
import Ads from './Ads';
import * as database from '../database';



class primary extends React.Component {
    state = {
        selectedPage: 3,
    }


    componentDidMount() {
        let getState = this.props.restoreState('Primary');
        if(getState != 'notFound')
        {
            this.setState(getState);
        }
    }


    /* 
    <Image style={style.back_arrow} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/arrow_left2-128.png' }} /> */

    render() {
        return (
            <Container>
                <Header>
                    <View style={{ width: 60, marginBottom: 5, marginLeft: 5, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => { this.goback() }} style={{ justifyContent: 'center' }} transparent>
                            <Icon name={"chevron-back-outline"} style={{ fontSize: 30, marginTop: 7 }}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Body style={{ alignItems: 'flex-start' }}>
                        <Title style={style.namelogo}>𝓤𝓷𝓲𝓓𝓸𝓬</Title>
                    </Body>
                    <View>
                        <Button onPress={()=>{this.connectToUs()}} style={{width:30,height:30,borderRadius:10, justifyContent:'center',alignItems:'center', backgroundColor:'pink', margin:15}}>
                            <Text style={{ color: Platform.OS === 'ios' ? 'white' : 'blue' , fontWeight:'bold'}} >i</Text>
                        </Button>
                    </View>
                </Header>
                {this.showpage()}
                {this.AdsPage()}
                {this.fabBtn()}
                <Footer >
                    <View style={style.footer}>
                        {this.pagesSelect()}
                    </View>
                </Footer>
            </Container>
        );
    }

    connectToUs = ()=>{
        Alert.alert(
            "ارتباط با ما",
            "مشتاقانه منتظر نظرات، پیشنهادات، انتقادات و در میان گذاشتن مشکلات برای بهبود عملکرد تیم ما از سمت شما هستم.\ninstagram: @mojtaba_sji",
            [
              {
                text: "بعدا",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "حتما", onPress: () => {Linking.openURL('https://www.instagram.com/mojtaba_sji/');} }
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
                        <Home Stater={this.props.Stater} pager={this.state.selectedPage} State={this.props.State} pageChanger={this.pageChanger}></Home>
                    </Content>);
            case 2:
                return (
                    <Content>
                        <Document storeState={this.props.storeState} restoreState={this.props.restoreState} pageChanger={this.pageChanger} adsControll={this.props.adsControll} pager={this.state.selectedPage}></Document>
                    </Content>
                );
            case 3:
                return (
                    <Content>
                        <Search storeState={this.props.storeState} restoreState={this.props.restoreState} adsControll={this.props.adsControll} pageChanger={this.pageChanger} pager={this.state.selectedPage}></Search>
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
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomLeft"
                    onPress={() => this.setState({ fabactive: !this.state.fabactive })}>
                    <Icon name={'share'} />
                    <Button onPress={() => { this.logOut() }} style={{ backgroundColor: '#DD5144' }}>
                        <View>
                            <Icon name="exit" />
                        </View>
                    </Button>
                    <Button onPress={() => { this.setState({ selectedPage: 14 }) }} style={{ backgroundColor: '#3B5998' }}>
                        <Icon name="settings" />
                    </Button>
                    <Button onPress={() => { this.setState({ selectedPage: 13 }) }} style={{ backgroundColor: '#34A34F' }}>
                        <Icon name="add" />
                    </Button>
                </Fab>
            );
        }
    }



    logOut = () => {
        this.props.Stater({ logedin: false, page: -1 });
        this.storLogout();
    }

    storLogout = async () => {

        database.setData({ status: 'logedOut', passwordhash: 'passwordhash', username: 'username' }).then(
            (resp) => { console.log(resp); }).catch(
            (err) => { console.log(err); }
        );
    };

    pageChanger = async(val) => {
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
        marginLeft: 55,
    },
    back_arrow: {
        width: 50,
        height: 50,
        marginTop: 20,
    },
    footer: {
        alignItems: 'flex-start',
        flexDirection: "row",
    },
    footer_items: {
        width: 40,
        height: 40,
    }
});

export default primary;