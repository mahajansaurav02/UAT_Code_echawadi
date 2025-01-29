import BaseURL from '@/URLs/urls';
import axios from 'axios';

const pURL = `${BaseURL}/landRevenue/generateRevenue`;

export async function getRevenueData() {}
const data = JSON.stringify({
  cCode: '270700040070010000',
});

var config = {
  method: 'post',
  url: `${BaseURL}/landRevenue/generateRevenue`,
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
