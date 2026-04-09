import { base44 } from '@/api/base44Client';

/**
 * Helper functions to create notifications
 */

export const createNotification = async (data) => {
  try {
    // Get recipient's notification settings
    const users = await base44.entities.User.list();
    const recipient = users.find(u => u.email === data.recipient_email);
    
    if (!recipient) return;

    // Check if notification type is enabled
    const settingsKey = {
      'friend_request': 'friend_requests',
      'friend_accepted': 'friend_requests',
      'comment': 'comments',
      'mention': 'mentions',
      'like': 'likes',
      'group_invite': 'group_activity',
      'group_post': 'group_activity',
      'message': 'messages',
      'achievement': 'achievements'
    }[data.type];

    const settings = recipient.notification_settings || {};
    if (settingsKey && settings[settingsKey] === false) {
      return; // User has disabled this notification type
    }

    // Create the notification
    await base44.entities.Notification.create(data);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const notifyFriendRequest = async (senderEmail, senderName, recipientEmail) => {
  await createNotification({
    recipient_email: recipientEmail,
    type: 'friend_request',
    title: 'New Friend Request',
    message: `${senderName} sent you a friend request`,
    sender_email: senderEmail,
    sender_name: senderName,
    action_url: createPageUrl('Friends'),
    icon: '👋'
  });
};

export const notifyFriendAccepted = async (senderEmail, senderName, recipientEmail) => {
  await createNotification({
    recipient_email: recipientEmail,
    type: 'friend_accepted',
    title: 'Friend Request Accepted',
    message: `${senderName} accepted your friend request`,
    sender_email: senderEmail,
    sender_name: senderName,
    action_url: createPageUrl(`UserProfile?email=${senderEmail}`),
    icon: '🤝'
  });
};

export const notifyComment = async (senderEmail, senderName, recipientEmail, postId, commentText) => {
  await createNotification({
    recipient_email: recipientEmail,
    type: 'comment',
    title: 'New Comment',
    message: `${senderName} commented: "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"`,
    sender_email: senderEmail,
    sender_name: senderName,
    related_id: postId,
    related_type: 'post',
    action_url: createPageUrl('Community'),
    icon: '💬'
  });
};

export const notifyLike = async (senderEmail, senderName, recipientEmail, postId) => {
  await createNotification({
    recipient_email: recipientEmail,
    type: 'like',
    title: 'New Like',
    message: `${senderName} liked your post`,
    sender_email: senderEmail,
    sender_name: senderName,
    related_id: postId,
    related_type: 'post',
    action_url: createPageUrl('Community'),
    icon: '❤️'
  });
};

export const notifyGroupPost = async (senderEmail, senderName, groupId, groupMembers) => {
  // Notify all group members except the sender
  for (const memberEmail of groupMembers) {
    if (memberEmail !== senderEmail) {
      await createNotification({
        recipient_email: memberEmail,
        type: 'group_post',
        title: 'New Group Post',
        message: `${senderName} posted in your group`,
        sender_email: senderEmail,
        sender_name: senderName,
        related_id: groupId,
        related_type: 'group',
        action_url: createPageUrl(`GroupDetail?id=${groupId}`),
        icon: '📝'
      });
    }
  }
};

export const notifyMessage = async (senderEmail, senderName, recipientEmail) => {
  await createNotification({
    recipient_email: recipientEmail,
    type: 'message',
    title: 'New Message',
    message: `${senderName} sent you a message`,
    sender_email: senderEmail,
    sender_name: senderName,
    action_url: createPageUrl(`Messages?recipient=${senderEmail}`),
    icon: '✉️'
  });
};

export const notifyAchievement = async (userEmail, badgeName) => {
  await createNotification({
    recipient_email: userEmail,
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: `You earned the "${badgeName}" badge!`,
    action_url: createPageUrl('Achievements'),
    icon: '🏆'
  });
};