/**
 * FoodShareAI - Push Notification Service
 * Provider-agnostic push notification dispatcher supporting Expo Push Notifications.
 * Gracefully handles timeouts, invalid tokens, and network failures without disrupting transactions.
 */
const https = require('https');
const { User } = require('../models');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const PUSH_TIMEOUT_MS = parseInt(process.env.PUSH_TIMEOUT_MS, 10) || 5000;

/**
 * Checks whether a token matches the standard Expo push token pattern.
 */
const isExpoPushToken = (token) => {
  return typeof token === 'string' && (token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken['));
};

/**
 * Dispatches an array of push messages to the Expo Push API via standard HTTPS.
 */
const sendExpoPushBatch = (messages) => {
  return new Promise((resolve) => {
    if (!messages || messages.length === 0) {
      return resolve({ success: true, count: 0 });
    }

    try {
      const url = new URL(EXPO_PUSH_URL);
      const postData = JSON.stringify(messages);

      const req = https.request(
        {
          hostname: url.hostname,
          port: 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
          },
          timeout: PUSH_TIMEOUT_MS,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              resolve({ success: true, response: data });
            } catch (parseErr) {
              resolve({ success: false, error: parseErr.message });
            }
          });
        }
      );

      req.on('error', (err) => {
        // Non-blocking error reporting
        resolve({ success: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: `Expo push timeout after ${PUSH_TIMEOUT_MS}ms` });
      });

      req.write(postData);
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
};

/**
 * Sends a push notification to one or multiple device tokens.
 */
const sendPushNotification = async ({ pushTokens, title, body, data = {}, priority = 'default' }) => {
  if (!pushTokens) return { delivered: 0 };

  const tokens = Array.isArray(pushTokens) ? pushTokens : [pushTokens];
  const validTokens = tokens.filter(isExpoPushToken);

  if (validTokens.length === 0) {
    return { delivered: 0, reason: 'No valid Expo push tokens found' };
  }

  const messages = validTokens.map((to) => ({
    to,
    sound: 'default',
    title: title || 'FoodShareAI Alert',
    body: body || '',
    data,
    priority: priority === 'HIGH' || priority === 'CRITICAL' ? 'high' : 'default',
  }));

  try {
    const result = await sendExpoPushBatch(messages);

    // If tickets report DeviceNotRegistered, cleanup token asynchronously
    if (result && result.response && Array.isArray(result.response.data)) {
      result.response.data.forEach((ticket, idx) => {
        if (ticket.status === 'error' && ticket.details && ticket.details.error === 'DeviceNotRegistered') {
          const invalidToken = validTokens[idx];
          if (invalidToken) {
            User.updateMany({ pushTokens: invalidToken }, { $pull: { pushTokens: invalidToken } }).catch(() => {});
          }
        }
      });
    }

    return { delivered: validTokens.length, status: result.success ? 'SENT' : 'FAILED' };
  } catch (err) {
    return { delivered: 0, status: 'FAILED', error: err.message };
  }
};

module.exports = {
  isExpoPushToken,
  sendExpoPushBatch,
  sendPushNotification,
};
