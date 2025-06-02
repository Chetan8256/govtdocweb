import React, {Component} from 'react'
import * as Constants from '../common/constants'
import Layout from '../components/Layout'
import Cookies from 'js-cookie'
import { Container, Segment, Header, Form, Button, Input, Message} from 'semantic-ui-react'
import { withRouter } from '../utils/withRouter';

class ChangePassword extends Component {
    state = {
        server: Constants.setServer.server,
        password: "",
        confirmpassword: "",
        alert: {
			message: "",
			type: "",
			display: false
		},
        userid: ""
    }

    componentDidMount() {
        if ( ! Cookies.get("userId")) {
            this.props.navigate("/login")
        }
        
        this.setState({userid: Cookies.get("userId")})
    }

    passwordHandle = (e, {value}) => {
        this.setState({password: value})
    }

    confirmpasswordHandle = (e, {value}) => {
        this.setState({confirmpassword: value})
    }

    onSubmit = () => {
        let alert = this.state.alert
        if(this.state.password === this.state.confirmpassword) {
            let data = {
                id: this.state.userid,
                password: this.state.password
            }

            fetch("http://" + this.state.server + "/api/members/addMember", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type':'application/json'}
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)                    
                    if (result.message) {
                        alert["message"] = "Password has been updated"
                        alert["type"] = "green"
                        alert["display"] = true
                    } else {
                        alert["type"] = "red"
                        alert["display"] = true
                        alert["message"] = "There is some problem with the details provided by you."
                    }

                    this.clearFormInputs()
                },
                (error) => {
                    console.log(error)
                }
            )
        } else {
            alert["type"] = "red"
            alert["display"] = true
            alert["message"] = "Password should be matched"
            
        }

        this.setState({alert})
    }

    clearFormInputs = () => {
        this.setState({password: "", confirmpassword: ""})
    }

    render () {
        const {alert, password, confirmpassword} = this.state
        return (
            <Layout>
                <Container>
                    <Segment>
                        <Header as='h2'>Update your default password</Header>
                    </Segment>
                    <Segment>
                        {
                            alert.display === true &&
                            <Message size='tiny' color={alert["type"]} onDismiss={this.handleDismiss}>
                                <Message.Header>{alert["message"]}</Message.Header>
                            </Message>
                        }
                        <Form onSubmit={this.onSubmit}>
                            <Form.Field
                                control={Input}
                                label='Password'
                                placeholder='Password'
                                required
                                type="password"
                                onChange={this.passwordHandle}
                                value={password}
                            />
                            <Form.Field
                                control={Input}
                                label='Confirm Password'
                                placeholder='Confirm Password'
                                required
                                type="password"
                                onChange={this.confirmpasswordHandle}
                                value={confirmpassword}
                            />
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default withRouter(ChangePassword)
