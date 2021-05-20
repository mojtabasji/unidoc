import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Button, } from 'native-base';
import axios from 'axios';
import Server from '../Server';

class App extends React.Component {

    state = {
        videoLink: '',
    };

    _onPlaybackStatusUpdate = playbackStatus => {
        if (playbackStatus.didJustFinish) {
            this.props.pageChanger(1);
            // The player has just finished playing and will stop.
        };
    }

        componentDidMount() {
            let tis = this;
            axios.get(Server.url + 'ads/fully?app=unidoc')
                .then((res) => {
                    let rl = res.data;
                    tis.setState({ videoLink: Server.geturl + rl });
                    console.log(this.state.videoLink);
                }).catch((err) => {
                    console.log(err);
                });
        }

        render() {
            return (
                <View style={styles.container}>
                    <Video
                        shouldPlay
                        ref={this._handleVideoRef}
                        style={styles.video}
                        source={{
                            uri: this.state.videoLink,
                        }}
                        resizeMode="stretch"
                        onPlaybackStatusUpdate=
                        {(playbackStatus) => this._onPlaybackStatusUpdate(playbackStatus)}
                    >
                    </Video>
                        <Button onPress={() => { this.props.pageChanger(3); }}
                            style={{ width: 80, height: 50, borderRadius: 3,position:'absolute' }}>
                            <Text>خروج</Text>
                        </Button>

                </View>
            );
        }

    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#ecf0f1',
        },
        video: {
            alignSelf: 'center',
            width: 350,
            height: 300,
        },
        buttons: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    export default App;