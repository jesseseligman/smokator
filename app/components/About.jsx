import React from 'react';

const About = React.createClass({
  render() {
    const styleTitle = {
      textAlign: 'center',
      display: 'inline-block',
      fontFamily: 'Mallanna',
      color: 'black',
      textShadow: '2px 2px #e5f3e9',
      fontSize: '2.5em',
      fontWeight: '200',
      borderBottom: '2px solid #ff7f66',
      marginTop: '0px'
    };

    const styleDiv = {
      textAlign: 'center',
      overflow: 'scroll',
      height: '80vh'
    };

    const styleText = {
      fontFamily: 'Mallanna',
      fontSize: '18px',
      paddingLeft: '10px',
      paddingRight: '10px',
      marginTop: '0px',
      marginBottom: '0px'
    };

    const styleTextHow = {
      display: 'inline-block',
      borderBottom: '2px solid #ff7f66',
      fontFamily: 'Mallanna',
      fontSize: '22px',
      paddingLeft: '0px',
      marginTop: '30px',
      marginBottom: '15px',
      fontWeight: 'bold'
    };

    /* eslint-disable max-len */
    return <div style={styleDiv}>
      <h1 style={styleTitle}>About Smokator</h1>
      <p style={styleText}>Smokator is here to help you to acquire cigarettes from strangers in a bar.</p>
      <p style={styleTextHow}>How?</p>
      <ol style={styleText}>
        <li><span>-</span> LOGIN <span>-</span></li>
        <li><span>-</span>BUM OR GIVE<span>-</span></li>
        <li><span>-</span>CHAT<span>-</span></li>
        <li><span>-</span>SMOKE<span>-</span></li>
      </ol>
    </div>;

    /* eslint-enable max-len */
  }
});

export default About;
