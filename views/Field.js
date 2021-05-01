import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Server from '../Server';
import { Icon, Card, CardItem } from 'native-base';

class Field extends React.Component {
    state = {
        fields: [],
    }

    componentDidMount() {
        let tis = this;
        axios.post(Server.url + 'fields', {
            university_id: tis.props.DocumentState.selecteduniversity,
        })
            .then(function (res) {
                tis.setState({ fields: res.data.fields });
            })
            .catch(function (err) {
                console.log(err);
            });

    }


    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', margin: 15 }}>
                {this.state.fields.map((item) => {
                    return (
                        <TouchableOpacity onPress={async() => {await this.props.DocumentStater({ 'selectedfield': item.id }); await this.getdocs(); }}>
                            <Card style={{ borderRadius: 8, height: 70, flex: 1, margin: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 20, }}>{item.name}</Text>
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    getdocs = ()=>{
        let tis= this;
        let data = new FormData();
        data.append('field_id',tis.props.DocumentState.selectedfield);
        data.append('university_id', tis.props.DocumentState.selecteduniversity);
        axios.get(Server.url+'documents/get?'+'field_id='+tis.props.DocumentState.selectedfield+'&university_id='+tis.props.DocumentState.selecteduniversity)
        .then(async (response)=>{
            await tis.props.DocumentStater({documents:response.data});
            tis.props.pageChanger(22);
        })
        .catch((err)=>{
            console.log(err);
        });
    }
}


const Styles = StyleSheet.create({

});

export default Field;