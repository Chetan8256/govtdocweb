import React, {Component} from 'react'
import { Container, Grid, Form, Checkbox, Button, Segment, Input, Message, Menu } from 'semantic-ui-react';
import {NavLink} from 'react-router-dom'
import Layout from "../components/Layout";
import * as Constants from '../common/constants'

class Register extends Component {

    state = {
        server: Constants.setServer.server,
        username: "",
        email: "",
        mobileno: "",
        alert: {
			message: "",
			type: "",
			display: false
		}
    }

    usernameHandle = (e, {value}) => {
        this.setState({username: value})
    }

    emailHandle = (e, {value}) => {
        this.setState({email: value})
    }

    mobileHandle = (e, {value}) => {
        this.setState({mobile: value})
    }

    onSubmit = async (e) => {
        e.preventDefault()
        let data = {
            username: this.state.username,
            email: this.state.email,
            mobile: this.state.mobile
        }

        fetch("http://" + this.state.server + "/api/members/addMember", {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert 
                
                if (result.message.id) {                                 
                    alert["message"] = "You have been successfully registered."
                    alert["type"] = "green"
                    alert["display"] = true
                } else {                                    
                    alert["type"] = "red"
                    alert["display"] = true
                    alert["message"] = "There is some problem. Please retry"				
                }
                this.setState({alert})
                this.clearFormInputs()
			},
			(error) => {
				console.log(error)
			}
        )

    }

    clearFormInputs = () => {
        this.setState({username: "", email: "", mobile: ""})
    }


    render () {
        const {username, email, mobile, alert} = this.state
        const Nav = props => (
            <NavLink
              exact
              {...props}
              activeClassName="active"
            />
        );

        return (
            <Layout>
                <Grid verticalAlign='middle' columns={3} centered>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column></Grid.Column>
                        <Grid.Column>
                                <Segment>
                                    <h3>Registration Form</h3>
                                    {
                                        alert.display === true &&
                                            <Message size='tiny' color={alert["type"]} onDismiss={this.handleDismiss}>
                                                <Message.Header>{alert["message"]}</Message.Header>
                                            </Message>
                                    }
                                    <Form onSubmit={this.onSubmit}>
                                        <Form.Field
                                            control={Input}
                                            label='Full Name'
                                            placeholder='Full Name'
                                            required
                                            onChange={this.usernameHandle}
                                            value={username}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Email'
                                            placeholder='Email'
                                            required
                                            onChange={this.emailHandle}
                                            value={email}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Mobile No'
                                            placeholder='Mobile No'
                                            required
                                            onChange={this.mobileHandle}
                                            value={mobile}
                                        />
                                        <Form.Field>
                                            <Checkbox label='I agree to the Terms and Conditions' />
                                        </Form.Field>
                                        <Button type='submit'>Submit</Button>
                                    </Form>
                                </Segment>
                                <Segment>
                                    Already have account. Please 
                                    <Menu.Menu position='right'>
                                        <Menu.Item as={Nav}
                                            name='login'
                                            to='/login'
                                            onClick={this.handleItemClick}
                                        >Sign In</Menu.Item>
                                    </Menu.Menu>
                                </Segment>
                            </Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default Register