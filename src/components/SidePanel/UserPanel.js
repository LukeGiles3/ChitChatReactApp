import React from 'react'
import firebase from '../../firebase'
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react'


class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: (
            <span>
                Signed in as <strong>{this.state.user.displayName}</strong>
            </span>
            ),
            disabled: true
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout}>Sign Out</span>
        }
    ];

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signedout'))
    };

    render() {
        const {user} = this.state;

        return (
            <Grid style={{background: '#D5B895'}}>
                <Grid.Column>
                    <Grid.Row style={{padding:'1.2rem', margin: 0}}>
                        <Header style={{color: '#000000'}} inverted floated="left" as="h2">
                            <Icon name="code branch" />
                            <Header.Content>ChitChat</Header.Content>
                        </Header>
                    </Grid.Row>
                    <Header style={{padding:'0.25em', color:'#000000'}} as="h4" inverted>
                        <Dropdown 
                        trigger={
                        <span>
                            {user.displayName}
                        </span>
                        }
                        options={this.dropdownOptions()} 
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default UserPanel;