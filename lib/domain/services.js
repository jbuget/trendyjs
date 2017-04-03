import Service from './service';

const services = {};

services.getAllServices = () => {
  return  Service.find().sort({ name: 'asc' }).exec();
};

services.getService = (serviceRef) => {
  return Service.findOne({ ref: serviceRef }).exec();
};

services.saveOrUpdateService = (service) => {
  const query = { 'ref': service.ref };
  return Service.findOneAndUpdate(query, service, { upsert: true }).exec();
};

export default services;
