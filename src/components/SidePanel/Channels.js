import React, { Fragment } from 'react';
import firebase from '../../firebase'
import {connect} from 'react-redux'
import { setCurrentChannel } from '../../actions'
import { Menu, Icon, Modal, Form, Button, Input } from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true
    }

    componentDidMount() {
        this.addListeners()
    }

    componentWillUnmount() {
        this.removeListeners()
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val())
            this.setState({channels: loadedChannels}, () => this.setFirstChannel())
        })
    }

    removeListeners = () => {
        this.state.channelsRef.off()
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel)
        }
        this.setState({firstLoad: false})
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state

        const key = channelsRef.push().key

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName
            }
        }

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({channelName: '', channelDetails: ''})
            this.closeModal()
        })
        .catch(err => {
            console.err(err)
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        if(this.isFormValid(this.state)) {
            this.addChannel()
        }
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id})
    }

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel);
    }

    displayChannels = channels => (
        channels.length > 0 && 
        channels.map(channel => (
            <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{opacity: 0.7, color: '#000000'}}
            active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails

    closeModal = () => this.setState({modal:false})

    openModal = () => this.setState({modal:true})

    render() {
        const { channels, modal } = this.state
        return (
            <Fragment>
            <Menu.Menu style={{paddingBottom: '2em'}}>
                <Menu.Item style={{color: '#000000'}}>
                    <span>
                        <Icon name="stack exchange" /> CHANNELS
                    </span>{" "}
                    ({channels.length}) <Icon name="add" onClick={this.openModal} />
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>

            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                            fluid
                            label="Name of Channel"
                            name="channelName"
                            onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                            fluid
                            label="About the Channel"
                            name="channelDetails"
                            onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        )
    }
}

export default connect(null, {setCurrentChannel})(Channels)