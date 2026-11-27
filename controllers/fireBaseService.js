const admin = require('firebase-admin');

// Initialize with your service account key
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class FirebaseService {
  async sendNotification(token, title, body, data = {}) {
    try {
      const message = {
        notification: { title, body },
        data: data,
        token: token
      };
      
      const response = await admin.messaging().send(message);
      console.log('✅ Push notification sent:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      throw error;
    }
  }

  async sendToTopic(topic, title, body, data = {}) {
    try {
      const message = {
        notification: { title, body },
        data: data,
        topic: topic
      };
      
      const response = await admin.messaging().send(message);
      console.log('✅ Topic notification sent:', response);
      return response;
    } catch (error) {
      console.error('❌ Error sending topic notification:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseService();