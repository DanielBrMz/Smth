const getEmailTemplate = (ctaLink: string): string => {
  return `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Creator Partner </title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    .es-button {
      mso-style-priority: 100 !important;
      text-decoration: none !important;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
      mso-hide: all;
    }

    .es-button-border:hover a.es-button,
    .es-button-border:hover button.es-button {
      background: #56d66b !important;
    }

    .es-button-border:hover {
      border-color: #42d159 #42d159 #42d159 #42d159 !important;
      background: #56d66b !important;
    }

    td .es-button-border:hover a.es-button-1676151301424 {
      background: #7849DE !important;
      border-color: #7849DE !important;
      color: #ffffff !important;
    }

    td .es-button-border-1676151301436:hover {
      background: #7849DE !important;
      border-style: solid solid solid solid !important;
      border-color: #42d159 #42d159 #42d159 #42d159 !important;
    }

    @media only screen and (max-width:600px) {

      p,
      ul li,
      ol li,
      a {
        line-height: 150% !important
      }

      h1,
      h2,
      h3,
      h1 a,
      h2 a,
      h3 a {
        line-height: 120%
      }

      h1 {
        font-size: 30px !important;
        text-align: left
      }

      h2 {
        font-size: 24px !important;
        text-align: left
      }

      h3 {
        font-size: 20px !important;
        text-align: left
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 30px !important;
        text-align: left
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 24px !important;
        text-align: left
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px !important;
        text-align: left
      }

      .es-menu td a {
        font-size: 14px !important
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li,
      .es-header-body a {
        font-size: 14px !important
      }

      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li,
      .es-content-body a {
        font-size: 14px !important
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li,
      .es-footer-body a {
        font-size: 14px !important
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li,
      .es-infoblock a {
        font-size: 12px !important
      }

      *[class="gmail-fix"] {
        display: none !important
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3 {
        text-align: center !important
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3 {
        text-align: right !important
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3 {
        text-align: left !important
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img {
        display: inline !important
      }

      .es-button-border {
        display: inline-block !important
      }

      a.es-button,
      button.es-button {
        font-size: 18px !important;
        display: inline-block !important
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important
      }

      .es-adapt-td {
        display: block !important;
        width: 100% !important
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important
      }

      .es-m-p0 {
        padding: 0px !important
      }

      .es-m-p0r {
        padding-right: 0px !important
      }

      .es-m-p0l {
        padding-left: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0 !important
      }

      .es-m-p20b {
        padding-bottom: 20px !important
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important
      }

      tr.es-desk-hidden,
      td.es-desk-hidden,
      table.es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important
      }

      tr.es-desk-hidden {
        display: table-row !important
      }

      table.es-desk-hidden {
        display: table !important
      }

      td.es-desk-menu-hidden {
        display: table-cell !important
      }

      .es-menu td {
        width: 1% !important
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important
      }

      table.es-social {
        display: inline-block !important
      }

      table.es-social td {
        display: inline-block !important
      }

      .es-desk-hidden {
        display: table-row !important;
        width: auto !important;
        overflow: visible !important;
        max-height: inherit !important
      }
    }

    @media screen and (max-width:384px) {
      .mail-message-content {
        width: 414px !important
      }
    }
  </style>
</head>

<body
  style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:transparent"><!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="transparent"></v:fill>
			</v:background>
		<![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:transparent"
      role="none">
      <tr>
        <td valign="top" style="padding:0;Margin:0">
          <table class="es-header" cellspacing="0" cellpadding="0" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center"
                background="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/creator_email_bg_H8F.png"
                style="padding:0;Margin:0;background-image:url(https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/creator_email_bg_H8F.png);background-repeat:no-repeat;background-position:center top;background-color:#ffffff"
                bgcolor="#ffffff">
                <table class="es-header-body" cellspacing="0" cellpadding="0" align="center"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;border-top:10px solid transparent;border-right:10px solid transparent;border-left:10px solid transparent;width:700px;border-bottom:10px solid transparent"
                  role="none">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px">
                      <table cellspacing="0" cellpadding="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:640px">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:20px;Margin:0;font-size:0">
                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td
                                        style="padding:0;Margin:0;border-bottom:0px solid #cccccc;background:unset;height:1px;width:100%;margin:0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img"
                                    src="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/splogo2x.png"
                                    alt
                                    style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                    height="52"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" bgcolor="#151F34"
                      style="padding:30px;Margin:0;background-color:#151f34;border-radius:5px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:620px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:15px;Margin:0">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:45px;color:#ffffff;font-size:30px">
                                    <strong>Welcome Creator Partner.</strong></p>
                                </td>
                              </tr>
                              <tr>
                                <td align="left" style="padding:15px;Margin:0">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    Dear Partner,&nbsp;</p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    <br></p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    Hello and Welcome to Sidepocket!
                                      We’re thrilled to have you onboard as a Creator Partner. To get started, simply click the button below to access your Content Portal. We’ve also included a  <a target="_blank"
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#4186f6;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif"
                                      href="https://share.descript.com/view/qnkEOf8Xmly">video guide</a> to help
                                    to help you begin uploading content seamlessly.</p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center"
                                  style="Margin:0;padding-top:30px;padding-left:30px;padding-right:30px;padding-bottom:40px"><!--[if mso]><a href="${ctaLink}" target="_blank" hidden>
	<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="${ctaLink}"
                style="height:59px; v-text-anchor:middle; width:333px" arcsize="17%" stroke="f"  fillcolor="#7849de">
		<w:anchorlock></w:anchorlock>
		<center style='color:#ffffff; font-family:arial, "helvetica neue", helvetica, sans-serif; font-size:16px; font-weight:400; line-height:16px;  mso-text-raise:1px'>Get started with your Content Portal</center>
	</v:roundrect></a>
<![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-1676151301436 es-button-border"
                                    style="border-style:solid;border-color:#2cb543;background:#7849de;border-width:0px;display:inline-block;border-radius:10px;width:auto;mso-hide:all"><a
                                      href="${ctaLink}"
                                      class="es-button es-button-1676151301424" target="_blank"
                                      style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#ffffff;font-size:16px;display:inline-block;background:#7849de;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;padding:20px 30px;mso-padding-alt:0;mso-border-alt:10px solid #7849de">Get
                                      started with your Content Portal</a></span><!--<![endif]--></td>
                              </tr>
                              <tr>
                                <td align="left" style="padding:15px;Margin:0">
                                  <h2 Access Your Content Portal</h2>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                   Your initial password is “Sidepocket123”. Please ensure you change it once you log in. We value your feedback and are here to support you, so if you have any questions or suggestions, feel free to reach out to us at
                                     <a target="_blank"
                                      href="mailto:info@sidepocket.com"
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#4186f6;font-size:16px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif">info@sidepocket.com</a>.
                                  </p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    <br></p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    Thank you for choosing Sidepocket as your partner, and we look forward to working
                                    with you and continuing to support you on your financial journey.</p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    <br></p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    Best regards,</p><br>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    The Sidepocket Team</p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#ffffff;font-size:16px">
                                    <br></p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:700px">
                  <tr>
                    <td align="left" style="padding:40px;Margin:0">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:620px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;display:none"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-footer" cellspacing="0" cellpadding="0" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0;background-color:#010022" bgcolor="#010022">
                <table class="es-footer-body" cellspacing="0" cellpadding="0" align="center"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;border-top:10px solid transparent;border-right:10px solid transparent;border-left:10px solid transparent;width:700px;border-bottom:10px solid transparent"
                  role="none">
                  <tr>
                    <td align="left" style="padding:40px;Margin:0">
                      <!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:210px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;width:200px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:5px;Margin:0">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#ffffff;font-size:14px">
                                    www.sidepocket.com</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td class="es-hidden" style="padding:0;Margin:0;width:10px"></td>
                        </tr>
                      </table><!--[if mso]></td><td style="width:240px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td class="es-m-p20b" align="center" style="padding:0;Margin:0;width:230px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                    href="https://www.sidepocket.com/"
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img
                                      class="adapt-img"
                                      src="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/splogo2x.png"
                                      alt
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                      width="157"></a></td>
                              </tr>
                            </table>
                          </td>
                          <td class="es-hidden" style="padding:0;Margin:0;width:10px"></td>
                        </tr>
                      </table><!--[if mso]></td><td style="width:40px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:30px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr class="es-mobile-hidden">
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                    href="https://www.linkedin.com/company/sidepocketfinancial/mycompany/"
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img
                                      class="adapt-img"
                                      src="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/socialig.png"
                                      alt
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                      width="30"></a></td>
                              </tr>
                            </table>
                          </td>
                          <td class="es-hidden" style="padding:0;Margin:0;width:10px"></td>
                        </tr>
                      </table><!--[if mso]></td><td style="width:40px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:30px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr class="es-mobile-hidden">
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                    href="https://www.facebook.com/sidepocketinvest/"
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img
                                      class="adapt-img"
                                      src="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/socialfb.png"
                                      alt
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                      width="30"></a></td>
                              </tr>
                            </table>
                          </td>
                          <td class="es-hidden" style="padding:0;Margin:0;width:10px"></td>
                        </tr>
                      </table><!--[if mso]></td><td style="width:30px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                        <tr>
                          <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:30px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr class="es-mobile-hidden">
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                    href="https://twitter.com/Sidepocketinves"
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img
                                      class="adapt-img"
                                      src="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/socialtwitter.png"
                                      alt
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                      width="30"></a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!--[if mso]></td><td style="width:10px"></td><td style="width:30px" valign="top"><![endif]-->
                      <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:30px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr class="es-mobile-hidden">
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                    href="https://www.linkedin.com/company/sidepocketfinancial/mycompany/"
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img
                                      class="adapt-img"
                                      src="https://nsofho.stripocdn.email/content/guids/CABINET_1f94391714bd692504cc24a90fcd8921828dc898009a70c223c00660de141e14/images/socialin.png"
                                      alt
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                      width="30"></a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table><!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>`.trim()
}

export default getEmailTemplate
