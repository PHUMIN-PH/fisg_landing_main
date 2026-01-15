'use strict';
const Service = require('egg').Service;
const { log } = require('console');
const crypto = require('crypto');

// This is mini document for this api
// 1. sendCheckPoints is 'function use for check the right user'
//         endPoints: /points/activity?
//         total_points is คะแนนรวมจะเปลี่ยนแปลงไปตามช่วงเวลา (ค่าบวกหมายถึงได้รับ ค่าลบหมายถึงใช้ไป)
// 2. sendResetPoints is 'function use for send reset points when registered'
//         endPoints: /points/reset?
//         range_points is คะแนนรวมเปลี่ยนแปลงในช่วงเวลาที่กำหนด (ค่าที่ใช้ในการหักล้าง)
//         recalculated_total is คะแนนรวมของผู้ใช้หลังจากรีเซ็ต
//       การเก็บ
//         - range_points and recalculated_total


class CrmPointService extends Service {
  async sendCheckPoints({ email, user_id }) {
    const { ctx, app } = this;

    const unix = Date.now();
    // const unix = '1768215556108';
    const present = new Date();

    // const start_date = new Date(present.getFullYear(), present.getMonth(), 1);
    const startDate = new Date(present.getFullYear(), present.getMonth(), 1);

    const formatDate = d => d.toISOString().slice(0, 10); // YYYY-MM-DD

    const startTime = formatDate(startDate);
    const endTime = formatDate(present);

    // const startTime = "2025-12-01";
    // const endTime = "2025-12-08";

    const isMallCrmKey = app.config.crm.apiPointsKey;

    const source = `crm_user_id=${user_id}&email=${email}&end_time=${endTime}&start_time=${startTime}`;

    //sign (md5)
    const sign = crypto
      .createHash('md5')
      .update(`${source}&${unix}&${isMallCrmKey}`)
      .digest('hex');

    // console.log("SIGN IS : ", sign);
    // console.log("UNIX IS : ", unix);

    const url = 'https://pma.isgfin.com/crm/points/activity?' + "crm_user_id=" + user_id + "&email=" + email + "&start_time=" + startTime + "&end_time=" + endTime;
    //call CRM API
    // console.log("URL IS : ", url);

    const res = await ctx.curl(url,
      {
        method: 'GET',
        headers: {
          unix,
          sign,
          Accept: 'application/json',
        },
        dataType: 'json',
        timeout: 5000,
      });

    return res.data;
  }

  async sendResetPoints({ email, user_id }) {
    const { ctx, app } = this;

    const unix = Date.now();
    const present = new Date();

    // const start_date = new Date(present.getFullYear(), present.getMonth(), 1);
    const startDate = new Date(present.getFullYear(), present.getMonth(), 1);

    const formatDate = d => d.toISOString().slice(0, 10); // YYYY-MM-DD

    const startTime = formatDate(startDate);
    const endTime = formatDate(present);

    // const startTime = "2025-12-01";
    // const endTime = "2025-12-08";

    const isMallCrmKey = app.config.crm.apiPointsKey;

    const body = {
      email: email,
      start_time: startTime,
      end_time: endTime,
      operator: email,
    };

    const signSource = Object.keys(body)
      .sort()
      .map(k => `${k}=${body[k]}`)
      .join('&');

    const sign = crypto
      .createHash('md5')
      .update(`${signSource}&${unix}&${isMallCrmKey}`)
      .digest('hex');

    // const source = `email=${email}&end_time=${endTime}&operator=${email}&start_time=${startTime}`;
    // console.log("SOURCE : ", source);
    // console.log("KEY : ", isMallCrmKey);
    //sign (md5)
    // const sign = crypto
    //   .createHash('md5')
    //   .update(`${source}&${unix}&${isMallCrmKey}`)
    //   .digest('hex');

    // const body = {
    //   email: email || "",
    //   startTime,
    //   endTime,
    //   operator: email,
    // };

    const res = await ctx.curl('https://pma.isgfin.com/crm/points/reset', {
      method: 'POST',
      headers: {
        unix,
        sign,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: body,
      dataType: 'json',
      timeout: 5000,
    });

    return res.data;
  }

  async redeemCheck({ email, user_id }) {
    const { ctx, app } = this;

    const unix = Date.now();
    const present = new Date();

    const startDate = new Date(present.getFullYear(), present.getMonth(), 1);
    const formatDate = d => d.toISOString().slice(0, 10); // YYYY-MM-DD

    const startTime = formatDate(startDate);
    const endTime = formatDate(present);
    // const startTime = '2026-01-01';
    // const endTime = '2026-01-10'

    const isMallCrmKey = app.config.crm.apiPointsKey;

    // const body = {
    //   crm_user_id: user_id,
    //   email: email,
    //   start_time: startTime,
    //   end_time: endTime,
    // };
    
    // const signSource = Object.keys(body)
    //   .sort()
    //   .map(k => `${k}=${body[k]}`)
    //   .join('&');

    const source = `crm_user_id=${user_id}&email=${email}&end_time=${endTime}&start_time=${startTime}`;
    // console.log(source);

    const sign = crypto
      .createHash('md5')
      .update(`${source}&${unix}&${isMallCrmKey}`)
      .digest('hex');

    const url = 'https://pma.isgfin.com/crm/orders/active?' + "crm_user_id=" + user_id + "&email=" + email + "&start_time=" + startTime + "&end_time=" + endTime;

    const res = await ctx.curl(url, {
      method: 'GET',
      headers: {
        unix,
        sign,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      dataType: 'json',
      timeout: 5000,
    });

    return res.data;
  }

  async createOverlapping({ email, ipAddress, status, solveBy }) {
    const { ctx } = this;

    const record = await ctx.model.Overlapping.create({
      email,
      ip_address: ipAddress || ctx.ip,
      status: status || 'PENDING',
      solve_by: solveBy || 'system',
      created_at: new Date(),
      modify_datetime: null,
    });

    return record;
  }
}

module.exports = CrmPointService;


// curl -X POST "https://pma.isgfin.com/crm/points/reset" \
//   -H "Content-Type: application/json" \
//   -H "sign: a7cfb0e02aabcbba04cbc45d0aecf756" \
//   -H "unix: 1768215556108" \
//   -d '{
//     "crm_user_id": "",
//     "email": "phuwis.dev@gmail.com",
//     "start_time": "2025-12-01",
//     "end_time": "2025-12-08",
//     "operator": "admin"
//   }'
