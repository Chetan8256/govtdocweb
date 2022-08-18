import React, {Component} from 'react'
import { Container, Grid, Form, Checkbox, Button, Segment, Menu, Input } from 'semantic-ui-react';
import {NavLink, Redirect} from 'react-router-dom'
import cookie from 'react-cookies'
import Layout from "../components/Layout";
import * as Constants from '../common/constants'

class Login extends Component {


    state = {
        email: "",
        password: "",
        server: Constants.setServer.server,
    }

    componentDidMount() {
        if (cookie.load('userId')) {
            this.props.history.push('/dashboard')
        }
    }


    usernameHandle = (event, {value}) => {
        this.setState({email: value})
    }

    passwordHandle = (event, {value}) => {
        this.setState({password: value})
    }

    onSubmit = (e) => {
        e.preventDefault()
        let data = {
            where: {
                email: this.state.email,
                password: this.state.password
            }
        }

        fetch("http://" + this.state.server + "/api/members/findOne?filter=" + JSON.stringify(data))
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert 

                if (result.id && result.email) {
                    cookie.save('userId', result.id, { path: '/' })
                    cookie.save('username', result.username, { path: '/' })
                    if (result.username === "admin") {
                        this.props.history.push('/members')
                    } else {
                        this.props.history.push('/dashboard')
                    }
                    
                }
                this.clearFormInputs()
			},
			(error) => {
				console.log(error)
			}
        )
    }

    clearFormInputs = () => {
        this.setState({password: "", email: ""})
    }

    render () {
        const {email, password} = this.state
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
                                    <h3 >Login</h3>
                                    <Form onSubmit={this.onSubmit}>
                                        <Form.Field
                                            control={Input}
                                            label='Email'
                                            placeholder='email'
                                            required
                                            onChange={this.usernameHandle}
                                            value={email}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Password'
                                            placeholder='password'
                                            type='password'
                                            required
                                            onChange={this.passwordHandle}
                                            value={password}
                                        />
                                        <Form.Field>
                                            <Checkbox label='I agree to the Terms and Conditions' />
                                        </Form.Field>
                                        <Button type='submit'>Submit</Button>
                                    </Form>
                                </Segment>
                                <Segment>
                                    Create an account 
                                    <Menu.Menu position='right'>
                                        <Menu.Item as={Nav}
                                            name='register'
                                            to='/register'
                                        >Sign Up</Menu.Item>
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

export default Login