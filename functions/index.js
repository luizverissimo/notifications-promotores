const fetch = require("node-fetch");
const moment = require("moment");
const functions = require("firebase-functions");
const connection = require("./database/connection");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotifications = functions.https.onRequest(async (req, res) => {
  try {
    const now = moment(Date.now()).format("YYYY-MM-DDT23:59:00-03");
    const notifications = await connection("notifications")
      .select("*")
      .join("users", "users.i_user", "=", "notifications.i_user")
      .where({ "notifications.deleted": false, sent: false })
      .where("notifications.sent_date", "<=", now);

    await notifications.forEach(async (notification) => {
      const message = {
        to: notification.expo_push_token,
        sound: "default",
        title: notification.title,
        body: notification.description,
        data: {},
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      await connection("notifications")
        .where({ i_notification: notification.i_notification })
        .update({ sent: true });
    });
    return res.json({ ok: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});
