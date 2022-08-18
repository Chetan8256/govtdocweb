import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
//import App from './App';
import RequestLists from './pages/requestslist';
import Application from './pages/application';
import OfflineApplication from './pages/offlineapplication';
//import * as serviceWorker from './serviceWorker';
import Register from './pages/register';
import Login from './pages/login';
import ViewSlip from './pages/viewslip';
import Main from './pages/main';
import Members from './pages/members';
import Transactions from './pages/transaction';
import Dashboard from './pages/dashboard';
import InvoiceSlips from './pages/invoiceslips';
import PrintInvoice from './pages/tokeninvoice';
import AddAmount from './pages/addamount';
import Profile from './pages/profile';
import ChangePassword from './pages/changepassword';

const routing = (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/uploadpdf" component={OfflineApplication} />
        <Route path="/application/:application" component={Application} />
        <Route path="/requests" component={RequestLists} />
        <Route path="/notification" component={ViewSlip} />
        <Route path="/members" component={Members} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/invoices" component={InvoiceSlips} />
        <Route path="/profile" component={Profile} />
        <Route path="/addamount" component={AddAmount} />
        <Route path="/changepassword" component={ChangePassword} />
        <Route path="/token/:applicationid" target="_blank" component={PrintInvoice} />
      </Switch>
    </Router>
  )
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
