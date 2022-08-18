import React, {Component} from 'react'
import { Container, Grid, Form, Input, Select,Button, Segment, Message } from 'semantic-ui-react';
import Layout from "../components/Layout";
import cookie from "react-cookies"
import * as Constants from '../common/constants'

class OfflineApplication extends Component {
    state = {
        pdf: "",
        size: "",
        type: "",
        inputKey: Date.now(),
        name: "",
        server: Constants.setServer.server,
        alert: {
			message: "",
			type: "",
			display: false
		}
    }

    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
    }

    onUpload = (event) => {
        if (event.target.files[0]) {
            let reader = new FileReader();
            let file = event.target.files[0];
            this.setState({size: (file.size/1024/1024).toFixed(2)})
            this.setState({name: file.name})
            this.setState({type: file.type})
            
            reader.onloadend = (file) => {
                this.setState({pdf: reader.result});
            }
            reader.readAsDataURL(file)
        }
        
    }

    onSubmit = async (e) => {
        e.preventDefault()
        console.log(this.state.size)
        let data = {
            form: {
                content: this.state.pdf,
                name: this.state.name,
                size: this.state.size,
                type: this.state.type
            },
            flag: "N",
            status: "pending",
            userid: 12
        }

        fetch("http://" + this.state.server + "/api/offlineforms/uploadOfflineForm", {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert 
                console.log(result.message.id)
                if (result.message.id) {                                 
                    alert["message"] = "Thanks for sharing your information with us."
                    alert["type"] = "green"
                    alert["display"] = true
                } else {                                    
                    alert["type"] = "red"
                    alert["display"] = false
                    alert["message"] = "There is some problem with the file. Please re-check and upload again."				
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
        this.setState({inputKey: Date.now()})
    }

    render () {
        const {alert, inputKey} = this.state

        return (
            <Layout>
                <Container>
                    <Grid>
                        <Grid.Column>
                            <Segment>
                                <h3>Please Upload offline Form</h3>
                            </Segment>
                            <Segment>
                                {
                                    alert.display == true &&
                                    <Message size='tiny' color={alert["type"]} onDismiss={this.handleDismiss}>
                                        <Message.Header>{alert["message"]}</Message.Header>
                                    </Message>
                                }

                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group widths='equal'>
                                        
                                        <Form.Input type= "file" id="file" name="file" hidden fluid label='Upload Form' onChange={(event) => this.onUpload(event)} key={inputKey}/>
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Button color='orange' floated='right'>Submit</Form.Button>
                                    </Form.Group>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </Container>
            </Layout>
        )
    }
}

export default OfflineApplication