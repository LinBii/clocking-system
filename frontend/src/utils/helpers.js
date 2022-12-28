import axios from 'axios';
import Swal from 'sweetalert2';

const baseURL = 'http://localhost:3000';

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
  console.log(storeValue);
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
