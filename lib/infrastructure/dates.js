import moment from 'moment';

function today() {
  return moment().startOf('date').toDate();
}

function tomorrow() {
  return moment().add(1, 'days').startOf('date').toDate();
}

export default { today, tomorrow };