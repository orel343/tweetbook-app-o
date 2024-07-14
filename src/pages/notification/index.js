const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotificationOnLike = functions.firestore
  .document('posts/{postId}/likes/{likeId}')
  .onCreate(async (snapshot, context) => {
    const { postId } = context.params;
    const likeData = snapshot.data();

    // Get the post data
    const postSnapshot = await admin.firestore().doc(`posts/${postId}`).get();
    const postData = postSnapshot.data();

    // Create a notification
    const notification = {
      type: 'like',
      postId: postId,
      likedBy: likeData.userId,
      likedAt: admin.firestore.FieldValue.serverTimestamp(),
      postOwnerId: postData.userId,
    };

    // Save the notification
    await admin.firestore().collection('notifications').add(notification);
  });
