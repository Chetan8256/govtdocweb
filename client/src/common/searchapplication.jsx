import React, {Component} from 'react'
import {Segment, Form, Button, Input} from 'semantic-ui-react'
import * as Constants from '../common/constants'

class SearchApplication extends Component {
    state = {
        tokenno: "",
        server: Constants.setServer.server,
        applications: []
    }

    tokenno = (e, {value}) => {
        this.setState({tokenno: value})
    }

    onSearchSubmit = async (e) => {
        this.setState({loader: true})
        let dataObj = {
            where: {
                token: this.state.tokenno
            }
        }
        
        fetch("http://" + this.state.server + "/api/applications?filter=" + JSON.stringify(dataObj))
		.then(res => res.json())
		.then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    applications: result,
                    totalPages: result.length / this.state.itemsPerPage
                
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
    
    render() {
        const {tokenno} = this.state
        return (
            <Segment>
                <Form onSubmit={this.onSearchSubmit}>
                    <Form.Field
                        control={Input}
                        placeholder='Token No'
                        required
                        onChange={this.tokenno}
                        value={tokenno}
                    />
                    <Button type='submit'>Submit</Button>
                </Form>
            </Segment>
        )
    }
}

export default SearchApplication