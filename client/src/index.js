import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/uploadpdf" element={<OfflineApplication />} />
      <Route path="/application/:application" element={<Application />} />
      <Route path="/requests" element={<RequestLists />} />
      <Route path="/notification" element={<ViewSlip />} />
      <Route path="/members" element={<Members />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/invoices" element={<InvoiceSlips />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/addamount" element={<AddAmount />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/token/:applicationid" element={<PrintInvoice />} />
    </Routes>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
