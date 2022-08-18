import React, {Component} from 'react'
import {Menu, Dropdown, Icon, Header} from 'semantic-ui-react'

import {NavLink, Link} from 'react-router-dom'
import cookie from 'react-cookies'
import logo from "../public/img/computerking.png"

class TopHeader extends Component {
	state = {
		userid: "",
		username: ""
	}
	constructor () {
		super()
		this.logoutHandle = this.logoutHandle.bind(this)
	}

	componentDidMount() {
		if (cookie.load("userId")) {
			this.setState({userid: cookie.load("userId")})
			this.setState({username: cookie.load("username")})
		}
	}

	
	
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	logoutHandle = () => {
		cookie.remove('userId', { path: '/' })
		cookie.remove('username', { path: '/' })
	}

	render () {
		const { activeItem , userid, username} = this.state
		const Nav = props => (
		<NavLink
			exact
			{...props}
			activeClassName="active"
		/>
		);
		const usermenu = [
			{ key: 'editprofile', icon: 'user secret', text: 'Edit Profile', value: 'edit', as: Link, to: '/profile' },
			{ key: 'changepassword', icon: 'edit', text: 'Change Password', value: 'changepassword', as: Link, to: '/changepassword' },
			{ key: 'addamount', icon: 'rupee sign', text: 'Add Amount', value: 'addamount', as: Link, to: '/addamount' },
		]

		const trigger = (
			<span>
			  <Icon name='user' /> {cookie.load("username")}
			</span>
		  )

		return (
			<Menu>
				<Menu.Item header>
					<Header as='h1' color='red'>
						<Header.Content>Computer King</Header.Content>
					</Header>
				</Menu.Item>
				{
					username === "admin" &&
						<Menu.Menu>
							<Menu.Item as={Nav}
								name='memebers'
								to='/members'
								onClick={this.handleItemClick}
							>Members</Menu.Item>
							<Menu.Item as={Nav}
								name='requests'
								to='/requests'
								onClick={this.handleItemClick}
							>Applications</Menu.Item>
						</Menu.Menu>
				}
				{
					userid && userid !== undefined ? (						
						[
							<Menu.Menu position='right'>
								<Dropdown 
									trigger={trigger}
									className='link item' 
									options={usermenu}>
								</Dropdown>
								<Menu.Item as={Nav}
									name='logout'
									to='/'
									title="Logout"
									onClick={this.logoutHandle}
								><Icon name='sign-out' /></Menu.Item>
							</Menu.Menu>
						]
					) : (
						[
							<Menu.Item  as={Nav}
								to='/'
								name='home'
								active={activeItem === 'home'}
								onClick={this.handleItemClick}
							/>,
							<Menu.Item
								name='aboutUs'
								active={activeItem === 'aboutUs'}
								onClick={this.handleItemClick}
							/>,
							<Menu.Menu position='right'>
								<Menu.Item as={Nav}
									name='login'
									to='/login'
									onClick={this.handleItemClick}
								>Sign in</Menu.Item>
								<Menu.Item as={Nav}
									name='register'
									to='/register'
									onClick={this.handleItemClick}
								>Sign up</Menu.Item>
							</Menu.Menu>
						]
					)
				}
				
			</Menu>
		)
	}
}

export default TopHeader