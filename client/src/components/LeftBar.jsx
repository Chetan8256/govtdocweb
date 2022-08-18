import React, {Component} from 'react'
import {Dropdown, Icon, Input, Menu } from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'
import Dashboard from '../pages/dashboard';
import InvoiceSlips from '../pages/invoiceslips';


class LeftBar extends Component {
	state = {}


	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	render () {
		const { activeItem } = this.state
		const Nav = props => (
		<NavLink
			exact
			{...props}
			activeClassName="active"
		/>
		);
		return (
			<Menu vertical>

				<Menu.Item>
					<Input placeholder='Search...' />
				</Menu.Item>
				<Menu.Item 
					as={Nav} to="/dashboard" 
					name='dashboard'
					active={activeItem === 'dashboard'}
					onClick={this.handleItemClick}
				>
					Dashboard
				</Menu.Item>
				{/*
				<Menu.Item name='browse' active={activeItem === 'browse'} onClick={this.handleItemClick}>
					<Icon name='grid layout' />
					Browse
				</Menu.Item>
				*/}
				<Dropdown item text='Application'>
					<Dropdown.Menu>
					<Dropdown.Item icon='edit' text='Update Pan Info' as={Nav} to="/application/update" onClick={this.handleItemClick}/>
					<Dropdown.Item icon='globe' text='New Pan Form' as={Nav} to="/application/new" onClick={this.handleItemClick}/>
					{/*<Dropdown.Item icon='settings' text='Account Settings' />*/}
					</Dropdown.Menu>
				</Dropdown>

				{/*<Menu.Item name='uploadpdf' active={activeItem === 'uploadpdf'} as={Nav} to="/uploadpdf" conClick={this.handleItemClick}>
					Upload PDF
			</Menu.Item>*/}

				<Menu.Item 
					as={Nav} to="/invoices" 
					name='invoices'
					active={activeItem === 'invoices'}
					onClick={this.handleItemClick}
				>
					InvoiceSlips
				</Menu.Item>
				<Menu.Item 
					as={Nav} to="/notification" 
					name='notification'
					active={activeItem === 'notification'}
					onClick={this.handleItemClick}
				>
					Notification
				</Menu.Item>
				<Menu.Item 
					as={Nav} to="/transactions" 
					name='transactions'
					active={activeItem === 'transactions'}
					onClick={this.handleItemClick}
				>
					Transactions
				</Menu.Item>
				
			</Menu>
		)
	}
}

export default LeftBar