import React, {Component} from 'react'
import { Grid, Segment, Image, List, Container, Header,Divider, Card } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { withRouter } from '../utils/withRouter'
import Cookies from 'js-cookie'
import Layout from "../components/Layout";
import banner from "../public/img/banner/ban-3.png"
import adhaarcard from "../public/img/aadhaarcard.jpg"
import irctc from "../public/img/IRCTC.jpg"
import moneytransfer from "../public/img/moneytransfer.jpg"
import pancard from "../public/img/pancard.jpg"
import passport from "../public/img/passport.jpg"
import recharge from "../public/img/recharge.jpg"
import airticket from "../public/img/airticket.jpg"
import aeps from "../public/img/aeps.jpg"


class Main extends Component {
    state = {
        
    }

    constructor(){
        super()
        this.onSubmit.bind(this)
    }   

    componentDidMount() {
        if (Cookies.get('userId')) {
            this.props.navigate('/dashboard')
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onSubmit = (page) => () => {
        this.props.navigate('/' + page)
    }
    
    render() {
        const { activeItem } = this.state
        const Nav = props => (
            <NavLink
                exact
                {...props}
                activeClassName="active"
            />
        );
        return (
            <Layout>
                <Segment style={{background:"slategrey"}}>
                    <Grid columns={2}>
                        <Grid.Row stretched>
                            <Grid.Column width={11}>
                                <Image src={banner} />
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Segment>
                                <Header as='h2' color='red' dividing textAlign='center'>
                                    <Header.Content>Latest Updates</Header.Content>                                    
                                </Header>
                                <marquee direction = "up">
                                    <p style={{fontType:"bold"}}>कृपया हमारी कंपनी का सदस्य बनने के लिए रजिस्टर करें, अगर कोई प्रॉब्लम आये तो कृपया ग्राहक सहायता नंबर पर कॉल करें |</p>
                                    <Divider />
                                    <p>हम आपको 7 दिनों में पैन कार्ड सर्विस प्राप्त कराते है !</p>
                                    <Divider />
                                    <p>प्रिये आपकी बेहतर सुबिधा के लिए हम अपने पोर्टल को प्रतिदिन अपडेट करते है |</p>
                                    <Divider />
                                    <p>प्रिये अगर कोई शिकायत या सुझाव है तो हमें मेल करे computerking4uguru@gmail.com</p>
                                    <Divider />
                                </marquee>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Container>
                    <Segment style={{background:"lightsteelblue"}}>
                        <Header as='h2' dividing textAlign='center'>
                            <Header.Content>Our Services</Header.Content>
                        </Header>
                        <Grid container columns={4}>
                            <Grid.Row stretched>
                                <Grid.Column>
                                    <Segment><Image src={pancard} width="216px" height="197px" /></Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={moneytransfer}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={adhaarcard}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={recharge}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row stretched>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={irctc}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={passport}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={airticket}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <Image src={aeps}  width="216px" height="197px" />
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Container>
                <Segment style={{background:"lightblue", paddingBottom: 0}}>
                    <Grid columns={4} divided>
                            <Grid.Row stretched>
                                <Grid.Column>
                                        <Header as='h3' textAlign='center'>
                                            <Header.Content>About Us</Header.Content>
                                        </Header>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as='h3' textAlign='center'>
                                        <Header.Content>Important Links</Header.Content>
                                    </Header>
                                    <Segment vertical>
                                        <a rel="noopener noreferrer" href="https://www.irctc.co.in/eticketing/loginHome.jsf" target="_blank">IRCTC</a>
                                    </Segment>
                                    <Segment vertical>
                                        <a rel="noopener noreferrer" href="https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html" target="_blank">E-Pancard</a>
                                    </Segment>
                                    <Segment vertical>
                                        <a rel="noopener noreferrer" href="https://tin.tin.nsdl.com/pantan/StatusTrack.html" target="_blank">PAN Track Status</a>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as='h3' textAlign='center'>
                                        <Header.Content>Contact Info</Header.Content>
                                    </Header>
                                    <List as='ol'>
                                        <List.Item as='li' value='*'>Computer King</List.Item>
                                        <List.Item as='li' value='*'>computerking4uguru@gmail.com</List.Item>
                                        <List.Item as='li' value='*'>+91- 8059293966</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column>
                                    <Header as='h3' textAlign='center'>
                                        <Header.Content>Bank Details</Header.Content>
                                    </Header>
                                    <Card>
                                        <Card.Content>
                                            <Card.Header content='A/C Holder Name: Vinod Kumar' />
                                            <Card.Meta content='A/c No: 50200036976941' />
                                            <Card.Description content='IFSC Code: HDFC0000195' />
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                </Segment>
            </Layout>
        )
    }
}

export default withRouter(Main)
