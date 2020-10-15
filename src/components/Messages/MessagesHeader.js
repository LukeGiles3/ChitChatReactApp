import React from 'react'
import { Header, Segment } from 'semantic-ui-react'

class MessagesHeader extends React.Component {
    render() {
        const {channelName} = this.props
        return (
            <Segment clearing>
                <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
                    <span>
                        {channelName}
                    </span>
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader