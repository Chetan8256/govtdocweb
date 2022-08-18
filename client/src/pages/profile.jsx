import React, {Component} from 'react'
import * as Constants from '../common/constants'
import Layout from '../components/Layout'
import cookie from 'react-cookies'
import { Container, Segment, Header, Form, Button,Input, Message } from 'semantic-ui-react'

class Profile extends Component {
    state = {
        server: Constants.setServer.server,
        alert: {
			message: "",
			type: "",
			display: false
		},
        companyname: "",
        companyaddress: "",
        email: ""
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
        
        this.setState({userid: cookie.load("userId")})
    }

    emailHandle = (e, {value}) => {
        this.setState({email: value})
    }

    companynameHandle = (e, {value}) => {
        this.setState({companyname: value})
    }

    companyAddressHandle = (e, {value}) => {
        this.setState({companyaddress: value})
    }

    onSubmit = () => {
        let alert = this.state.alert
        let data = {
            id: this.state.userid
        }
        if (this.state.email != "") {
            data["email"] = this.state.email
        }

        if(this.state.companyaddress != "") {
            data["companyaddress"] = this.state.companyaddress
        }

        if (this.state.companyname != "") {
            data["companyname"] = this.state.companyname
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
                    alert["display"] = false
                    alert["message"] = "There is some problem with the details provided by you."
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
        this.setState({email: "", companyaddress: "", companyname: ""})
    }

    render () {
        const {alert, email, companyname, companyaddress} = this.state
        return (
            <Layout>
                <Container>
                    <Segment>
                        <Header as='h2'>Edit Profile</Header>
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
                                label='Email'
                                placeholder='Email'
                                onChange={this.emailHandle}
                                value={email}
                            />
                            <Form.Field
                                control={Input}
                                label='Company Name'
                                placeholder='Company Name'
                                onChange={this.companynameHandle}
                                value={companyname}
                            />
                            <Form.Field
                                control={Input}
                                label='Company Address'
                                placeholder='Company Address'
                                onChange={this.companyAddressHandle}
                                value={companyaddress}
                            />
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default Profile