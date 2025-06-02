import React, {Component} from 'react'
import { Container, Segment, Table } from 'semantic-ui-react';
import Layout from "../components/Layout";
import Cookies from 'js-cookie'
import * as Constants from '../common/constants'
import { withRouter } from '../utils/withRouter';

class Transactions extends Component {
    state = {
        server: Constants.setServer.server,
        transactions: [],
        tablefields: [ "applicationid", "amountcharged", "created"]
    }

    componentDidMount() {
        if ( ! Cookies.get("userId")) {
            this.props.navigate("/login")
        }
        
        let data = {
            where: {
                userid: Cookies.get("userId")
            }
        }

        fetch("http://" + this.state.server + "/api/transactions?filter=" + JSON.stringify(data))
		.then(res => res.json())
		.then(
			(result) => {
                this.setState({transactions: result})
			},
			(error) => {
				console.log(error)
			}
        )
        
    }

    render(){
        const {tablefields, transactions} = this.state
        return (
            <Layout>
                <Container fluid>
                    <Segment>
                        <h3>All Appications List</h3>
                    </Segment>
                    <Segment>
                        <Table striped celled>
                            <Table.Header>
                                <Table.Row>
                                    {
                                        tablefields.map ( field =>
                                            <Table.HeaderCell>{field}</Table.HeaderCell>
                                        )
                                    }
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    transactions.map ( transaction =>
                                        <Table.Row>
                                            {
                                                tablefields.map ( field =>
                                                    <Table.Cell>{transaction[field]}</Table.Cell>
                                                )
                                            }
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default withRouter(Transactions)
