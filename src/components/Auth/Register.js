import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase';

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    }
    
    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields'};
            this.setState({errors: errors.concat(error)})
            return false
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Password is invalid'}
            this.setState({errors: errors.concat(error)})
            return false
        } else {
            return true
        }
    }

    isFormEmpty = ({ username, email, password }) => {
        return (
            !username.length || !email.length || !password.length
        ) 
    }

    isPasswordValid = ({password}) => {
        if(password.length < 6) {
            return false
        } else {
            return true
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true})
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username
                })
                .then(() => {
                    this.saveUser(createdUser).then(() => {
                        console.log('user saved');
                    })
                })
                .catch(err => {
                    console.error(err)
                    this.setState({ errors: this.state.errors.concat(err), loading: false })
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({errors: this.state.errors.concat(err), loading: false})
            })
        }
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName
        })
    }
    
    render() {
        const {username, email, password, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="black" textAlign="center">
                        <Icon name="comments" color="black" />
                        Sign up for ChitChat!
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input 
                            fluid 
                            name="username" 
                            icon="user"
                            iconPosition="left"
                            placeholder="Username" 
                            onChange={this.handleChange} 
                            type="text" 
                            value={username} 
                            className={this.handleInputError(errors, 'username')}
                            />
                            <Form.Input 
                            fluid 
                            name="email" 
                            icon="mail" 
                            iconPosition="left"
                            placeholder="Email Address"
                            onChange={this.handleChange} 
                            type="text" 
                            value={email}
                            className={this.handleInputError(errors, 'email')}
                            />
                            <Form.Input 
                            fluid 
                            name="password" 
                            icon="lock" 
                            iconPosition="left"
                            placeholder="Password" 
                            onChange={this.handleChange} 
                            type="password" 
                            value={password}
                            className={this.handleInputError(errors, 'password')}
                            />
                            <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user? Sign in <Link to="/login">here</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register