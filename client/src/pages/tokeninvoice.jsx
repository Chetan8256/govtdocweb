import React, {Component} from 'react'
import { Container, Grid, Header, Button, Segment, Message, Table } from 'semantic-ui-react';
import Layout from "../components/Layout";
import cookie from 'react-cookies'
import * as Constants from '../common/constants'
import ReactToPrint from 'react-to-print'

class TokenInvoice extends Component {
    state = {
        server: Constants.setServer.server,
        applicationid: null
    }

    componentWillReceiveProps(props) {
        var applicationid = props.applicationid
        
        fetch("http://" + this.state.server + "/api/applications/" + applicationid)
		.then(res => res.json())
		.then(
			(result) => {
                this.setState({application: result})
			},
			(error) => {
				console.log(error)
			}
        )
    }

    render () {
        const {application} = this.state

        return (
            <Container>
                <Segment>
                    {
                        application && 
                        <Table structured celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan="4" width={3}>
                                        <Header as='h5' floated='right'>
                                            Applicant's Copy
                                        </Header><br/>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell colSpan="4">
                                        <Header as='h2' textAlign='center'>
                                            Token of Application (Online)
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><b>Token Number</b></Table.Cell>
                                    <Table.Cell colSpan="2"></Table.Cell>
                                    <Table.Cell>{application.token}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><b>Category</b></Table.Cell>
                                    <Table.Cell>Individual</Table.Cell>
                                    <Table.Cell>Fees Paid (Rs.)</Table.Cell>
                                    <Table.Cell><b>110.00</b></Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><b>Name on Card</b></Table.Cell>
                                    <Table.Cell colSpan="3">{application.firstname} {application.middlename} {application.lastname}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><b>Father's Name</b></Table.Cell>
                                    <Table.Cell colSpan="3">{application.fathername}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><b>Date of Birth/Incorporation</b></Table.Cell>
                                    <Table.Cell colSpan="3">{application.dateofbirth}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell><b>Telephone/Mobile Number</b></Table.Cell>
                                    <Table.Cell>{application.mobileno}</Table.Cell>
                                    <Table.Cell><b>Email ID</b></Table.Cell>
                                    <Table.Cell>{application.emailid}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan="4">
                                        <p>On Behalf of Computer King (Service Centre)</p><br/>
                                        <p>Goods and Services tax Number: </p>
                                        <p>Branch ID</p>
                                        <p>CSC CENTRE</p>
                                        <p>District Karnal, Haryana, 132001</p>
                                    </Table.Cell>
                                </Table.Row> 
                                <Table.Row>
                                    <Table.Cell colSpan="4"></Table.Cell>
                                </Table.Row> 
                                <Table.Row>
                                    <Table.Cell colSpan="4">This is computer generated receipt doesn't require signature.</Table.Cell>
                                </Table.Row>     
                            </Table.Body>
                        </Table>
                    }
                </Segment>
            </Container>           
        )
    }
}

class PrintInvoice extends React.Component {
    state = {
        id: null
    }
    componentDidMount() {
        const { match: { params } } = this.props
        console.log("application id = " + params.applicationid)
        this.setState({id: params.applicationid})
    }
    render() {
        const {id} = this.state
        return (
            <Container>
                <Segment textAlign="center">
                    <ReactToPrint
                        trigger={() => <Button color='purple'>Print Slip</Button>}
                        content={() => this.componentRef}
                    />
                </Segment>                
                <TokenInvoice applicationid={id} ref={el => (this.componentRef = el)}  />
            </Container>            
        );
    }
}

export default PrintInvoice