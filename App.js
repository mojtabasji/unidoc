import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import Logiin from './views/Logiin';
import Primary from './views/Primery';
import Signup from './views/Signup';

class App extends React.Component {
  state = {
    userName: '',
    logedin: false,
    header: 'UniDoc',
    passwordHash: '',
    page: 0,
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('status');
      if (value !== null) {
        // We have data!!
        if (value == 'logedIn') {
          this.setState({ logedin: true, page: 0 });
          //load username from storage
          const usern = await AsyncStorage.getItem('userName');
          const passhash = await AsyncStorage.getItem('passwordHash');
          console.log('usern',usern);
          this.setState({userName:usern,passwordHash:passhash});
        }
        else this.setState({ logedin: false, page: -1 });
      }

    } catch (error) {
      this._storeData();
    }
  };

  mystatus = () => {
    //this._retrieveData();
    if (this.state.logedin == false) {
      this.setState({ page: -1 });
    }
    else { this.setState({ page: 0 }); }
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'status',
        'logedOut'
      );
    } catch (error) {
      // Error saving data
    }
    this._retrieveData();
  };

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
          return <Primary Stater={this.stater} State={this.state} ></Primary>
        }
      default:
        return;
    }
  }

  componentDidMount() {
    this._retrieveData();
    this.mystatus();
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