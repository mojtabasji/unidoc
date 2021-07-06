import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import Logiin from './views/Logiin';
import Primary from './views/Primery';
import Signup from './views/Signup';
import * as database from './database';
import axios from 'axios';
import Server from './Server';
import Ads from './views/Ads';


class App extends React.Component {
  state = {
    userName: '',
    logedin: false,
    header: 'UniDoc',
    passwordHash: '',
    page: 0,
    adsStatusCode: 0,
    adsCounter: 0,
  };


  storeState = (pageName, stt) => {
    this.setState({ [pageName]: stt });
  }

  restoreState = (pageName) => {
    try {
      return this.state[pageName];
    }
    catch {
      return 'notFound';
    }
  }

  readDb = () => {
    database.getData().then((data) => {
      console.log('Db msg: ', data);
      if (data.status == 'logedIn') {
        this.setState({ logedin: true, page: 0 });
        this.setState({ userName: data.username, passwordHash: data.passwordhash });
      }
      else this.setState({ logedin: false, page: -1 });
    }).catch((err) => {
      console.log('Db msg: ',err);
      database.setData({ status: 'logedOut', username: 'username', passwordhash: 'passwordhash' }).catch((err) => { console.log(err); });
    });
  }

  mystatus = () => {
    //this._retrieveData();
    if (this.state.logedin == false) {
      this.setState({ page: -1 });
    }
    else { this.setState({ page: 0 }); }
  }


  stater = (value) => {
    this.setState(value);
  }

  pagesSwicht = () => {
    switch (this.state.page) {
      case -2:
        {
          return <Signup Stater={this.stater}></Signup>
        }
      case -1:
        {
          return <Logiin Stater={this.stater} />
        }
      case 0:
        {
          return <Primary Stater={this.stater} storeState={this.storeState} restoreState={this.restoreState} adsControll={this.adsControll} State={this.state} ></Primary>
        }
      case 9:
        {
          return <Ads Stater={this.stater}  ></Ads>
        }
      default:
        return;
    }
  }

  adsControll = (comeFrom) => {
    if (this.state.adsStatusCode != 0) {
      this.setState({ adsCounter: this.state.adsCounter + 1 });
      if (this.state.adsCounter == this.state.adsStatusCode) {
        this.setState({ adsCounter: 0, page: 9 });
      }
    }
  }

  componentDidMount() {
    this.readDb();
    this.mystatus();
    let tis = this;
    axios.get(Server.url + 'ads/getstatuscode', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    }
    ).then((resp) => {
      tis.setState({ adsStatusCode: resp.data.statusCode });
    }).catch((err) => {
      console.log(err);
      tis.setState({ adsStatusCode: 0 });
    });
  }

  render() {
    return (
      <Container>
        {this.pagesSwicht()}
      </Container>
    );
  }



  pageback = () => {
    if (this.state.page != 0)
      return (
        <Button transparent>
          <Icon name='arrow-back' />
        </Button>);
  }
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    justifyContent: 'center',
  }
})

export default App;