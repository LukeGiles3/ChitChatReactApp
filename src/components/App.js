import React from 'react';
import { Grid } from 'semantic-ui-react'
import './App.css';
import { connect } from 'react-redux'

import SidePanel from './SidePanel/SidePanel'
import MetaPanel from './MetaPanel/MetaPanel'
import Messages from './Messages/Messages'


const App = ({currentUser, currentChannel}) => (
  <Grid columns="equal" className="app" style={{ background: '#eee'}}>
    <SidePanel 
    currentUser={currentUser}
    key={currentChannel && currentChannel.uid}
    />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages 
      currentChannel={currentChannel} 
      key={currentChannel && currentChannel.id}
      currentUser={currentUser}
      />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
    
  </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps)(App);
