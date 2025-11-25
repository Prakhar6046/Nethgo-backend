import nodemailer from "nodemailer";
import { Response } from "express";
import { CarDriverResponse } from "../../types/carDriverTypeModel";
import transporter from "../../utils/emailTransporter";
require("dotenv").config();



const SendDriverAcceptanceEmailToHotel = async (
  hotelEmail: string,
  driverInfo:CarDriverResponse,
  res: Response
) => {
  try {
    let mailOptions = {
      from: process.env.MAIL_FROM,
      to: hotelEmail,
      subject: "Driver Assegnato per la Tua Richiesta ✅",
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Driver Acceptance Notification</title>
          <style>
            @media only screen {
              html { min-height: 100%; background: #f4f7fa; }
            }
            @media only screen and (max-width: 596px) {
              .small-float-center { margin: 0 auto !important; float: none !important; text-align: center !important; }
              .small-text-center { text-align: center !important; }
              .small-text-left { text-align: left !important; }
              .small-text-right { text-align: right !important; }
              .hide-for-large { display: block !important; width: auto !important; overflow: visible !important; max-height: none !important; font-size: inherit !important; line-height: inherit !important; }
              table.body table.container .hide-for-large, table.body table.container .row.hide-for-large { display: table !important; width: 100% !important; }
              table.body table.container .callout-inner.hide-for-large { display: table-cell !important; width: 100% !important; }
              table.body table.container .show-for-large { display: none !important; width: 0; mso-hide: all; overflow: hidden; }
              table.body img { width: auto; height: auto; }
              table.body center { min-width: 0 !important; }
              table.body .container { width: 95% !important; }
              table.body .columns, table.body .column { height: auto !important; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-sizing; padding-left: 16px !important; padding-right: 16px !important; }
              table.body .columns .column, table.body .columns .columns, table.body .column .column, table.body .column .columns { padding-left: 0 !important; padding-right: 0 !important; }
              table.body .collapse .columns, table.body .collapse .column { padding-left: 0 !important; padding-right: 0 !important; }
              td.small-1, th.small-1 { display: inline-block !important; width: 8.33333% !important; }
              td.small-2, th.small-2 { display: inline-block !important; width: 16.66667% !important; }
              td.small-3, th.small-3 { display: inline-block !important; width: 25% !important; }
              td.small-4, th.small-4 { display: inline-block !important; width: 33.33333% !important; }
              td.small-5, th.small-5 { display: inline-block !important; width: 41.66667% !important; }
              td.small-6, th.small-6 { display: inline-block !important; width: 50% !important; }
              td.small-7, th.small-7 { display: inline-block !important; width: 58.33333% !important; }
              td.small-8, th.small-8 { display: inline-block !important; width: 66.66667% !important; }
              td.small-9, th.small-9 { display: inline-block !important; width: 75% !important; }
              td.small-10, th.small-10 { display: inline-block !important; width: 83.33333% !important; }
              td.small-11, th.small-11 { display: inline-block !important; width: 91.66667% !important; }
              td.small-12, th.small-12 { display: inline-block !important; width: 100% !important; }
              .columns td.small-12, .column td.small-12, .columns th.small-12, .column th.small-12 { display: block !important; width: 100% !important; }
              table.body td.small-offset-1, table.body th.small-offset-1 { margin-left: 8.33333% !important; Margin-left: 8.33333% !important; }
              table.body td.small-offset-2, table.body th.small-offset-2 { margin-left: 16.66667% !important; Margin-left: 16.66667% !important; }
              table.body td.small-offset-3, table.body th.small-offset-3 { margin-left: 25% !important; Margin-left: 25% !important; }
              table.body td.small-offset-4, table.body th.small-offset-4 { margin-left: 33.33333% !important; Margin-left: 33.33333% !important; }
              table.body td.small-offset-5, table.body th.small-offset-5 { margin-left: 41.66667% !important; Margin-left: 41.66667% !important; }
              table.body td.small-offset-6, table.body th.small-offset-6 { margin-left: 50% !important; Margin-left: 50% !important; }
              table.body td.small-offset-7, table.body th.small-offset-7 { margin-left: 58.33333% !important; Margin-left: 58.33333% !important; }
              table.body td.small-offset-8, table.body th.small-offset-8 { margin-left: 66.66667% !important; Margin-left: 66.66667% !important; }
              table.body td.small-offset-9, table.body th.small-offset-9 { margin-left: 75% !important; Margin-left: 75% !important; }
              table.body td.small-offset-10, table.body th.small-offset-10 { margin-left: 83.33333% !important; Margin-left: 83.33333% !important; }
              table.body td.small-offset-11, table.body th.small-offset-11 { margin-left: 91.66667% !important; Margin-left: 91.66667% !important; }
              table.body table.columns td.expander, table.body table.columns th.expander { display: none !important; }
              table.body .right-text-pad, table.body .text-pad-right { padding-left: 10px !important; }
              table.body .left-text-pad, table.body .text-pad-left { padding-right: 10px !important; }
              table.menu { width: 100% !important; }
              table.menu td, table.menu th { width: auto !important; display: inline-block !important; }
              table.menu.vertical td, table.menu.vertical th, table.menu.small-vertical td, table.menu.small-vertical th { display: block !important; }
              table.menu[align="center"] { width: auto !important; }
              table.button.small-expand, table.button.small-expanded { width: 100% !important; }
              table.button.small-expand table, table.button.small-expanded table { width: 100%; }
              table.button.small-expand table a, table.button.small-expanded table a { text-align: center !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
              table.button.small-expand center, table.button.small-expanded center { min-width: 0; }
            }
          </style>
        </head>
        <body style="-moz-box-sizing: border-box; -ms-text-size-adjust: 100%; -webkit-box-sizing: border-box; -webkit-text-size-adjust: 100%; Margin: 0; background:  #f4f7fa !important; box-sizing: border-box; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; min-width: 100%; padding: 0; text-align: left; width: 100% !important;">
          <table class="body" data-made-with-foundation="" style="Margin: 0; background: #f4f7fa !important; border-collapse: collapse; border-spacing: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; height: 100%; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
            <tbody>
              <tr>
                <td class="float-center" align="center" valign="top" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0 auto; border-collapse: collapse !important; color: #ffffff; float: none; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; word-wrap: break-word;">
                  <center data-parsed="" style="min-width: 580px; width: 100%;">
                    <table class="spacer float-center" style="Margin: 0 auto; border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 100%;">
                      <tbody>
                        <tr style="padding: 0; text-align: left; vertical-align: top;">
                          <td height="40px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 40px; font-weight: normal; hyphens: auto; line-height: 40px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" class="container header float-center" style="Margin: 0 auto; background: transparent !important; border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 580px;">
                      <tbody>
                        <tr style="padding: 0; text-align: left; vertical-align: top;">
                          <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">
                            <table class="row collapse" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%;">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                  <th class="small-12 large-12 columns first last" style="Margin: 0 auto; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; padding-bottom: 16px; padding-left: 0; padding-right: 0; text-align: left; width: 588px;">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top;">
                                          <th style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left;">
                                            <center style="min-width: 532px; width: 100%;"><img width="250" style="width:250px" src="https://i.ibb.co/fGLZqXtF/nethlogo-Photoroom.png" align="center" class="float-center" style="-ms-interpolation-mode: bicubic; Margin: 0 auto; clear: both; display: block; float: none; margin: 0 auto; max-width: 100%; outline: none; text-align: center; text-decoration: none; width: auto;"></center>
                                          </th>
                                          <th class="expander" style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0 !important; text-align: left; visibility: hidden; width: 0;"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" class="container body-drip float-center" style="Margin: 0 auto; background: transparent !important; border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 580px;">
                      <tbody>
                        <tr style="padding: 0; text-align: left; vertical-align: top;">
                          <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">
                            <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                  <td height="80px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 80px; font-weight: normal; hyphens: auto; line-height: 80px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%;">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                  <th class="small-12 large-12 columns first last" style="Margin: 0 auto; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; padding-bottom: 16px; padding-left: 16px; padding-right: 16px; text-align: left; width: 564px;">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top;">
                                          <th style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left;">
                                            <h2 class="text-center" style="Margin: 0; Margin-bottom: 10px; color: orange; font-family: Helvetica, Arial, sans-serif; font-size: 30px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center; word-wrap: normal;">Driver Assegnato per la Tua Richiesta!</h2>
                                            <h5 class="text-center" style="Margin: 0; Margin-bottom: 10px; color: #4b4b4b; font-family: Helvetica, Arial, sans-serif; font-size: 17px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center; word-wrap: normal;">
                                              Ciao, un driver è stato assegnato alla tua richiesta. Ecco i dettagli del driver:<br><br>
                                                <strong>Nome del conducente:</strong> ${driverInfo.driverName}<br>
                                                <strong>E-mail dell'autista:</strong> ${driverInfo.driverEmail}<br>
                                               
                                              Il driver sarà presto in contatto con te.
                                            </h5>
                                          </th>
                                          <th class="expander" style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0 !important; text-align: left; visibility: hidden; width: 0;"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                            <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                  <td height="50px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 50px; font-weight: normal; hyphens: auto; line-height: 50px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <hr style="border: 0; border-bottom: 1px solid #e0e0e0; margin: 20px 0;">
                            <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                  <td height="60px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 60px; font-weight: normal; hyphens: auto; line-height: 60px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="row collapsed footer" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%;">
                              <tbody>
                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                  <th class="small-12 large-12 columns first last" style="Margin: 0 auto; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; padding-bottom: 16px; padding-left: 16px; padding-right: 16px; text-align: left; width: 564px;">
                                    <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                      <tbody>
                                        <tr style="padding: 0; text-align: left; vertical-align: top;">
                                          <th style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left;">
                                            <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                              <tbody>
                                                <tr style="padding: 0; text-align: left; vertical-align: top;">
                                                  <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">&nbsp;</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <p class="text-center" style="Margin: 0; Margin-bottom: 10px; color: #adadad; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center;">Nethgo 2025 @copyright</p>
                                          </th>
                                          <th class="expander" style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0 !important; text-align: left; visibility: hidden; width: 0;"></th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </center>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send({
          status: false,
          message: "Failed to send acceptance email.",
          data: null,
        });
      } else {
        res.status(200).send({
          status: true,
          message: "Driver acceptance email sent successfully to hotel.",
          data: null,
        });
      }
    });
  } catch (error: any) {
    res.status(500).send({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

export default SendDriverAcceptanceEmailToHotel;
//  <strong>Tipo di Veicolo:</strong> ${driverInfo.carType === 4 ? "Berlina" :"Van"}<br>
//                                                 <strong>Targa:</strong> ${driverInfo.targa}<br><br>