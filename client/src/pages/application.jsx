import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import { Container, Grid, Form, Input, Header, Segment, Message, Dimmer, Loader } from 'semantic-ui-react';
import Layout from "../components/Layout";
import { DateInput } from 'semantic-ui-calendar-react';
import cookie from 'react-cookies'
import cryptoRandomString from 'crypto-random-string';

import * as Constants from '../common/constants'

const applicantTitle = [
    { key: 'Mr.', text: 'Mr.', value: 'Mr.' },
    { key: 'Mrs.', text: 'Mrs.', value: 'Mrs.' },
    { key: 'Miss', text: 'Miss', value: 'Miss' },
]

class Application extends Component {
    state = {
		error: null,
		isLoaded: false,
		value: "",
		alert: {
			message: "",
			type: "",
			display: false
        },
        loader: false,
        visible: true,
        //pannovisible: true,
        selectedValue: [],
        panno: "",
		fathername: "",
		village: "",
		aadharno: "",
        postoffice: "",
        tehsil: "",
        dateofbirth: "",
        district: "",
        gender: "",
        state: "",
        emailid: "",
        pincode: "",
        applicanttitle: "",
        firstname: "",
        middlename: "",
        lastname: "",
        cardname: "",
        mobileno: "",
        pandeliverystate: "",
        address: "",
        form: {
            name: "",
            size: "",
            type: "",
            content: ""
        },
        invoiceview: false,
        invoiceInfo: "",
        server: Constants.setServer.server,
        status: "",
        inputKey: Date.now(),
        applicationid: null,
        fields: ["panno", "applicanttitle","firstname","middlename","lastname","fathername","dateofbirth","cardname","aadharno","mobileno","emailid","address","village","pandeliverystate","postoffice","tehsil","district","state","pincode"]
    };
    constructor(){
        super()
    }
    
    componentDidMount() {
        if ( ! cookie.load("userId")) {
            this.props.history.push("/login")
        }
        const { match: { params } } = this.props
        
        if (params.application !== "update" && params.application !== "new") {
            let data = {
                where: {
                    id: params.application
                }
            }
    
            fetch("http://" + this.state.server + "/api/applications?filter=" + JSON.stringify(data))
            .then(res => res.json())
            .then(
                (result) => {
                    let aocode = result[0]["aocode"].split("-")
                    this.state.fields.map( field =>
                        [
                            this.setState({[field]: result[0][field]}),
                            this.setState({aocode1: aocode[0], aocode2: aocode[1], aocode3: aocode[2], aocode4: aocode[3]}),
                            this.setState({applicationid: result[0]["id"]})
                        ]
                        
                    )
                },
                (error) => {
                    console.log(error)
                }
            )
        } else {
            console.log("else condition")
            this.setState({application: params.application})
            this.clearFormInputs()
        }
    }
    
    aocode1Change = (e, {value}) => {
        this.setState({aocode1: value})
    }
    aocode2Change = (e, {value}) => {
        this.setState({aocode2: value})
    }
    aocode3Change = (e, {value}) => {
        this.setState({aocode3: value})
    }
    aocode4Change = (e, {value}) => {
        this.setState({aocode4: value})
    }
    applicanttitleChange = (e, {value}) => {
        this.setState({applicanttitle: value})
    }
    pincodeChange = (e, {value}) => {
        this.setState({pincode: value})
    }
    mobilenoChange = (e, {value}) => {
        this.setState({mobileno: value})
    }

    emailChange = (e, {value}) => {
        this.setState({emailid: value})
    }
    stateChange = (e, {value}) => {
        this.setState({state: value})
    }
    districtChange = (e, {value}) => {
        this.setState({district: value})
    }
    dateofbirthChange = (e, {value}) => {
        this.setState({dateofbirth: value})
    }
    tehsilChange = (e, {value}) => {
        this.setState({tehsil: value})
    }
    postOfficeChange = (e, {value}) => {
        this.setState({postoffice: value})
    }
    aadharNoChange = (e, {value}) => {
        this.setState({aadharno: value})
    }
    villageChange = (e, {value}) => {
        this.setState({village: value})
    }
    fatherNameChange = (e, {value}) => {
        this.setState({fathername: value})
    }
    firstnameChange = (e, {value}) => {
        this.setState({firstname: value})
    }
    middlenameChange = (e, {value}) => {
        this.setState({middlename: value})
    }
    lastnameChange = (e, {value}) => {
        this.setState({lastname: value})
    }
    panNoChange = (e, {value}) => {
        this.setState({panno: value})
    }
    cardnameChange = (e, {value}) => {
        this.setState({cardname: value})
    }
    mobilenoChange = (e, {value}) => {
        this.setState({mobileno: value})
    }
    addressChange = (e, {value}) => {
        this.setState({address: value})
    } 
    pandeliverystateChange = (e, {value}) => {
        this.setState({pandeliverystate: value})
    } 

    validate = () => {
		let alert = this.state.alert
		if(this.state.formFields.sectionId === "") {
			alert["message"] = "Please enter SectioId"
			alert["type"] = "negative"
			this.setState({alert})
			return false
		} else {
			let alert = this.state.alert
			alert["display"] = false
			return true
		}
    }
    
    onUpload = (event) => {
        let reader = new FileReader();
        let file = event.target.files[0];

        let form = this.state.form
        if (file) {
            form["name"] = file.name
            form["type"] = file.type
            form["size"] = (file.size/1024/1024).toFixed(2)

            reader.onloadend = (file) => {
                form["content"] = reader.result
            }
            reader.readAsDataURL(file)
            
            this.setState({form})
        }
        
    }


    onSubmit = async (e) => {
		e.preventDefault()
        this.setState({loader: true})
        let dataObj = {
            status: "pending",
            flag: "N",
            userid: cookie.load("userId"),
            aocode: this.state.aocode1 + "-" + this.state.aocode2 + "-" + this.state.aocode3 + "-" + this.state.aocode4,
            form: this.state.form
        }

        this.state.fields.map(field =>
            dataObj[field] = this.state[field]
        )
        if (this.state.applicationid) {
            dataObj["id"] = this.state.applicationid;    
        }
        dataObj["token"] = cryptoRandomString({length: 6});
        
        this.postApplicationData(dataObj)
	}

    postApplicationData = (dataObj) => {
        
        fetch("http://" + this.state.server + "/api/applications/addApplication", {
			method: 'POST',
			body: JSON.stringify(dataObj),
			headers: {'Content-Type':'application/json'}
		})
		.then(res => res.json())
		.then(
			(result) => {
                let alert = this.state.alert 
                if (result && result.message && result.message.id) {                                 
                    alert["message"] = "Thanks for sharing your information with us."
                    alert["type"] = "green"
                    alert["display"] = true
                    this.setState({invoiceview: true, invoiceInfo: result.message.id})
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
        this.state.fields.map(field =>
            this.setState({[field]: ""})
        )
        this.setState({aocode1: "", aocode2: "", aocode3: "", aocode4: ""})
        this.setState({inputKey: Date.now()})
    }
    
    render () {
        const {loader, application, applicationid, tokeno, alert, inputKey,panno, aocode1, aocode2, aocode3, aocode4,applicanttitle,firstname,middlename, lastname,cardname, pandeliverystate, address,fathername,village,aadharno,postoffice,mobileno,tehsil,dateofbirth,district,gender,state,emailid,pincode, invoiceview, invoiceInfo} = this.state
        const genderOptions = [
            { key: 'm', text: 'Male', value: 'male' },
            { key: 'f', text: 'Female', value: 'female' },
            { key: 'o', text: 'Other', value: 'other' },
        ]
        //const {application} = this.props.match.params
        
        const relationshipOptions = [
            { key: 'mr.', text: 'Mr.', value: 'mr.' },
            { key: 'mrs.', text: 'Mrs.', value: 'mrs.' },
            { key: 'miss', text: 'Miss', value: 'miss' },
        ]

        return (
            <Layout>
                <Container>
                    <Grid>
                        <Grid.Column>
                            <Segment>
                                <Header as='h2'>Please Fill application Form</Header>
                            </Segment>
                            <Segment>
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
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group widths='equal'>
                                        {
                                            (application === "update") && 
                                            <Form.Field
                                                control={Input}
                                                label='Pan Number'
                                                placeholder='Pan Number'
                                                required
                                                onChange={this.panNoChange}
                                                value={panno}
                                            />
                                        }
                                        {
                                            (applicationid) && 
                                            <Form.Field
                                                control={Input}
                                                type="hidden"
                                                placeholder='xxx'
                                                value={applicationid}
                                                width={1}
                                            />
                                        }
                                        {
                                            (application === "new") && 
                                            [
                                                <Form.Field
                                                    control={Input}
                                                    label='Ao Code'
                                                    placeholder='xxx'
                                                    required
                                                    onChange={this.aocode1Change}
                                                    value={aocode1}
                                                    width={3}
                                                />,
                                                <Form.Field
                                                    control={Input}
                                                    label=''
                                                    placeholder='xxx'
                                                    required
                                                    onChange={this.aocode2Change}
                                                    value={aocode2}
                                                    width={3}
                                                />,
                                                <Form.Field
                                                    control={Input}
                                                    label=''
                                                    placeholder='xxx'
                                                    required
                                                    onChange={this.aocode3Change}
                                                    value={aocode3}
                                                    width={3}
                                                />,
                                                <Form.Field
                                                    control={Input}
                                                    label=''
                                                    placeholder='xxx'
                                                    required
                                                    onChange={this.aocode4Change}
                                                    value={aocode4}
                                                    width={3}
                                                />
                                            ]
                                        }
                                        <Form.Select
                                            label='Applicant Title'
                                            placeholder='Applicant Title'
                                            options={applicantTitle}
                                            required
                                            onChange={this.applicanttitleChange}
                                            value={applicanttitle}
                                        />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Field
                                            control={Input}
                                            label='First Name'
                                            placeholder='First Name'
                                            required
                                            onChange={this.firstnameChange}
                                            value={firstname}
                                        />
                                        
                                        <Form.Field
                                            control={Input}
                                            label='Middle Name'
                                            placeholder='Middle Name'
                                            onChange={this.middlenameChange}
                                            value={middlename}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Last Name'
                                            placeholder='Last Name'
                                            onChange={this.lastnameChange}
                                            value={lastname}
                                        />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Field
                                            control={Input}
                                            label='Father Name'
                                            placeholder='Father Name'
                                            required
                                            onChange={this.fatherNameChange}
                                            value={fathername}
                                        />
                                        <DateInput
                                            name="date"
                                            placeholder="Date"
                                            label='Date of Birth'
                                            value={this.state.date}
                                            iconPosition="left"
                                            dateFormat="YYYY-MM-DD"
                                            value = {new Date(dateofbirth).toLocaleDateString()}
                                            onChange={this.dateofbirthChange}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Card Name'
                                            placeholder='Card Name'
                                            onChange={this.cardnameChange}
                                            required
                                            value={cardname}
                                        />
                                    </Form.Group>     
                                    <Form.Group widths='equal'>
                                        <Form.Field
                                            control={Input}
                                            label='Aadhaar Number'
                                            placeholder='Aadhaar Number'
                                            required
                                            onChange={this.aadharNoChange}
                                            value={aadharno}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Mobile Number'
                                            placeholder='Mobile Number'
                                            onChange={this.mobilenoChange}
                                            value={mobileno}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Email ID'
                                            placeholder='Email Id'
                                            required
                                            onChange={this.emailChange}
                                            value={emailid}
                                        />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Field
                                            control={Input}
                                            label='Pan Delivery State'
                                            placeholder='Pan Delivery State'
                                            required
                                            onChange={this.pandeliverystateChange}
                                            value={pandeliverystate}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='House No/Building/Landmark'
                                            placeholder='House No/Building/Landmark'
                                            required
                                            onChange={this.addressChange}
                                            value={address}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Village'
                                            placeholder='Village'
                                            required
                                            onChange={this.villageChange}
                                            value={village}
                                        />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Field
                                            control={Input}
                                            label='Post Office'
                                            placeholder='Post Office'
                                            required
                                            onChange={this.postOfficeChange}
                                            value={postoffice}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Tehsil'
                                            placeholder='Tehsil'
                                            required
                                            onChange={this.tehsilChange}
                                            value={tehsil}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='District'
                                            placeholder='District'
                                            required
                                            onChange={this.districtChange}
                                            value={district}
                                        />
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        {/*}                                       
                                        <Form.Field
                                            control={Select}
                                            options={genderOptions}
                                            label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
                                            placeholder='Gender'
                                            search
                                            searchInput={{ id: 'form-select-control-gender' }}
                                            required
                                            onChange={this.genderChange}
                                            value={gender}
                                    />*/}
                                        <Form.Field
                                            control={Input}
                                            label='State'
                                            placeholder='State'
                                            required
                                            onChange={this.stateChange}
                                            value={state}
                                        />
                                        <Form.Field
                                            control={Input}
                                            label='Pincode'
                                            placeholder='Pincode'
                                            required
                                            onChange={this.pincodeChange}
                                            value={pincode}
                                        />
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

export default Application