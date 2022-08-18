create database govtapp;
use govtapp;
create table application (
  id int auto_increment primary key,
  userid int not null,
  panno varchar(255) default NULL,
  addresstype varchar(255) default NULL,
  customername varchar(255) default NULL,
  relationship varchar(255) default NULL,
  relationshipname varchar(255) default NULL,
  fathername varchar(255) default NULL,
  village varchar(255) default NULL,
  aadharno varchar(16) default NULL,
  postoffice varchar(255) default NULL,
  mobileno varchar(255) default NULL,
  tehsil varchar(255) default NULL,
  dateofbirth date,
  district varchar(255) default NULL,
  gender varchar(255) default NULL,
  state varchar(255) default NULL,
  emailid varchar(255) default NULL,
  pincode varchar(255) default NULL,
  govtid JSON,
  status enum("approved","pending","rejected"),
  flag enum ("N","Y"),
  created datetime,
  modified timestamp
);
alter table application add userid int not null after id;

create table offlineform (
  id int auto_increment primary key,
    userid int,
    form JSON,
    created datetime default now(),
    flag enum ("N", "Y"),
    status enum("approved", "rejected", "pending")
);
create table members (
  id int auto_increment primary key,
  username varchar(200) not null,
  email varchar(200) not null,
  password varchar(200) not null,
  mobile varchar(20),
  flag enum("N", "Y"),
  created datetime default now()
);

create table invoiceslip (
  id int auto_increment primary key,
    userid int not null,
    invoicefile JSON
);

select * from application;
select * from offlineform;
select * from members;
select * from invoiceslip;





