import request from './request';
import * as API from './api';
import * as http from './http';

const services = {
  ...request,
  ...API,
  ...http
};

export default services;