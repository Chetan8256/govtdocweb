import React, {Component} from 'react'
import * as Constants from '../common/constants'
import Layout from '../components/Layout'
import Cookies from 'js-cookie'
import { Container, Segment, Header, Form, Button, Input, Message, Dimmer, Loader } from 'semantic-ui-react'
import { withRouter } from '../utils/withRouter';

class AddAmount extends Component {
    state = {
        server: Constants.setServer.server,
        loader: false,
        alert: {
			message: "",
			type: "",
			display: false
		},
        amount: null
    }

    componentDidMount() {
        if ( ! Cookies.get("userId")) {
            this.props.navigate("/login")
        }
        
        this.setState({userid: Cookies.get("userId")})
    }


    amountHandle = (e, {value} ) => {
        this.setState({amount: value})
    }

    onSubmit = () => {
        this.setState({loader: true})
        let data = {
            memberid: this.state.userid,
            amount: this.state.amount,
            amountstatus: "Pending"
        }

        fetch("http://" + this.state.server + "/api/memberamounts/addMemberAmount", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type':'application/json'}
        })
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                let alert = this.state.alert                    
                if (result.message) {
                    alert["message"] = "Amount has been updated"
                    alert["type"] = "green"
                    alert["display"] = true
                    this.setState({loader: false})
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
        this.setState({amount: ""})
    }

    render () {
        const {loader, alert, amount} = this.state
        return (
            <Layout>
                <Container>
                    <Segment>
                        <Header as='h2'>Request for adding amount in your account</Header>
                    </Segment>
                    <Segment>
                        {
                            loader && 
                            <Dimmer active>
                                <Loader size='massive'>Loading</Loader>
                            </Dimmer>
                        }
                        {
                            alert.display === true &&
                            <Message size='tiny' color={alert["type"]} onDismiss={this.handleDismiss}>
                                <Message.Header>{alert["message"]}</Message.Header>
                            </Message>
                        }
                        <Form onSubmit={this.onSubmit}>
                            <Form.Field
                                control={Input}
                                label='Amount'
                                placeholder='Amount'
                                required
                                onChange={this.amountHandle}
                                value={amount}
                            />
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default withRouter(AddAmount)
