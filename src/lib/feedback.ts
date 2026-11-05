export const FEEDBACK_NOTE_MAX = 500;
export const FEEDBACK_REPLY_MAX = 5000;
export const FEEDBACK_DAYS = 7;
// Unread replies changed in this tab.
export const FEEDBACK_EVENT = "vikha-feedback-change";

export const formatDate = (iso: string) => new Intl.DateTimeFormat("uk-UA", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
