import React, {Component} from 'react';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Dropdown from 'react-dropdown';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {fullWhite} from 'material-ui/styles/colors';
import {strings} from "../localization";

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {userInfo} from '../actions';

import {hostUrl} from '../../config';
import {ALL_LANGUAGES} from "../constants";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      muiTheme: getMuiTheme(),
      open: false,
      languages: ALL_LANGUAGES,
    };
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(selectedItem) {
    strings.setLanguage(selectedItem.value);
    this.props.history.replace('/');
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  getChildContext() {
    return {muiTheme: this.state.muiTheme};
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.userInfo();
    }
  }

  handleToggle = () => {
    return this.setState({open: !this.state.open});
  };

  handleClose = () => {
    return this.setState({open: false});
  };

  handleHome = () => {
    this.props.history.push('/');
  };

  menuUser = () => {
    let avatar_image = `${hostUrl}/images/anonymous.png`;
    let name = 'No logged in user';
    let registrationId = '';
    let level = '';
    let year = '';
    let specialization = '';

    if (this.props.logged) {
      const {user} = this.props;
      if (user) {
        avatar_image = user.profile.picture;
        name = user.profile.name;
        registrationId = user.registrationId;
        level = user.profile.level;
        year = user.profile.yearOfStudy;
        specialization = user.profile.specialization;
      }
    }

    return (
        <div className="profile" style={{overflow: 'hidden', margin: 0, padding: 0}}>
          <div style={{
            margin: 0,
            padding: 0,
            width: '100%',
            height: '220px',
            backgroundImage: `url(/public/assets/images/office.jpg)`,
            backgroundSize: '100%'
          }} onClick={(e) => {
            e.preventDefault();
            this.handleClose();
          }}>
            <div style={{
              overflow: 'hidden',
              margin: 0,
              paddingTop: 20,
              paddingBottom: 0,
              paddingLeft: 20,
              paddingRight: 20
            }}>
              <img src={`${avatar_image}`} width="80px" height="80px" alt="" className="img-circle"
                   style={{marginLeft: 0, marginRight: 0, verticalAlign: 'middle'}}/>
            </div>
            <div className="student-info" style={{margin: 0, paddingLeft: 26, paddingRight: 26}}>
              <p className="text-white text-bold" style={{height: 12}}>{name}</p>
              <p className="text-white" style={{height: 12}}>{registrationId}</p>
              <p className="text-white" style={{height: 12}}>{specialization}</p>
              <p className="text-white" style={{height: 12}}>{level} {this.props.logged ? ',' : ''} {year}</p>
            </div>
          </div>
          <div style={{height: 10}}/>
        </div>
    );
  };

  menuLogin = (close) => {
    if (!this.props.logged) {
      return (
          <MenuItem primaryText={this.renderText("Login")} onTouchTap={() => {
            this.props.history.push('/signin');
            if (close) this.handleClose();
          }}/>);
    }
    else {
      return (
          <MenuItem primaryText={this.renderText("Logout")} onTouchTap={() => {
            this.props.history.push('/signout');
            if (close) this.handleClose();
          }}/>);
    }
  };

  renderLogin = () => {
    if (!this.props.logged) {
      return <FlatButton
          label="Login"
          onTouchTap={() => {
            this.props.history.push('/signin');
          }}
      />
    }
    else {
      return <FlatButton
          label="Logout"
          onTouchTap={() => {
            this.props.history.push('/signout');
          }}
      />;
    }
  };

  menuCourses = (close) => {
    if (this.props.logged) {
      return (
          <MenuItem primaryText={this.renderText(<div><i className="fa fa-graduation-cap" aria-hidden="true"
                                                         style={{marginRight: 10}}/><span>Current Courses</span></div>)}
                    onTouchTap={() => {
                      this.props.history.push('/view-courses');
                      if (close) this.handleClose();
                    }}/>
      );
    }
  };

  menuHistoryCourses = (close) => {
    if (this.props.logged) {
      return (
          <MenuItem primaryText={this.renderText(<div><i className="fa fa-leanpub" aria-hidden="true"
                                                         style={{marginRight: 10}}/><span>Previous Courses</span>
          </div>)} onTouchTap={() => {
            this.props.history.push('/view-previous-courses');
            if (close) this.handleClose();
          }}/>
      );
    }
  };

  renderMore = () => {
    const options = _.map(this.state.languages, language => (
        {value: language.value, label: <img src={language.image} />}
    ));

    const defaultOption = options.find(element => element.value === strings.getLanguage());

    return (
        <div>
          <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon color={fullWhite}/></IconButton>
              }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            {this.menuCourses(false)}
            {this.menuHistoryCourses(false)}
            <MenuItem primaryText={this.renderText("Sign Up")} onTouchTap={() => {
              this.props.history.push('/signup');
            }}/>
            {this.menuLogin(false)}
            <div className='dropdown-language'>
              <Dropdown options={options}
                        onChange={this.onSelect}
                        value={defaultOption}
                        placeholder='Select an option' />
            </div>
          </IconMenu>
        </div>
    );
  };

  renderNav = () => {
    return (
        <div className='bar'>
          <AppBar
              title={<span onClick={this.handleHome} style={{cursor: "pointer"}}>ePortal</span>}
              titleStyle={{textAlign: "center"}}
              onLeftIconButtonTouchTap={this.handleToggle}
              iconElementRight={this.props.logged ? this.renderMore() : this.renderLogin()}
          />
        </div>
    );
  };

  renderText = (text) => {
    return (
        <div style={{margin: 0, paddingLeft: 26, paddingRight: 26}}>{text}</div>
    );
  };

  renderDrawer = () => {
    return (
        <div>
          <Drawer
              docked={false}
              width={400}
              open={this.state.open}
              onRequestChange={(open) => this.setState({open})}
          >
            <MenuItem innerDivStyle={{margin: 0, padding: 0}} primaryText={this.menuUser()}/>
            <div className="divider"/>
            {this.menuCourses(true)}
            {this.menuHistoryCourses(true)}
            <div className="divider"/>
            <MenuItem primaryText={this.renderText("Sign Up")} onTouchTap={() => {
              this.props.history.push('/signup');
              this.handleClose();
            }}/>
            {this.menuLogin(true)}
          </Drawer>
        </div>
    );
  };

  render() {
    return (
        <div>
          {this.renderNav()}
          {this.renderDrawer()}
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logged: state.auth.logged,
    user: state.auth.user
  };
}

const mapDispatchToProps = dispatch => {
  return {
    userInfo: () => dispatch(userInfo())
  }
};

export default Header = withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
