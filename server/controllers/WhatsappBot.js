import { google } from 'googleapis';
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const {
  SID: accountSid,
  KEY: TwilloAuthToken,
  APIKEY: googleApiKey,
  CX: cx
} = process.env;

twilio(accountSid, TwilloAuthToken);
const { MessagingResponse } = twilio.twiml;
const customsearch = google.customsearch('v1');

/**
 * @class WhatsappBot
 * @description class will implement bot functionality
 */
class WhatsappBot {
  /**
   * @memberof WhatsappBot
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async googleSearch(req, res, next) {
    const twiml = new MessagingResponse();
    const q = req.body.Body;
    if (q == "" || q.toLowerCase() == "start" ||  q.includes("buenas") ||  q.toLowerCase() == "hellow") {
      twiml.message("Saludo de respuesta automático: \n 1. *English* \n 2. *Español*");
      res.set('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    }
    if (q == "1") {
      twiml.message("You have selected English");
      res.set('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    }
    if (q == "2") {
      twiml.message("Haz seleccionado español.");
      res.set('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    }
    const options = { cx, q, auth: googleApiKey };

    try {
      const result = await customsearch.cse.list(options);
      const firstResult = result.data.items[0];
      const searchData = firstResult.snippet;
      const link = firstResult.link;

      twiml.message(`${searchData} ${link}`);

      res.set('Content-Type', 'text/xml');

      return res.status(200).send(twiml.toString());
    } catch (error) {
      return next(error);
    }
  }
}

export default WhatsappBot;
