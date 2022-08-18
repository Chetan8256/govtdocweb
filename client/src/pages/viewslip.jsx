import React, {Component} from 'react'
import { Container, Segment } from 'semantic-ui-react';
import Layout from "../components/Layout";
import cookie from 'react-cookies'
import * as Constants from '../common/constants'

class ViewSlip extends Component {

    state = {
        server: Constants.setServer.server,
        filename: "",
        numPages: null,
        pageNumber: 1,
        content: ""
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
        
        let data = {
            userid: cookie.load("userId"),
        }
        
        
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
        
    }

    render() {
        const { pageNumber, numPages, content} = this.state
                
        return (
            <Layout>
                <Container>
                    <Segment>
                        
                    </Segment>
                </Container>
            </Layout>    
        )
    }
}

export default ViewSlip