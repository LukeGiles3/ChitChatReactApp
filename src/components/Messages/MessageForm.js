import React from 'react'
import { Input, Segment, Button } from 'semantic-ui-react'
import firebase from '../../firebase';

class MessageForm extends React.Component {
    state = {
        messsage: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: []
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value });
    }

    createMessage = () => {
        const message = {
            content: this.state.message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id:  this.state.user.uid,
                name: this.state.user.displayName
             }
        }
        return message
    }

    sendMessage = () => {
        const {messagesRef} = this.props
        const {message, channel} = this.state

        if(message) {
            this.setState({loading: true})
            messagesRef
            .child(channel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
                this.setState({ loading: false, message: '', errors: []})
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    loading: false,
                    errors: this.state.errors.concat(err)
                })
            }) 
        } else {
            this.setState({
                errors: this.state.errors.concat({message: 'Add a message'})
            })
        }
    }

    render() {
        const {errors, message, loading} = this.state
        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    onChange={this.handleChange}
                    value={message}
                    style={{marginBottom: '0.7em'}}
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                    placeholder="Write your message..."
                    />
                    <Button.Group icon widths="2">
                        <Button
                            onClick={this.sendMessage}
                            disabled={loading} 
                            color="blue"
                            content="Send"
                            labelPosition="left"
                            icon="edit"
                        />
                    </Button.Group>
            </Segment>
            
        )
    }
}

export default MessageForm