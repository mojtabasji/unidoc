import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Icon, Card, Container, Item, Input } from 'native-base';
import axios from 'axios';
import Server from '../Server';
import Doclist from './Doclist';
import ShowDoc from './ShowDoc';

class search extends React.Component {
    state = {
        loading: false,
        searchText: '',
        Documents: [],
        selectedDoc:'',
    }

    componentDidMount() {
        let getstate = this.props.restoreState('Search');
        if(getstate != 'notFound')
        {
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
                        <Card searchBar style={{ borderRadius: 10, marginLeft: 10, marginRight: 10 }}>
                            <Item>
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => { this.searching(); }}>
                                    <Icon name="ios-search" />
                                </TouchableOpacity>
                                <Input onChangeText={(text) => { this.setState({ searchText: text }) }} placeholder="Search" />
                                <Icon name="ios-people" />
                            </Item>
                        </Card>
                        { !this.state.loading && <Doclist Docs={this.state.Documents} storeState={this.props.storeState} restoreState={this.props.restoreState} adsControll={this.props.adsControll} pageChanger={this.props.pageChanger} ParentStater={this.searchStater} toGo={31}></Doclist>}
                    </View>
                );
                case 31:
                    return (
                        <ShowDoc fileId={this.state.selectedDoc}></ShowDoc>
                    );
        }
    }

    searching = async () => {
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

    searchStater = async(val)=>{
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