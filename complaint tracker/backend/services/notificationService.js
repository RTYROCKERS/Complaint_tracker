// notificationService.js
import pool from "../db.js";
import * as emailAdapter from "./adapters/emailAdapter.js";
import * as smsAdapter from "./adapters/smsAdapter.js";
import * as pushAdapter from "./adapters/pushAdapter.js";

/**
 * Helper: fetch user row by u_id
 */
async function getUser(userId) {
  const r = await pool.query("SELECT * FROM users WHERE u_id = $1", [userId]);
  return r.rows[0];
}

function formatPostStatusChangeMsg(post, oldStatus, newStatus) {
  return `Status update for your post "${post.title}": ${oldStatus} → ${newStatus}`;
}

function formatSlaOverdueMsg(post) {
  return `Your post "${post.title}" is overdue (SLA breached). Please check the post for updates.`;
}

/**
 * Notify by enabled channels (based on user.notify_prefs)
 * Uses Promise.allSettled so a single channel failure doesn't break others.
 */
async function notifyUser(user, payload) {
  if (!user) return;
  const prefs = user.notify_prefs ?? { email: true, sms: false, push: true };
  const tasks = [];

  if (prefs.email && user.email) {
    tasks.push(emailAdapter.sendEmail(user.email, payload.subject, payload.text));
  }
  if (prefs.sms && user.phone) {
    tasks.push(smsAdapter.sendSMS(user.phone, payload.smsText ?? payload.text));
  }
  if (prefs.push && user.device_token) {
    tasks.push(pushAdapter.sendPush(user.device_token, payload.push?.title ?? payload.subject, payload.push?.body ?? payload.text));
  }

  const results = await Promise.allSettled(tasks);
  // optional: log failures
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error("Notification channel failed:", r.reason);
    }
  });
  return results;
}

/**
 * Notify when post status changes
 */
export async function notifyOnPostStatusChange(postId, oldStatus, newStatus) {
  try {
    const postRes = await pool.query("SELECT * FROM posts WHERE post_id = $1", [postId]);
    const post = postRes.rows[0];
    if (!post) return;
    const user = await getUser(post.user_id);
    if (!user) return;

    const text = formatPostStatusChangeMsg(post, oldStatus, newStatus);
    const payload = {
      subject: `Post status changed: ${newStatus}`,
      text,
      smsText: text,
      push: { title: "Post status changed", body: text }
    };

    return notifyUser(user, payload);
  } catch (err) {
    console.error("notifyOnPostStatusChange error:", err);
  }
}

/**
 * Notify when SLA overdue (job supplies the post row)
 */
export async function notifyOnSlaOverdue(post) {
  try {
    const user = await getUser(post.user_id);
    if (!user) return;

    const text = formatSlaOverdueMsg(post);
    const payload = {
      subject: "SLA Overdue",
      text,
      smsText: text,
      push: { title: "SLA Overdue", body: text }
    };

    return notifyUser(user, payload);
  } catch (err) {
    console.error("notifyOnSlaOverdue error:", err);
  }
}
