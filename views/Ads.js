import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Button, Icon } from 'native-base';
import axios from 'axios';
import Server from '../Server';

class App extends React.Component {

    state = {
        videoLink: '',
        btnShow: false,
        adsUrl:'http://unidoc.ir',
    };

    _onPlaybackStatusUpdate = playbackStatus => {
        //console.log('vid data: ',playbackStatus);
        if (playbackStatus.positionMillis > 5000) {
            this.setState({ btnShow: true });
            // The player has just finished playing and will stop.
        }
        if (playbackStatus.didJustFinish)
        {
            this.setState({ btnShow: true });
        }
    }

    componentDidMount() {
        let tis = this;
        axios.get(Server.url + 'ads/fully?app=unidoc')
            .then((res) => {
                let dta = res.data;
                console.log(dta);
                tis.setState({ videoLink: Server.geturl + dta.adsurl, adsUrl:dta.adsorgurl });
                console.log(tis.state.videoLink);
            }).catch((err) => {
                console.log('errr: ',err);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{flex:1}} onPress={()=>{this.openUrl()}}>
                    <Video
                        shouldPlay
                        ref={this._handleVideoRef}
                        style={styles.video}
                        resizeMode="stretch"
                        source={{
                            uri: this.state.videoLink,
                        }}
                        resizeMode="stretch"
                        onPlaybackStatusUpdate=
                        {(playbackStatus) => this._onPlaybackStatusUpdate(playbackStatus)}
                    >
                    </Video>
                </TouchableOpacity>
                {this.state.btnShow && this.exitBtn()}

            </View>
        );
    }

    openUrl = ()=>{
        Linking.openURL(this.state.adsUrl);
    }

    exitBtn = () => {
        return (
            <Button
                onPress={() => { this.props.Stater({ page: 0 }); }}
                style={{ position: 'absolute', marginTop: 20, marginRight: 20, backgroundColor: '#909497', borderRadius: 70 }}>
                <Icon name="close" style={{ color: 'black', fontSize: 22 }}></Icon>
            </Button>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row-reverse',
    },
    video: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;