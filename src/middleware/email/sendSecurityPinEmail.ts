import { Response } from "express";
import transporter from "../../utils/emailTransporter";

require("dotenv").config();

const SendSecurityPinEmail = async (
  customerEmail: string,
  securityPin: string,
  clientName: string,
  orderNumber: number,
  res: Response
) => {
  try {
    let mailOptions = {
      from: process.env.MAIL_FROM,
      to: customerEmail,
      subject: "Il Tuo Codice di Sicurezza per la Prenotazione NCC",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Security PIN Email</title>
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
      table.body .columns, table.body .column { height: auto !important; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; padding-left: 16px !important; padding-right: 16px !important; }
      table.body .columns .column, table.body .columns .columns, table.body .column .column, table.body .column .columns { padding-left: 0 !important; padding-right: 0 !important; }
      table.body .collapse .columns, table.body .collapse .column { padding-left: 0 !important; padding-right: 0 !important; }
    }
  </style>
</head>
<body style="-moz-box-sizing: border-box; -ms-text-size-adjust: 100%; -webkit-box-sizing: border-box; -webkit-text-size-adjust: 100%; Margin: 0; background: #f4f7fa !important; box-sizing: border-box; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; min-width: 100%; padding: 0; text-align: left; width: 100% !important;">
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
                                    <h2 class="text-center" style="Margin: 0; Margin-bottom: 10px; color: orange; font-family: Helvetica, Arial, sans-serif; font-size: 30px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center; word-wrap: normal;">Il Tuo Codice di Sicurezza</h2>
                                    <h5 class="text-center" style="Margin: 0; Margin-bottom: 20px; color: #4b4b4b; font-family: Helvetica, Arial, sans-serif; font-size: 17px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 20px; padding: 0; text-align: center; word-wrap: normal;">
                                      Ciao ${clientName},<br><br>
                                      La tua prenotazione #${orderNumber} è stata confermata con successo!<br><br>
                                      Per garantire la sicurezza del tuo viaggio, ecco il tuo codice PIN univoco che il driver dovrà inserire prima di iniziare la corsa:
                                    </h5>
                                    <div style="text-align: center; margin: 30px 0;">
                                      <div style="display: inline-block; background: #f7b500; padding: 20px 40px; border-radius: 10px; margin: 20px 0;">
                                        <h1 style="Margin: 0; color: #ffffff; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: bold; line-height: 1.3; margin: 0; padding: 0; letter-spacing: 8px; text-align: center;">${securityPin}</h1>
                                      </div>
                                    </div>
                                    <h5 class="text-center" style="Margin: 0; Margin-bottom: 10px; color: #4b4b4b; font-family: Helvetica, Arial, sans-serif; font-size: 17px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center; word-wrap: normal;">
                                      <strong>Importante:</strong> Condividi questo codice solo con il driver autorizzato quando ti contatterà. Il driver dovrà inserire questo PIN nell'app prima di iniziare la corsa per garantire la sicurezza del servizio.
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
</html>`,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log("Error sending security PIN email:", error);
      } else {
        console.log("Security PIN email sent: " + info.response);
      }
    });

  } catch (error: any) {
    console.error("Error in SendSecurityPinEmail:", error);
  }
};

export default SendSecurityPinEmail;

