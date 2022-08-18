import React, {Component} from 'react'
import { Container, Segment, Label, Header, Grid } from 'semantic-ui-react';
import Layout from "../components/Layout";
import cookie from 'react-cookies'
import * as Constants from '../common/constants'

class Dashboard extends Component {
    state = {
        server: Constants.setServer.server,
        members: [],
        totalcharged: null,
        tablefields: [ "applicationid", "amountcharged", "created"]
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
        var userid = cookie.load("userId")
        
        let data = {
            where: {
                memberid: userid,
                amountstatus: "Approved"
            },
            order: "id desc",
            limit: 1
        }

        fetch("http://" + this.state.server + "/api/memberamounts?filter=" + JSON.stringify(data))
		.then(res => res.json())
		.then(
			(result) => {
                this.setState({members: result})
			},
			(error) => {
				console.log(error)
			}
        )

        fetch("http://" + this.state.server + "/api/transactions/totalChargedAmount",{
            method: 'POST',
			body: JSON.stringify({userid: [userid]}),
			headers: {'Content-Type':'application/json'}
        })
		.then(res => res.json())
		.then(
			(result) => {
                this.setState({totalcharged: result.message[0].totalcharged})
			},
			(error) => {
				console.log(error)
			}
        )
        
    }

    render(){
        const { members, totalcharged} = this.state
        return (
            <Layout>
                <Container fluid>
                    <Segment>
                        
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                <Header as='h2' color='violet'>
                                    Welcome to Computer King
                                </Header>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    {
                                        members.length > 0 &&
                                        <Label.Group color="blue" tag>
                                            <Label as='a'>Total Amount - Rs. {members[0].amount}</Label>
                                        </Label.Group>
                                    }
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row >
                                <Grid.Column width={8}>
                                    {
                                        totalcharged &&
                                        <Label.Group floated='right' color="orange" tag>
                                            <Label as='a'>Total Charged Amount - Rs. {totalcharged}</Label>
                                        </Label.Group>
                                    }
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    {
                                        members.length > 0 && totalcharged &&
                                        <Label.Group floated='right' color="brown" tag>
                                            <Label as='a'>Pending Amount - Rs. {members[0].amount - totalcharged}</Label>
                                        </Label.Group>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        
                        
                    </Segment>
                    <Segment>
                        
                        
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default Dashboard