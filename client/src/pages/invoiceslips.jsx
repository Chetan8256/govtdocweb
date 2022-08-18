import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import { Container, Segment, Table, Modal, Button, Pagination } from 'semantic-ui-react';
import Layout from "../components/Layout";
import cookie from 'react-cookies'
import { Document, Page, pdfjs } from 'react-pdf';
import * as Constants from '../common/constants'
import Dashboard from './dashboard';

class InvoiceSlips extends Component {

    state = {
        server: Constants.setServer.server,
        filename: "",
        numPages: null,
        pageNumber: 1,
        content: "",
        open: false,
        applications: [],
        inputKey: Date.now(),
        page: 1,
        itemsPerPage: 15,
        totalPages: null,
        tablefields: ["token","firstname", "lastname", "fathername","village","aadharno","dateofbirth","state", "status"]
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
        
        let data = {
            where: {
               userid: cookie.load("userId"),
            }
        }

        fetch("http://" + this.state.server + "/api/applications?filter=" + JSON.stringify(data))
		.then(res => res.json())
		.then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    applications: result,
                    totalPages: result.length / this.state.itemsPerPage
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
        
    }
    show = (size, userid, modaltype, applicationid) => () => {
        let data = {
            where: {
                userid: cookie.load("userId"),
                applicationid: applicationid
            }
        }

        if (modaltype === 'view') {
            fetch("http://" + this.state.server + "/api/invoiceslips/viewPDF", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type':'application/json'}
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if (result && result.message.length > 0) {
                        this.setState({uploadedform: "data:application/pdf;base64," + result.message[0].invoicefile.content })
                        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
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

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
        
    }

    setPageNum = (e, { activePage }) => {
        this.setState({ page: activePage });
    }

    render() {
        const { pageNumber, numPages, applications, tablefields, size, uploadedform, open, totalPages, page, itemsPerPage} = this.state
        
        const items = applications.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
        )

        return (
            <Layout>
                <Container>
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
                                    <Table.HeaderCell width={2}>Slip</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    items.map ( application =>
                                        <Table.Row>
                                            {
                                                tablefields.map ( field =>
                                                    field === "dateofbirth" ?
                                                            <Table.Cell>{new Date(application[field]).toLocaleDateString()}</Table.Cell>
                                                        :     <Table.Cell>{application[field]}</Table.Cell>
                                                )
                                            }
                                            <Table.Cell>
                                                <Button  size='mini' icon='file pdf' color='green' onClick={this.show("large", application["userid"], "view", application["id"])} />
                                                <Link to={"/application/" + application["id"]}>
                                                    <Button  size='mini' icon='edit' color='violet' />
                                                </Link>
                                                <Link to={"/token/" + application["id"]} target="_blank">
                                                    <Button  size='mini' icon='print'  color='pink' title="Print Token Slip" />
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                        <Modal size={size} open={open} onClose={this.close} closeIcon>
                            <Modal.Header>View Slip</Modal.Header>
                            <Modal.Content>
                                <Document
                                    file={uploadedform}
                                    onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                                >
                                    <Page width="1038" pageNumber={pageNumber} />
                                </Document>
                                <p>Page {pageNumber} of {numPages}</p>
                                <button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber - 1 }))}>
                                    Prev page
                                </button>
                                <button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }))}>
                                    Next page
                                </button>
                                <a href={uploadedform} download="file.pdf">Download</a>
                                
                            </Modal.Content>
                        </Modal>
                    </Segment>
                    <Segment>
                        <Pagination totalPages={totalPages} siblingRange={1} onPageChange={this.setPageNum} />
                    </Segment>
                </Container>
            </Layout>    
        )
    }
}

export default InvoiceSlips