import React, {Component} from 'react'
import { Container, Segment } from 'semantic-ui-react';
import Layout from "../components/Layout";
import Cookies from 'js-cookie'
import * as Constants from '../common/constants'
import { withRouter } from '../utils/withRouter';

class ViewSlip extends Component {

    state = {
        server: Constants.setServer.server,
        filename: "",
        numPages: null,
        pageNumber: 1,
        content: ""
    }

    componentDidMount() {
        if ( ! Cookies.get("userId")) {
            this.props.navigate("/login")
        }
        
        let data = {
            userid: Cookies.get ("userId"),
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

export default withRouter(ViewSlip)
