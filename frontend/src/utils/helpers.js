import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import calendar from './../data/calendar.json';

const baseURL = 'https://punchin-serv.herokuapp.com';
// const baseURL = 'http://localhost:3000';

export const apiHelper = axios.create({
  baseURL,
});

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
});

export const storeCheck = (storeValue, storeState) => {
  let initialValue = null;
  if (storeValue && storeValue !== null) {
    try {
      initialValue = JSON.parse(storeValue);
    } catch (error) {
      console.error(error);
      initialValue = storeState;
    }
  } else {
    initialValue = storeState;
  }
  return initialValue;
};

const filteredCalendar = () => {
  return calendar.filter((entry) => entry.是否放假 === '2');
};

const date = localStorage.getItem('date');

export const isHoliday = filteredCalendar().some((entry) => {
  const year = entry.西元日期.substring(0, 4);
  const month = entry.西元日期.substring(4, 6);
  const day = entry.西元日期.substring(6, 8);

  const entryDate = dayjs(`${year}-${month}-${day}`).format(
    'YYYY-MM-DD 00:00:00'
  );
  return date === entryDate;
});
