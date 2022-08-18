import React, {Component} from 'react'
import { Container, Form, Modal, Input, Button, Segment, Table, Message, Pagination, Dimmer, Loader } from 'semantic-ui-react'
import Layout from "../components/Layout"
import { Document, Page, pdfjs } from 'react-pdf'
import cookie from 'react-cookies'
import * as Constants from '../common/constants'

class RequestLists extends Component {
    state = {
        server: Constants.setServer.server,
        isLoaded: false,
        loader: false,
        open: false,
        inputKey: Date.now(),
        applications: [],
        userid: "",
        invoicefile: {
            name: "",
            size: "",
            content: "",
            type: ""
        },
        amtcharged: "",
        pageNumber: 1,
        uploadedform: {},
        modaltype: "",
        numPages: null,
        applicationid: "",
        transactionid: null,
        alert: {
			message: "",
			type: "",
			display: false
        },
        page: 1,
        tokenno: "",
        email: "",
        itemsPerPage: 20,
        totalPages: null,
        tablefields: ["userid","token","firstname", "lastname", "fathername","aadharno","dateofbirth","emailid", "status"],
        fields: ["aocode","applicanttitle","firstname","middlename","lastname","fathername","dateofbirth","cardname","aadharno","mobileno","emailid","address","village","pandeliverystate","postoffice","tehsil","district","state","pincode","form"]
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }

        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

		this.fetchAllApplications()
    }

    fetchAllApplications() {
        fetch("http://" + this.state.server + "/api/applications")
		.then(res => res.json())
		.then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    applications: result,
                    totalPages: (result.length < 15)? 1: result.length / this.state.itemsPerPage
                
                });
                //return Object.keys(result.status)
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
        
    }

    onUpload = (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];

        let invoicefile = this.state.invoicefile
        
        invoicefile["name"] = file.name
		invoicefile["type"] = file.type
		invoicefile["size"] = (file.size/1024/1024).toFixed(2)

		reader.onloadend = (file) => {
            //this.setState({govtid: reader.result});
            invoicefile["content"] = reader.result
		}
        reader.readAsDataURL(file)
        
        this.setState({invoicefile})
    }
    
    show = (size, userid, modaltype, applicationid) => () => {
        if (modaltype === 'view') {
            this.setState({loader: true})
            fetch("http://" + this.state.server + "/api/applications/viewForm", {
                method: 'POST',
                body: JSON.stringify({id: userid}),
                headers: {'Content-Type':'application/json'}
            })
            .then(res => res.json())
            .then(
                (result) => {
                    let alert = this.state.alert   
                    if (result.message && result.message.length > 0) {
                        this.setState({uploadedform: "data:application/pdf;base64," + result.message[0].form.content })
                        this.setState({applicationid: result.message[0].id })
                        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
                        alert["display"] = false
                        this.setState({loader: false, alert})
                    } else {                            
                        alert["message"] = result.message.error
                        alert["type"] = "red"
                        alert["display"] = true
                        this.setState({loader: false, alert, uploadedform: ""})
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
            
            this.setState({ size,userid, open: true, modaltype  })
        } else {
            this.setState({ size,userid, open: true, modaltype, applicationid })
        }
        
    }
    close = () => this.setState({ open: false })

    applicationid = (e, {value}) => {
        this.setState({applicationid: value})
    }

    tokenno = (e, {value}) => {
        if (value !== "") {
            this.setState({tokenno: value})
        } else {
            this.setState({tokenno: ""})
            this.fetchAllApplications()
        }
    }

    email = (e, {value}) => {
        if (value !== "") {
            this.setState({email: value})
        } else {
            this.setState({email: ""})
            this.fetchAllApplications()
        }
    }

    searchClear = () => {
        this.setState({tokenno: ""})
        this.fetchAllApplications()
    }
    
    onSubmit = async (e) => {
		e.preventDefault()
        this.setState({loader: true})
        let dataObj = {
            userid: this.state.userid,
            invoicefile: this.state.invoicefile,
            applicationid: this.state.applicationid
        }
        
        this.postApplicationData(dataObj)
	}

    postApplicationData = (dataObj) => {
        
        fetch("http://" + this.state.server + "/api/invoiceslips/addSlip", {
			method: 'POST',
			body: JSON.stringify(dataObj),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert 
                console.log(result.message.id)
                if (result.message.id) {                                 
                    alert["message"] = "Slip has been uploaded successfully"
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
        this.setState({inputKey: Date.now(), amtcharged: "", modaltype: "", alert: {}})
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    amtcharged = (e, {value}) => {
        this.setState({amtcharged: value})
    }

    updateApplicationStatus = (status, applicationid) => () => {
        let data = {
            field: {
                status: status
            },
            where: {
                id: applicationid
            }
        }

        fetch("http://" + this.state.server + "/api/applications/updateStatus", {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert
                if (result.message.id) {   
                    this.setState({transactionid: result.message.id})             
                    alert["message"] = "Status has been added successfully"
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

    updateChargedAmount = () => {
        if (this.state.transactionid) {
            let dataObj = {
                condition: {
                    id: this.state.transactionid
                },
                field: {
                    amountcharged: this.state.amtcharged
                }
            }
            this.postAmtChargedData(dataObj, "update")
        }
        
    }

    onAmtChargedSubmit = async (e) => {
        this.setState({loader: true})
        let dataObj = {
            amountcharged: this.state.amtcharged,
            userid: this.state.userid,
            applicationid: this.state.applicationid
        }
        
        this.postAmtChargedData(dataObj, "add")
	}

    postAmtChargedData = (dataObj, type) => {
        
        fetch("http://" + this.state.server + "/api/transactions/" + type + "ChargedAmount", {
			method: 'POST',
			body: JSON.stringify(dataObj),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert
                if (result.message.id) {   
                    this.setState({transactionid: result.message.id})             
                    alert["message"] = "Amount has been added successfully"
                    alert["type"] = "green"
                    alert["display"] = true
                    this.setState({loader: true})
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

    setPageNum = (e, { activePage }) => {
        this.setState({ page: activePage });
    }

    onSearchSubmit = async (e) => {
        this.setState({loader: true})
        let dataObj = {
            where: {}
        }
        
        if (this.state.email){
            dataObj.where["emailid"] = this.state.email
        } 

        if (this.state.tokenno){
            dataObj.where["token"] = this.state.tokenno
        } 

        fetch("http://" + this.state.server + "/api/applications?filter=" + JSON.stringify(dataObj))
		.then(res => res.json())
		.then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    applications: result,
                    totalPages: result.length / this.state.itemsPerPage,
                    page: 1
                });
                //return Object.keys(result.status)
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }
    

    render () {
        const {loader, size, tablefields, applications, open, inputKey, userid, alert, modaltype, uploadedform, pageNumber, numPages, amtcharged, applicationid, totalPages, page, itemsPerPage, tokenno, email} = this.state

        const items = applications.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
        )

        return (
            <Layout>
                <Container fluid>
                    <Segment>
                        <h3>All Appications List</h3>
                    </Segment>
                    <Segment>
                        <Form onSubmit={this.onSearchSubmit}>
                            <Form.Group>
                                <Form.Field
                                    control={Input}
                                    placeholder='Token No'
                                    onChange={this.tokenno}
                                    value={tokenno}
                                />
                                <Form.Field
                                    control={Input}
                                    placeholder='Email'
                                    onChange={this.email}
                                    value={email}
                                />
                                <Button type='submit'>Search</Button>
                                <Button type='submit' onClick={this.searchClear}>Clear</Button>
                            </Form.Group>
                        </Form>
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
                                    <Table.HeaderCell>Form</Table.HeaderCell>
                                    <Table.HeaderCell>Slip</Table.HeaderCell>
                                    <Table.HeaderCell>Charge</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    items.map ( application =>
                                        <Table.Row>
                                            {
                                                tablefields.map ( field => 
                                                    (
                                                        field === "dateofbirth" ?
                                                            <Table.Cell>{new Date(application[field]).toLocaleDateString()}</Table.Cell>
                                                        :     <Table.Cell>{application[field]}</Table.Cell>
                                                    )                                                    
                                                )
                                            }
                                            <Table.Cell>
                                                <Button  size='mini' title="View/Download PDF" icon='file pdf' onClick={this.show("large", application["id"], "view")} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button  size='mini' title="Upload Slip" icon='upload' onClick={this.show("tiny", application["userid"], "upload", application["id"])} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button  size='mini' title="Add Amount" icon='rupee sign' onClick={this.show("tiny", application["userid"], "amount", application["id"])} />
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                        
                        <Pagination defaultActivePage={5} totalPages={totalPages} siblingRange={1} onPageChange={this.setPageNum} />
                        
                        <Modal size={size} open={open} onClose={this.close} closeIcon>
                            <Modal.Header>Upload Slip for User</Modal.Header>
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
                            <Modal.Content>
                                {
                                    modaltype === "view" ? (
                                        [
                                            <Document
                                                file={uploadedform}
                                                onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                                            >
                                                <Page width="1038" pageNumber={pageNumber} />
                                            </Document>,
                                            <p>Page {pageNumber} of {numPages}</p>,
                                            <button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber - 1 }))}>
                                                Prev page
                                            </button>,
                                            <button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }))}>
                                                Next page
                                            </button>,
                                            <Segment>
                                                <a href={uploadedform} download="file.pdf">Download</a>             
                                            </Segment>,
                                            <Segment>
                                                <Button  size='mini' title="Approved" icon='check' onClick={this.updateApplicationStatus("approved", applicationid)} >Approved</Button>
                                                <Button  size='mini' title="Rejected" icon='times' onClick={this.updateApplicationStatus("rejected", applicationid)} >Rejected</Button>
                                            </Segment>
                                            
                                        ]
                                    ) : modaltype === "upload" ? (
                                        <Form onSubmit={this.onSubmit}>
                                            <Form.Field
                                                control={Input}
                                                label='Userid'
                                                placeholder='UserID'
                                                required
                                                onChange={this.userid}
                                                value={userid}
                                            />
                                            <Form.Field
                                                control={Input}
                                                label='Userid'
                                                placeholder='UserID'
                                                required
                                                onChange={this.applicationid}
                                                value={applicationid}
                                            />
                                            <Form.Input type= "file" id="file" name="file" hidden fluid label='Upload Slip' onChange={(event) => this.onUpload(event)} key={inputKey}/>
                                            <Button type='submit'>Submit</Button>
                                        </Form>
                                    ) : modaltype === "amount" ? (
                                        <Form onSubmit={this.onAmtChargedSubmit}>
                                            <Form.Field
                                                control={Input}
                                                label='Userid'
                                                placeholder='UserID'
                                                required
                                                onChange={this.userid}
                                                value={userid}
                                            />
                                            <Form.Field
                                                control={Input}
                                                label='ApplicationID'
                                                placeholder='ApplicationID'
                                                required
                                                onChange={this.applicationid}
                                                value={applicationid}
                                            />
                                            <Form.Field
                                                control={Input}
                                                label='Amount Charged'
                                                placeholder='Amount Charged'
                                                required
                                                onChange={this.amtcharged}
                                                value={amtcharged}
                                            />
                                            <Button type='submit'>Submit</Button>
                                            <Button type='button' onClick={this.updateChargedAmount}>Update</Button>
                                        </Form>
                                        
                                    ) : (
                                        <div></div>
                                    )
                                    
                                }
                                
                            </Modal.Content>
                            <Modal.Actions>
                                {/*
                                    <p>Page {pageNumber} of {numPages}</p>
                                    <button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber - 1 }))}>
                                        Prev page
                                    </button>
                                    <button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }))}>
                                        Next page
                                    </button>
                                    */
                                }
                            </Modal.Actions>
                        </Modal>
                    </Segment>
                </Container>
            </Layout>
        )
    }
}

export default RequestLists