# WorkLog — connecting your 3 company mailboxes

About 20 minutes in total. Do it on the laptop.

## A. Update the WorkLog script (once)

1. Open your **WorkLog** Google Sheet → **Extensions → Apps Script**.
2. Line 8 has your access key (`const ACCESS_KEY = '…';`). **Copy that line to Notepad first.**
3. Select everything in the editor (Ctrl+A), paste the new **Code.gs**, then put your key back on line 8. Save (Ctrl+S).
4. In the function dropdown choose **setup** → **Run**. Google asks for two new permissions (send you an email, run on a schedule) → **Allow**.
5. **Deploy → Manage deployments** → click the **pencil ✏️** → Version: **New version** → **Deploy**.
   The link stays the same. Skip this step and mail won't come through.

## B. Update the app

Upload the new **index.html** and **sw.js** to GitHub, as before.

## C. Add the Mail Scout to each company account (repeat 3 times)

Do this once for RFME, once for LPHC, once for PFTD.

1. Open a browser window signed in to **that company's** Google account only
   (a separate Chrome profile or an Incognito window avoids mixing accounts).
2. Go to **script.google.com** → **New project**. Rename it `WorkLog Mail Scout`.
3. Delete what's there, paste **MailScout.gs**, and fill the three lines at the top:
   - `WORKLOG_URL` — your `/exec` link
   - `ACCESS_KEY` — the same key as in Code.gs
   - `COMPANY` — `RFME`, `LPHC` or `PFTD`
4. Save, choose **setup** in the dropdown → **Run** → **Review permissions** → that company account →
   **Advanced → Go to WorkLog Mail Scout (unsafe) → Allow**.
5. Open **Execution log** at the bottom. You should see
   `Sent 12 waiting threads → {"ok":true,…}` (your number will differ).
6. Open WorkLog → **Inbox**. Those mails are there, tagged with the company.

From then on it checks every 15 minutes by itself.

**If Google says "This app is blocked"**: that company's Workspace admin has switched off personal scripts.
Ask them to allow it, or tell me and we'll use another route for that account.

## What counts as "waiting on you"

- A thread in your **inbox** from the last 21 days where the **last message is from someone else**.
- Newsletters, no-reply senders, Promotions/Social/Updates tabs are skipped.
- **Reply** to it, or **archive** it in Gmail → it disappears from WorkLog within 15 minutes.
- **✓ Done** in WorkLog hides it until that person writes again.
- **→ Task / → Follow-up** creates the item with the subject and sender filled in, and clears the mail.

## Morning digest

Every day around **8 AM** an email arrives in the Gmail that owns the WorkLog Sheet:
mails waiting (oldest first, with days waiting), follow-ups due and tasks due.
Nothing pending → no email.

## Privacy

Only the sender, subject, a 160-character preview and a link are copied to your Sheet.
The mail itself stays in the company account. To send subjects only, set `PREVIEW = false` in MailScout.gs.
