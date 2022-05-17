import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Icon, Card, Container, Item, Input, Spinner, } from 'native-base';
import axios from 'axios';
import Server from '../Server';
import Doclist from './Doclist';
import ShowDoc from './ShowDoc';

class search extends React.Component {
    state = {
        loading: false,
        searchText: '',
        Documents: [],
        selectedDoc: '',
    }

    componentDidMount() {
        let getstate = this.props.restoreState('Search');
        if (getstate != 'notFound') {
            this.setState(getstate);
        }
    }

    render() {
        return (
            <View>
                {this.pageControll()}
            </View>
        );
    }


    pageControll = () => {
        switch (this.props.pager) {
            case 3:
                return (
                    <View>
                        <Card searchBar style={{ borderRadius: 10, marginLeft: 10, marginRight: 10, backgroundColor: this.props.themcolor.searchClr }}>
                            <Item>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => { this.searching(); }}>
                                    <Icon name="ios-search" />
                                </TouchableOpacity>
                                <Input onChangeText={(text) => { this.setState({ searchText: text }) }} placeholder="Search" />
                                <TouchableOpacity onPress={this.searchinfo}>
                                    <Icon name="help-circle-outline" />
                                </TouchableOpacity>
                            </Item>
                        </Card>
                        {this.state.loading && <Spinner color="gray"></Spinner>}
                        {this.empty()}
                        {!this.state.loading && <Doclist Docs={this.state.Documents} storeState={this.props.storeState} restoreState={this.props.restoreState} adsControll={this.props.adsControll} pageChanger={this.props.pageChanger} ParentStater={this.searchStater} toGo={31}></Doclist>}
                    </View>
                );
            case 31:
                return (
                    <ShowDoc fileId={this.state.selectedDoc}></ShowDoc>
                );
        }
    }

    empty = () => {
        if (!this.state.Documents.length) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 20, margin: 10 }}>
                        لیست جستجو خالیست ...
                    </Text>
                    <Text>
                        چیزی جست و جو کنید
                    </Text>
                    <Image style={{ width: 100, height: 100, marginTop: 100 }} source={require('../storage/images/emptyfolder.png')}></Image>
                </View>
            );
        }
    }

    searchinfo = () => {
        Alert.alert(
            "جست و جو:",
            "برای جستجو فایل می‌توانید بخشی از نام/توضیحات را وارد کنید و یا برای جستجوی  فایل‌های اشتراک گذاری شده یک کاربر نام کاربری را به صورت کامل وارد کنید.",
            [
                {
                    text: "باشه",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }

    searching = async () => {
        if (this.state.searchText.length) {
            this.setState({ loading: true });
            let tis = this;
            axios.get(Server.url + 'documents/search?searchtext=' + tis.state.searchText)
                .then((response) => {
                    tis.setState({ Documents: response.data });
                    tis.setState({ loading: false });
                })
                .catch((err) => {
                    console.log(err);
                });

            await this.props.storeState('Search', this.state);
        }
    }

    searchStater = async (val) => {
        await this.setState(val);
        await this.props.storeState('Search', this.state);
    }
}

const styles = StyleSheet.create({
    continer: {
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default search;