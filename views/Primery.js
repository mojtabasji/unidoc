import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import {
    Container, Header, Text, Body, Title, Left,
    Right, Button, Icon, Footer, Content, Fab, Card, Item, Input,
} from 'native-base';
import Home from './Home.js';
import Document from './Document.js';
import Search from './Search.js';
import Myfile from './Myfile.js';



class primary extends React.Component {
    state = {
        selectedPage: 3,
    }


    componentDidMount(){
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
                </Header>
                <Content>
                    {this.showpage()}
                </Content>

                {this.fabBtn()}
                <Footer >
                    <View style={style.footer}>
                        {this.pagesSelect()}
                    </View>
                </Footer>
            </Container>
        );
    }

    goback = () => {
        let tmp = this.state.selectedPage;
        if (tmp > 10) { tmp /= 10; tmp = parseInt(tmp); }
        this.setState({ selectedPage: tmp });
    }

    showpage = () => {
        let selectedpageroot = this.state.selectedPage;
        if (selectedpageroot > 10) { selectedpageroot /= 10; selectedpageroot = parseInt(selectedpageroot); }

        switch (selectedpageroot) {
            case 1:
                return (<Home Stater={this.props.Stater} pager={this.state.selectedPage} State={this.props.State} pageChanger={this.pageChanger}></Home>);
            case 2:
                return (<Document pageChanger={this.pageChanger} pager={this.state.selectedPage}></Document>);
            case 3:
                return (<Search pageChanger={this.pageChanger} pager={this.state.selectedPage}></Search>);
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
                    <Button onPress={() => { this.setState({ selectedPage: 4 }) }} style={{ backgroundColor: '#DD5144' }}>
                        <View>
                            <Icon name="add" />
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
        try {
            await AsyncStorage.setItem(
                'status',
                'logedOut'
            );
        } catch (error) {
            // Error saving data
        }
    };

    pageChanger = (val) => {
        this.setState({ selectedPage: val });
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
            case 4:
                {
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