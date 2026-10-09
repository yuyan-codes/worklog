/**
 * WorkLog Mail Scout — install once in EACH company Google Workspace account.
 * It looks for mail waiting on YOUR reply and sends only the summary
 * (sender, subject, short preview, link) to your WorkLog Sheet every 15 minutes.
 * The mail itself never leaves the company account.
 *
 * Setup: script.google.com → New project → paste this → fill the 3 lines below → run `setup`.
 */
const WORKLOG_URL = 'PASTE-YOUR-/exec-LINK-HERE';
const ACCESS_KEY  = 'SAME-KEY-AS-IN-CODE.GS';
const COMPANY     = 'RFME';          // RFME, LPHC or PFTD — the company this mailbox belongs to

const DAYS    = 21;                   // look back this many days
const PREVIEW = true;                 // false = send no message preview, subject only
const SKIP = /no-?reply|donotreply|do-not-reply|notification|mailer-daemon|postmaster|newsletter|alerts?@|bounce/i;

function scan() {
  const me = Session.getActiveUser().getEmail().toLowerCase();
  const mine = [me].concat(GmailApp.getAliases().map(a => a.toLowerCase()));
  const threads = GmailApp.search(
    'in:inbox newer_than:' + DAYS + 'd -category:promotions -category:social -category:updates -category:forums', 0, 150);
  const out = [];
  threads.forEach(th => {
    const msgs = th.getMessages().filter(m => !m.isDraft() && !m.isInTrash());
    if (!msgs.length) return;
    const last = msgs[msgs.length - 1], from = last.getFrom();
    const email = ((from.match(/<([^>]+)>/) || [null, from])[1] || '').trim().toLowerCase();
    if (mine.indexOf(email) >= 0 || SKIP.test(from)) return;      // you spoke last, or it's automated
    out.push({
      id: th.getId(),
      fromName: from.replace(/<.*>/, '').replace(/"/g, '').trim() || email,
      fromEmail: email,
      subject: th.getFirstMessageSubject() || '(no subject)',
      snippet: PREVIEW ? last.getPlainBody().replace(/\s+/g, ' ').trim().slice(0, 160) : '',
      lastAt: last.getDate().toISOString(),
      link: 'https://mail.google.com/mail/u/' + me + '/#all/' + th.getId()
    });
  });
  const res = UrlFetchApp.fetch(WORKLOG_URL, {
    method: 'post', contentType: 'text/plain', muteHttpExceptions: true, followRedirects: true,
    payload: JSON.stringify({ token: ACCESS_KEY, action: 'mail', company: COMPANY, account: me, threads: out })
  });
  Logger.log('Sent ' + out.length + ' waiting threads → ' + res.getContentText().slice(0, 200));
}

function setup() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('scan').timeBased().everyMinutes(15).create();
  scan();
}
