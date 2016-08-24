import AppBar from 'material-ui/AppBar';
import axios from 'axios';
import IconButton from 'material-ui/IconButton';
import BottomNavigation from 'material-ui/BottomNavigation';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Paper from 'material-ui/Paper';
import React from 'react';
import cookie from 'react-cookie';
import { withRouter } from 'react-router';
import LoginButtons from 'components/LoginButtons';
import Snackbar from 'material-ui/Snackbar';
import StatusButtons from 'components/StatusButtons';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const App = React.createClass({

  getInitialState() {
    return {
      loginSnackbarOpen: false,
      givers: [],
      bars: [],
      bar: { placeId: '', name: '' },
      coords: null,
      open: false
    }
  },

  componentDidMount() {
    this.getLocation();
  },

  componentWillMount() {
    this.socket = io();

    this.socket.on('success', (data) => {
      this.props.router.push(`/chats/${data.chatId}`);
    });

  },

  createChat(giverId) {
    const request = { giverId: giverId, bummerId: cookie.load('userId') };

    axios.post('/api/chats', request)
      .then((res) => {

        this.socket.emit('subscribe', {
          chatId: res.data.id
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },

  joinChat(chatId) {
    this.socket.emit('subscribe', {
      chatId: chatId
    })
  },

  getLocation() {
    if (!navigator.geolocation) {
      return console.log('Geolocation is not supported by your browser.');
    }

    const success = (position) => {
      const { latitude, longitude } = position.coords;
      const nextCoords = Object.assign({}, { latitude, longitude });


      this.setState({ coords: nextCoords });
      this.getBars();
    };

    const failure = () => {
      console.log('Could not obtain your location.');
    }

    navigator.geolocation.getCurrentPosition(success, failure);
  },

  getGivers() {
    axios.get(`/api/givers/${this.state.bar.placeId}`)
      .then((res) => {
        this.setState({ givers: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getBars() {
    const { latitude, longitude } = this.state.coords;

    axios.get(`/api/places/${latitude},${longitude}`)
      .then((res) => {
        this.setState({ bars: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  },

  login(credentials) {
    axios.post('/api/token', credentials)
      .then((res) => {
        return this.props.router.push('/home');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.setState({ loginSnackbarOpen: true });
          setTimeout(function() { this.setState({ loginSnackbarOpen: false }); }.bind(this), 4000);
        }
        else {
          console.log('uh oh we messed up.');
        }
      });
  },

  postGiver() {
    const giver = {
      placeId: this.state.bar.placeId,
      userId: cookie.load('userId')
    };

    axios.post('api/givers', giver)
      .then((res) => {
        // this.props.router.push('/givers/success');
      })
      .catch((err) => {
        console.log('post user error');
      })
  },

  register(user) {
    axios.post('/api/users', user)
      .then((res) => {
        this.setState({ userId: res.data.userId });
        return this.props.router.push('/home');
      })
      .catch((err) => {
        console.error(err);
      });
  },

  updateBar(nextBar) {
    this.setState({ bar: nextBar });
    this.props.router.push('/status');
  },

  handleToggle() { this.setState({open: !this.state.open});
  },

  handleClose() {
  this.setState({open: false});
  },


  render() {

    const styleMenu = {
      iconStyle: {
        width: 48,
        height: 48,
        paddingBottom: 0
      },
      style: {
        width: 64,
        height: 64,
        padding: 0
      }
    };

    const stylePaper = {
      backgroundColor: '#e5f3e9'
    };


    const styleContainer = {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignContent: 'space-around',
      alignItems: 'center',
      marginTop: '0px',
      marginLeft: '10px',
      justifyContent: 'space-between'
    };

    const styleTitle = {
      fontSize: '35px',
      color: '#ff7f66',
      fontFamily: 'Varela Round'
    };

    const styleTagline = {
      fontSize: '13px',
      fontWeight: '400',
      marginTop: '0px',
      marginLeft: '0px',
      color: 'black',
      fontFamily: 'Roboto'
    };

    const styleFooter = {
      backgroundColor: '#e5f3e9'
    };

    const styleImage = {
      display: 'inlineBlock',
      width: '30%',
      marginBottom: '-35px',
      marginLeft: '10px',
      marginTop: '-30px'
    };

    const styleDrawer = {
      backgroundColor: '#fff7ec'
    }

    const styleDrawerCigContainer = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }

    const styleDrawerCig = {
      width: '70%',
      marginTop: '-30px',
      marginBottom: '-30px',
      padding: '0',
    }

    const styleDrawerText = {
      textAlign: 'center'
    }

    return <div >
      <Paper style={stylePaper}
        >
        <div style={styleContainer}>
          <div style={styleTitle}>
            smokator
            <img style={styleImage} src={'./images/cigarette.svg'} />
            <h1 style={styleTagline}>Connecting drunk smokers since 1776</h1>
          </div>
          <IconButton
            iconStyle={styleMenu.iconStyle}
            style={styleMenu.style}
            onTouchTap={this.handleToggle}
          >
            <NavigationMenu color={'#ff7f66'}/>
          </IconButton>
          <Drawer
            docked={false}
            width={200}
            openSecondary={true}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
            containerStyle={styleDrawer}
          >
            <MenuItem>
              <div style={styleDrawerCigContainer}>
                <img style={styleDrawerCig} src={'./images/cigarette.svg'} />
              </div>
            </MenuItem>
            <MenuItem
            onTouchTap={this.handleClose}
            style={styleDrawerText}
            >Profile</MenuItem>
            <MenuItem
            onTouchTap={this.handleClose}
            style={styleDrawerText}
            >Log Out</MenuItem>
          </Drawer>
        </div>
      </Paper>

      <Snackbar
          open={this.state.loginSnackbarOpen}
          message="Invalid login credentials."
          bodyStyle={{ color: 'white' }}
        />

      {React.cloneElement(this.props.children, {
        login: this.login,
        updateBar: this.updateBar,
        getGivers: this.getGivers,
        getBars: this.getBars,
        bars: this.state.bars,
        bar: this.state.bar,
        givers: this.state.givers,
        register: this.register,
        postGiver: this.postGiver,
        createChat: this.createChat,
        sendMessage: this.sendMessage,
        socket: this.socket,
        joinChat: this.joinChat
      })}


    </div>
  }
});

export default withRouter(App);
