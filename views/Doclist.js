import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Left, Right } from 'native-base';

class Doclist extends React.Component {

    state = {
        documentList: this.props.Docs,
    }
    componentDidMount() {
    }

    render() {
        return (
            <View style={{ margin: 15 }}>
                {this.state.documentList.map((item) => {
                    return (
                        <TouchableOpacity onPress={()=>{this.props.ParentStater({selectedDoc:item.id}); this.props.pageChanger(this.props.toGo)}}>
                            <Card style={{ borderRadius: 8, margin: 10, alignItems: 'center' }}>
                                <Text style={{ margin: 10, fontSize: 22, fontWeight: '600' }}>{item.courseName}</Text>
                                <Text style={{ margin: 10, fontSize: 20 }}>{item.title}</Text>
                                <View style={{ flex: 1, flexDirection: 'row', margin: 10, marginRight: 30, marginLeft: 30 }}>
                                    <Left><Text>ترم :  {item.term}</Text></Left>
                                    <Right style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                        <Image style={{ width: 20, height: 20, margin: 5 }} source={require('../storage/images/username.png')}></Image>
                                        <Text>{item.userName}</Text>
                                    </Right>
                                </View>
                                <Text style={{ margin: 10, fontSize: 18 }}>{item.filetypeName}</Text>
                            </Card>
                        </TouchableOpacity>
                    );
                })
                }
            </View>
        );
    }
}



export default Doclist;