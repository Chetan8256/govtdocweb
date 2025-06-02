import React from 'react'
import {Grid, Container, Segment} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import TopHeader from './Header'
import LeftBar from './LeftBar'
import '../public/css/knimbus.css'
import Cookies from 'js-cookie'

export default props => {
	let userid = Cookies.get("userId")
	let username = Cookies.get("username")

	return  (
		<div>
			<TopHeader></TopHeader>
			<Grid divided='vertically'>
				{
					userid && username !== "admin" ? (
						<Grid.Row columns={2}>
							<Grid.Column width={3}>
								<LeftBar></LeftBar>			        
							</Grid.Column>
							<Grid.Column width={13}>
								{props.children}
							</Grid.Column>
						</Grid.Row>
					) : username !== "admin" ? (
						<Grid.Row columns={1}>
							<Grid.Column>
								{props.children}
							</Grid.Column>
						</Grid.Row>
					) : (
						<Container fluid>
							{props.children}
						</Container>
					)
					
				}
			</Grid>
		</div>
	)
}
