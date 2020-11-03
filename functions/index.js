const functions = require("firebase-functions");
const connection = require("./database/connection");
const admin = require("firebase-admin");
admin.initializeApp();
const fetch = require("node-fetch");

exports.sendNotifications = functions.https.onRequest(async (req, res) => {
  try {
    const notifications = await connection("notifications")
      .select("*")

      .where({ deleted: false, sent: false })
      .where("visits.aud_created_date", ">=", startDate);

    return res.json(customers);

    // const message = {
    //   to: "ExponentPushToken[h3ltswFkSTp0a_-iXxn3-m]",
    //   sound: "default",
    //   title: "Original Title",
    //   body: "And here is the body!",
    //   data: { data: "goes here" },
    // };

    // await fetch("https://exp.host/--/api/v2/push/send", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Accept-encoding": "gzip, deflate",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(message),
    // });
    return res.json({ ok: "ok" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});
