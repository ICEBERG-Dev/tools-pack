const {post} = require("request");

/**
 * simple request to external endpoint
 * @param url path to file
 * @param form object of data for sending
 * @example
 * makeRequest(
 *      "https://somedamain.com/",
 *      {
 *          data: "some_data",
 *      }
 * )
 * */

const makeRequest = async (url, form) =>
    new Promise((resolve, reject) => {
        post({
            url: url,
            form: form,
        }, function (error, res, body) {
            resolve(res.body);
        })
    });


module.exports = {
    makeRequest
}