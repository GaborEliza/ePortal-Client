import _ from 'lodash';
import React, {Component} from 'react';
import Readmore from 'react-viewmore';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import FileViewer from 'react-file-viewer';
import {fetchLecture, viewLecture} from '../actions/lecture';
import {userInfo} from '../actions';
import SignIn from '../auth/signin';

import '../../styles/detail.css';

const styles = {
  dialogRoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0
  },
  dialogContent: {
    position: "relative",
    width: "80vw",
    transform: "",
  },
  dialogBody: {
    paddingBottom: 0
  }
};

const CustomComponent = ({children, ...props}) => (
    <div {...props} style={{
      color: 'white',
      backgroundColor: 'pink',
      padding: '5px 10px',
      textAlign: 'center'
    }}>
      {children}
    </div>
);

class Curriculum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      muiTheme: getMuiTheme(),
      open: false
    };
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  getChildContext() {
    return {muiTheme: this.state.muiTheme};
  }

  collapsibleTree = () => {
    const icons = {
      plus: 'add_box',
      minus: 'indeterminate_check_box'
    };

    $('.collapsible').collapsible({
      accordion: false,
      onOpen: function (el) {
        if ($(el).hasClass('active')) {
          const collapsible = el.children('.collapsible-header');
          if (collapsible) {
            const icon = $(collapsible).children('.material-icons');
            icon.text(icons.minus);
          }
        }
      },
      onClose: function (el) {
        if (!$(el).hasClass('active')) {
          const collapsible = el.children('.collapsible-header');
          if (collapsible) {
            const icon = $(collapsible).children('.material-icons');
            icon.text(icons.plus);
          }
        }
      }
    });
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.userInfo();
    }

    this.collapsibleTree();
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleViewLecture = (event, header, body, learn) => {
    event.preventDefault();

    if (learn) {
      if (this.props.logged) {
        const {user, lecture} = this.props;

        if (!lecture) {
          return this.handleOpen();
        }

        if (user) {
          return this.props.viewLecture(lecture.no, header.no, body.sub_no);
        }
      }
    }
    else {
      this.handleOpen();
    }
  };

  renderDialog = () => {
    return (
        <div>
          <Dialog
              contentStyle={styles.dialogContent}
              bodyStyle={styles.dialogBody}
              style={styles.dialogRoot}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              repositionOnUpdate={false}
              autoScrollBodyContent={true}
          >
            <SignIn redirect={this.handleClose} dialog={true}/>
            <br/>
            <br/>
          </Dialog>
        </div>
    );
  };

  lecturePreview = (header, body, preview) => {
    const {user, lecture} = this.props;

    if (!lecture) {
      return (<span>&nbsp;</span>);
    }

    if (user) {
      let filtered = user.courses.filter(function (_course) {
        if (_course.no === lecture.no) {
          return _course;
        }
      });

      if (filtered) {
        if (filtered.length > 0) {
          if (filtered[0].learn) {
            return (
                <div style={{width: '100%', height: '100% '}}
                     onClick={(e) => this.handleViewLecture(e, header, body, true)}>
                  <i className="fa fa-play-circle-o" aria-hidden="true"/>
                </div>
            );
          }
        }
      }
    }

    const _preview = (preview) ? 'Preview' : '';
    if (preview) {
      return (<div style={{width: '100%', height: '100% '}}
                   onClick={(e) => this.handleViewLecture(e, header, body, false)}>{_preview}</div>);
    }
  };

  lectureBody = (header) => {
    return _.map(header.body, (body, i) => {

          return (
              <div key={i} className="collapsible-body">
                <div className="row text-size-fifth">
                  <div className="col-sm-7 text-left">
                    <span>{body.content}</span>
                  </div>
                  <div className="col-sm-3 text-center">
                    <a href='http://www.rebe.rau.ro/RePEc/rau/jisomg/SP12/JISOM-SP12-A18.pdf'
                       target='_blank'
                       download='course.pdf'
                       style={{color: 'black'}}> Preview
                    </a>
                  </div>
                  <div className="col-sm-2 text-right">
                    <span>{body.time}</span>
                  </div>
                </div>

              </div>

          )
        },
    );
  };

  lectureHeader = (lecture) => {
    return _.map(lecture.header, (header, i) => {
          return (
              <li key={i}>
                <div className="collapsible-header"><i
                    className="material-icons collapsible-icon">add_box</i>{header.title}</div>
                {this.lectureBody(header)}
                {header.testLink ? <div className="collapsible-body course-test">
                  <div className="col-sm-7 text-left"><a href={header.testLink} target='_blank' className="btn btn-lg btn-default test">Take the test</a></div>
                </div> : ''}
              </li>
          )
        }
    );
  };

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }
  }

  renderLecture = () => {
    const {lecture} = this.props;
    if (!lecture) {
      return (<div>&nbsp;</div>);
    }

    return (
        <div>
          <div className="container" style={{
            textAlign: 'center',
            width: '100%'
          }}>
            <div className="row" style={{
              backgroundColor: 'rgba(250,250,250,0.8)',
              verticalAlign: 'middle',
              lineHeight: '4rem',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div className="col-sm-7 text-left">
                        <span className="text-bold text-size-second" style={{marginLeft: '2rem'}}>
                        Curriculum
                        </span>
              </div>
              <div className="col-sm-3 text-center">
                        <span className="text-emphasis-fifth text-size-third">
                            {_.get(lecture, 'total.lectures')}
                        </span>
                <span className="text-size-third">
                        &nbsp;Lectures
                        </span>
              </div>
              <div className="col-sm-2 text-right">
                        <span className="text-emphasis-third text-size-third" style={{marginRight: '1rem'}}>
                            {_.get(lecture, 'total.time')}
                        </span>
              </div>
            </div>
          </div>
          <Readmore id='showmore'
                    type={CustomComponent}>
            <div className="container-fluid" style={{
              textAlign: 'center',
              width: '100%'
            }}>
              <div className="row">
                <div className="col-sm-12">
                  <ul className="collapsible collapsible-scroll" data-collapsible="expandable">
                    {this.lectureHeader(lecture)}
                  </ul>
                </div>
              </div>
            </div>
          </Readmore>
        </div>
    );
  };

  render() {
    return (
        <div>
          {this.renderDialog()}
          {this.renderLecture()}
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    lecture: state.lecture.lecture,
    hasError: state.lecture.error,
    isLoading: state.lecture.loading
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLecture: (course_no) => dispatch(fetchLecture(course_no)),
    userInfo: () => dispatch(userInfo()),
    viewLecture: (lecture_no, header_no, sub_no) => dispatch(viewLecture(lecture_no, header_no, sub_no))
  }
};

export default Curriculum = withRouter(connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Curriculum));
