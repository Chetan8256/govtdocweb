import React, {Component} from 'react'
import { Container, Form, Modal, Input, Button, Segment, Table, Message, Pagination } from 'semantic-ui-react'
import Layout from "../components/Layout"
import cookie from 'react-cookies'
import * as Constants from '../common/constants'


class Members extends Component {
    state = {
        server: Constants.setServer.server,
        alert: {
			message: "",
			type: "",
			display: false
        },
        modaltype: "",
        open: false,
        amount: "",
        amounts: [],
        userid: "",
        members: [],
        page: 1,
        itemsPerPage: 30,
        totalPages: null,
        tablefields: ["id", "username", "email", "mobile", "created"],
        amountstablefields: ["id", "memberid","amount", "created", "modified", "amountstatus"]
    }

    constructor() {
        super()
        this.postAmountData = this.postAmountData.bind(this)
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
        
        var data = {
            "where": { 
                "permission": null
            }
        }

		fetch("http://" + this.state.server + "/api/members" )
		.then(res => res.json())
		.then(
            (result) => {
                console.log(result)
                this.setState({
                    isLoaded: true,
                    members: result,
                    totalPages: result.length / this.state.itemsPerPage
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
        
    }

    AmountHandle = (e, {value}) => {
        this.setState({amount: value})
    }

    useridHandle = (e, {value}) => {
        this.setState({userid: value})
    }

    show = (size, userid, modaltype) => () => {        
        if (modaltype === "view") {
            let data = {
                where: {
                    memberid: userid
                }
            }
            fetch("http://" + this.state.server + "/api/memberamounts?filter=" + JSON.stringify(data))
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    this.setState({
                        isLoaded: true,
                        amounts: result,
                        totalPages: result.length / this.state.itemsPerPage
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
            this.setState({ size,userid, open: true, modaltype })
        } else {
            this.setState({ size,userid, open: true, modaltype })
        }
        
    }

    close = () => this.setState({ open: false })
    
    onSubmit = async (e) => {
		e.preventDefault()

        let dataObj = {
            memberid: this.state.userid,
            amount: this.state.amount,
            amountstatus: "Approved"
        }
        
        this.postAmountData(dataObj)
	}

    postAmountData = (dataObj) => {
        
        fetch("http://" + this.state.server + "/api/memberamounts/addMemberAmount", {
			method: 'POST',
			body: JSON.stringify(dataObj),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert
                if (result.message.id) {                                 
                    alert["message"] = "Amount has been added successfully"
                    alert["type"] = "green"
                    alert["display"] = true
                    this.props.history.push("/members")
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

    setPageNum = (e, { activePage }) => {
        this.setState({ page: activePage });
    }

    updateAmountStatus = (amountstatusid, amountstatus) => () => {
        let data = {
            id: amountstatusid,
            amountstatus: amountstatus === "Approved"? "Pending": "Approved"
        }

        fetch("http://" + this.state.server + "/api/memberamounts/addMemberAmount", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type':'application/json'}
        })
        .then(res => res.json())
        .then(
            (result) => {
                let alert = this.state.alert                    
                if (result.message) {
                    alert["message"] = "Status has been updated"
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

    render () {
        const {userid, amount, tablefields, members, size, open, totalPages, page, itemsPerPage, modaltype, amountstablefields, amounts} = this.state

        const items = members.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
        )

        return (
            <Layout>
                <Container fluid>
                    <Segment>
                        <h3>All Members List</h3>
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
                                    <Table.HeaderCell>Amounts</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    items.map ( member =>
                                        <Table.Row>
                                            {
                                                tablefields.map ( field =>
                                                    <Table.Cell>{member[field]}</Table.Cell>
                                                )
                                            }
                                            <Table.Cell>
                                                <Button.Group size='mini'>
                                                    <Button size='mini' color='orange' onClick={this.show("large", member["id"], "view")} >View</Button>
                                                    <Button.Or />
                                                    <Button size='mini' color='green' onClick={this.show("tiny", member["id"], "add")}>Add</Button>
                                                </Button.Group>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                        <Pagination totalPages={totalPages} siblingRange={1} onPageChange={this.setPageNum} />
                        <Modal size={size} open={open} onClose={this.close} closeIcon>
                            {
                                modaltype === "add" ? (
                                    <Modal.Header>Add amount for User</Modal.Header>,
                                    [
                                        ( alert.display === true &&
                                            <Message size='tiny' color={alert["type"]} onDismiss={this.handleDismiss}>
                                                <Message.Header>{alert["message"]}</Message.Header>
                                            </Message>
                                        ),
                                        <Modal.Content>
                                            <Form onSubmit={this.onSubmit}>
                                                <Form.Field
                                                    control={Input}
                                                    label='Userid'
                                                    placeholder='UserID'
                                                    required
                                                    onChange={this.useridHandle}
                                                    value={userid}
                                                />
                                                <Form.Field
                                                    control={Input}
                                                    label='Amount'
                                                    placeholder='Amount'
                                                    required
                                                    onChange={this.AmountHandle}
                                                    value={amount}
                                                />
                                                <Button type='submit'>Submit</Button>
                                            </Form>
                                        </Modal.Content>
                                    ]
                                ): modaltype === "view" && amounts.length > 0 ? (
                                    <Modal.Header>List of amounts</Modal.Header>,
                                    <Modal.Content>
                                        <Table striped celled>
                                            <Table.Header>
                                                <Table.Row>
                                                    {
                                                        amountstablefields.map ( field =>
                                                            <Table.HeaderCell>{field}</Table.HeaderCell>
                                                        )
                                                    }
                                                </Table.Row>
                                            </Table.Header>

                                            <Table.Body>
                                                {
                                                    amounts.map ( amount =>
                                                        <Table.Row>
                                                            {
                                                                amountstablefields.map ( field =>
                                                                    (
                                                                        field === "amountstatus" ? (
                                                                            <Table.Cell>
                                                                                <Button  size='mini' color={ amount[field] === "Pending"? "brown": "red" } title="Update Status" onClick={this.updateAmountStatus(amount["id"], amount[field])} >{amount[field]}</Button>
                                                                            </Table.Cell>
                                                                        ): (
                                                                            <Table.Cell>{amount[field]}</Table.Cell>
                                                                        )
                                                                    )
                                                                    
                                                                )
                                                            }
                                                        </Table.Row>
                                                    )
                                                }
                                            </Table.Body>
                                        </Table>
                                    </Modal.Content>
                                ): (
                                    <div></div>
                                )
                            }
                        </Modal>
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default Members