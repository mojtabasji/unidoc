import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { icon, Card, CardItem, } from 'native-base';
import axios from 'axios';
import Server from '../Server';
import Field from './Field';
import Doclist from './Doclist';
import ShowDoc from './ShowDoc';

class document extends React.Component {
    state = {
        universitis: [],
        selecteduniversity: '',
        selectedfield: '',
        documents: [],
        selectedDoc:'',
    }

    componentDidMount() {
        let tis = this;
        axios.get(Server.url + 'universitis')
            .then((resp) => {
                tis.setState({ universitis: resp.data.universitis });
            }).catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <View>
                {this.pageChontroll()}
            </View>
        );
    }

    pageChontroll = () => {
        switch (this.props.pager) {
            case 2:
                return (
                    <View style={styles.continer}>
                        <FlatList numColumns={2} style={{}}
                            data={this.state.universitis}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.props.pageChanger(21); this.setState({ selecteduniversity: item.id }); }}>
                                    <Card style={{ borderRadius: 10, margin: 10, flex: 1, height: 140, width: 140, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image style={{ height: 80, width: 80, marginBottom: 10 }} source={{ uri: Server.geturl + item.image }}></Image>
                                        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                                    </Card>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index}
                        >

                        </FlatList>
                    </View>
                );
            case 21:
                return (
                    <Field pager={this.props.pager} pageChanger={this.props.pageChanger} DocumentStater={this.DocumentStater} DocumentState={this.state}></Field>
                );

            case 22:
                {
                    return (
                        <Doclist Docs={this.state.documents} pageChanger={this.props.pageChanger} ParentStater={this.DocumentStater} toGo={23}></Doclist>
                    );
                }
            case 23:
                return (
                    <ShowDoc fileId={this.state.selectedDoc}></ShowDoc>
                );
        }
    }



    DocumentStater = (val) => {
        this.setState(val);
    }

}

const styles = StyleSheet.create({
    continer: {

        margin: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default document;