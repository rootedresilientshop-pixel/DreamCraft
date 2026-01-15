# VentureLab Bug Reporting & Feedback System

**Version:** 1.0
**Date:** January 15, 2026
**Purpose:** Standardized bug tracking for beta testing

---

## Bug Report Template

Copy this template and fill it out for each bug found.

```markdown
## [BUG TITLE]
Brief description of what's broken

### Environment
- **Browser:** Chrome / Firefox / Safari / Edge
- **Version:** [e.g., v120.0]
- **Device:** Desktop / Laptop / Tablet / Mobile
- **Screen Size:** [e.g., 1920x1080 / 375x667]
- **OS:** Windows / macOS / iOS / Android
- **URL/Page:** [Which page? e.g., localhost:3000/create-idea]
- **User Role:** Creator / Collaborator
- **Time:** [When did this happen? 3:45pm EST]

### Reproducibility
- [ ] Always happens (100%)
- [ ] Usually happens (70-90%)
- [ ] Sometimes happens (30-70%)
- [ ] Rare (< 30%)
- [ ] Can't reproduce

### Steps to Reproduce
1. [First action]
2. [Second action]
3. [Third action]
...
4. [Action that causes bug]

### Expected Result
[What should happen]

### Actual Result
[What actually happened instead]

### Error Details
**Console Error (if any):**
```
[Paste error message from F12 → Console]
```

**Network Error (if any):**
```
[Paste error from F12 → Network]
```

### Screenshots/Video
[Attach screenshot or video showing the bug]
- How to take screenshot: Print Screen or Cmd+Shift+4 (Mac)
- How to record video: Built-in tools or Loom (https://loom.com)

### Severity
- [ ] **CRITICAL 🔴** - App breaks/crashes, can't complete core flow
- [ ] **HIGH 🟠** - Major feature doesn't work, blocks user action
- [ ] **MEDIUM 🟡** - Feature partially works, confusing UX
- [ ] **LOW 🟢** - UI issue, typo, minor problem

### Impact
- [ ] **Affects Creator**
- [ ] **Affects Collaborator**
- [ ] **Affects Both**
- [ ] **Affects Specific Feature:** [Which?]

### Additional Context
[Any other info that might help fix this?]
- Did it work before?
- Does it work on other browser?
- Have you seen this anywhere else in the app?

### Workaround (if any)
[Is there a way to work around this issue while it's being fixed?]
```

---

## Example Bug Reports

### Example 1: Critical Bug

```markdown
## Create Idea Form Doesn't Submit

### Environment
- **Browser:** Chrome v120
- **Device:** Desktop
- **Screen Size:** 1920x1080
- **OS:** Windows 11
- **URL:** localhost:3000/create-idea
- **User Role:** Creator
- **Time:** 3:45pm EST, January 15

### Reproducibility
- [x] Always happens (100%)

### Steps to Reproduce
1. Go to Create Idea page
2. Select SaaS Product template
3. Fill all 5 sections with content
4. Click "✓ Create Idea" button
5. Button becomes unresponsive

### Expected Result
Idea should create and show validation modal with score

### Actual Result
Button shows "Creating Idea..." then nothing happens. After 30 seconds, button returns to normal state but idea is not created.

### Error Details
**Console Error:**
```
POST /api/ideas 500 (Internal Server Error)
Error: Failed to create idea: Internal Server Error
```

**Network Error:**
```
POST http://localhost:3002/api/ideas
Status: 500 Internal Server Error
Response: { error: "Database connection failed" }
```

### Screenshots
[Screenshot showing form filled out and button state]

### Severity
- [x] **CRITICAL 🔴** - Can't create ideas at all

### Impact
- [x] **Affects Creator**

### Additional Context
This blocks the primary creator action. No ideas can be created.

### Workaround
None - core feature is broken
```

### Example 2: High Bug

```markdown
## Word Counter Inaccurate in "The Problem" Section

### Environment
- **Browser:** Safari v17.1
- **Device:** iPhone 12
- **Screen Size:** 390x844
- **OS:** iOS 17.2
- **URL:** localhost:3000/create-idea
- **User Role:** Creator
- **Time:** 4:20pm EST, January 15

### Reproducibility
- [x] Always happens (100%)

### Steps to Reproduce
1. Open Create Idea on iPhone
2. Select SaaS template
3. Click "The Problem" textarea
4. Copy-paste this text: "The problem is that recruiting is slow and expensive for companies trying to find talent quickly in competitive markets where great candidates get multiple offers from competitors"
5. Check word counter

### Expected Result
Counter should show 29 words

### Actual Result
Counter shows 23 words (6 word discrepancy)

### Error Details
No console errors

### Screenshots
[iPhone screenshot showing text and counter]

### Severity
- [x] **HIGH 🟠** - Major feature doesn't work correctly

### Impact
- [x] **Affects Creator**
- Word counter is used for validation, inaccuracy causes UX confusion

### Additional Context
Tested on desktop Chrome and counter is accurate there. Only happens on mobile Safari.
Likely issue: Line breaks or special characters handled differently on mobile.

### Workaround
Use desktop Chrome to create ideas
```

### Example 3: Medium Bug

```markdown
## Collaborator Invitation Modal Missing Confirmation Text

### Environment
- **Browser:** Firefox v121
- **Device:** Desktop
- **Screen Size:** 1440x900
- **OS:** macOS 14
- **URL:** localhost:3000/collaborators
- **User Role:** Creator
- **Time:** 2:15pm EST, January 15

### Reproducibility
- [x] Usually happens (90%)

### Steps to Reproduce
1. Go to Find Collaborators
2. Click "Invite" on any collaborator
3. Invitation modal appears
4. Select idea and role
5. Click "Send Invite"

### Expected Result
Modal should show success message: "Invitation sent to [collaborator name]!"

### Actual Result
Modal closes but no feedback message. Unclear if invitation actually sent.
(Button does change to "✓ Invited" so invitation likely sent, but no confirmation message)

### Error Details
No errors

### Screenshots
[Screenshot of modal without success message]

### Severity
- [x] **MEDIUM 🟡** - Feature works but UX is unclear

### Impact
- [x] **Affects Creator**

### Additional Context
Users might think invitation didn't send because no confirmation.
Feature works (button state changes), but feedback is poor.

### Workaround
Check if button changes to "✓ Invited" to confirm it sent
```

### Example 4: Low Bug

```markdown
## Typo in Creator Dashboard Empty State

### Environment
- **Browser:** Chrome v120
- **Device:** Desktop
- **URL:** localhost:3000/dashboard
- **User Role:** Creator

### Reproducibility
- [x] Always happens (100%)

### Steps to Reproduce
1. Create new Creator account (no ideas)
2. Go to Dashboard
3. Click Ideas tab
4. See empty state

### Expected Result
Text should read: "You haven't created any ideas yet"

### Actual Result
Text reads: "You havent created any ideas yet" (missing apostrophe)

### Error Details
None - just typo

### Screenshots
[Screenshot of empty state]

### Severity
- [x] **LOW 🟢** - Minor UI issue

### Impact
- Minor cosmetic issue

### Workaround
None needed
```

---

## Feedback Form (Post-Testing)

Use this form to give qualitative feedback beyond bug reports.

### Creator Experience Feedback

```
## What You Tested
- [ ] Dashboard
- [ ] Create Idea with Template
- [ ] Find Collaborators
- [ ] Browse Ideas
- [ ] Manage Invitations

## Questions

### Template-Guided Form (NEW in Phase 3)

1. **Did the template help you create a better idea?**
   - [ ] Yes, much better
   - [ ] Yes, somewhat better
   - [ ] No difference
   - [ ] Made it worse

2. **How helpful were the word counters?**
   - [ ] Very helpful (motivated me to write more)
   - [ ] Somewhat helpful
   - [ ] Neutral
   - [ ] Distracting

3. **How helpful were the hints/tips?**
   - [ ] Very helpful (improved my idea)
   - [ ] Somewhat helpful
   - [ ] Neutral
   - [ ] Didn't use them

4. **Were AI suggestions useful?**
   - [ ] Yes, very useful
   - [ ] Somewhat useful
   - [ ] Generic/not relevant
   - [ ] Didn't try them

### Overall Creator Experience

5. **How confident do you feel creating ideas on VentureLab?**
   - [ ] Very confident
   - [ ] Somewhat confident
   - [ ] Neutral
   - [ ] Not confident

6. **How likely are you to use VentureLab regularly?**
   - [ ] Very likely
   - [ ] Somewhat likely
   - [ ] Maybe
   - [ ] Unlikely

7. **What was your favorite part of creating an idea?**
   - Free response: ________________________

8. **What frustrated you the most?**
   - Free response: ________________________

9. **What would make you want to use VentureLab daily?**
   - Free response: ________________________

10. **Missing features or improvements?**
    - Free response: ________________________
```

### Collaborator Experience Feedback

```
## What You Tested
- [ ] Dashboard
- [ ] Browse Ideas
- [ ] Evaluate Ideas
- [ ] Propose Collaboration
- [ ] Manage Invitations
- [ ] Active Collaborations

## Questions

### Template-Structured Ideas (NEW in Phase 3)

1. **Could you quickly understand if an idea was a good fit?**
   - [ ] Yes, very quickly (< 2 minutes)
   - [ ] Somewhat (2-5 minutes)
   - [ ] Took a while (5-10 minutes)
   - [ ] Too confusing/long

2. **Were templated ideas easier to evaluate than non-templated?**
   - [ ] Yes, much easier
   - [ ] Yes, somewhat easier
   - [ ] No difference
   - [ ] Harder to read

3. **How clear were the idea structures?**
   - [ ] Very clear sections
   - [ ] Mostly clear
   - [ ] Somewhat confusing
   - [ ] Very confusing

4. **How confident are you in your collaboration matches?**
   - [ ] Very confident I'd be good fit
   - [ ] Somewhat confident
   - [ ] Neutral
   - [ ] Not confident

### Overall Collaborator Experience

5. **How likely are you to use VentureLab to find projects?**
   - [ ] Very likely
   - [ ] Somewhat likely
   - [ ] Maybe
   - [ ] Unlikely

6. **How would you rate finding ideas vs. other platforms?**
   - [ ] Better than alternatives
   - [ ] Similar to alternatives
   - [ ] Worse than alternatives
   - [ ] Haven't tried alternatives

7. **What was your favorite part?**
   - Free response: ________________________

8. **What frustrated you the most?**
   - Free response: ________________________

9. **What would make you come back daily?**
   - Free response: ________________________

10. **What features are missing?**
    - Free response: ________________________
```

### Overall Feedback

```
## General Questions

1. **How would you rate the overall experience?**
   - [ ] Excellent
   - [ ] Good
   - [ ] Okay
   - [ ] Needs improvement
   - [ ] Poor

2. **Compared to similar platforms, how does VentureLab compare?**
   - [ ] Better
   - [ ] About the same
   - [ ] Worse
   - [ ] Haven't used similar platforms

3. **Would you recommend VentureLab to others?**
   - [ ] Definitely yes
   - [ ] Probably yes
   - [ ] Maybe
   - [ ] Probably no
   - [ ] Definitely no

4. **What surprised you most (good or bad)?**
   - Free response: ________________________

5. **One thing you'd change immediately?**
   - Free response: ________________________

6. **Most important feature to have?**
   - Free response: ________________________
```

---

## Bug Reporting Checklist

Before you submit a bug report, verify:

- [ ] I've described the exact steps to reproduce
- [ ] I've explained what should happen (expected)
- [ ] I've explained what actually happened (actual)
- [ ] I've included my environment (browser, device, OS)
- [ ] I've noted the severity level
- [ ] I've included screenshot or video if possible
- [ ] I've checked if this is a real bug (not user error)
- [ ] I've looked in console for error messages (F12)
- [ ] I haven't included sensitive info (passwords, real names)
- [ ] I've given it a clear, descriptive title

---

## How to Report

### Option 1: Slack (Fastest) 🚀

Post in `#venturelab-testing` channel:

```
🐛 Bug: [Bug Title]

[Paste template above with details]

Screenshots: [Attach image or describe where to find it]
```

**Best for:** Quick feedback, urgent bugs, or you prefer chat

**Response time:** Usually within 1 hour during business hours

---

### Option 2: Bug Tracking Form

Access form at: [Link will be provided]

**Fields:**
- Bug title
- Description
- Steps to reproduce
- Expected vs Actual
- Screenshots
- Severity
- Additional context

**Best for:** Formal tracking, detailed bugs, records

**Response time:** Tracked by engineering, prioritized daily

---

### Option 3: Google Form

Access form at: [Link will be provided]

**Good for:** Simple bugs, if other methods unavailable

---

## Triage & Response Time

### Critical Bugs (🔴)

| Status | Action | Timeline |
|--------|--------|----------|
| Reported | Immediate notification to lead engineer | Within 5 minutes |
| Acknowledged | Engineering confirms and starts investigating | Within 30 minutes |
| In Progress | Being actively debugged | Within 2 hours |
| Fixed | Code fix merged and deployed | Within 24 hours |
| Verified | Tester confirms fix works | Within 48 hours |

### High Bugs (🟠)

| Status | Action | Timeline |
|--------|--------|----------|
| Reported | Added to daily standup | Within 1 hour |
| Triaged | Severity confirmed, assigned to engineer | Within 4 hours |
| In Progress | Being worked on | Within 24 hours |
| Fixed | Deployed | Within 48 hours |

### Medium Bugs (🟡)

| Status | Action | Timeline |
|--------|--------|----------|
| Reported | Added to backlog | By end of day |
| Triaged | Prioritized relative to other work | Within 2 days |
| In Progress | Worked on when bandwidth available | Within 1 week |
| Fixed | Deployed with other fixes | Within 2 weeks |

### Low Bugs (🟢)

| Status | Action | Timeline |
|--------|--------|----------|
| Reported | Added to nice-to-have list | By end of week |
| Triaged | Lower priority | As time allows |
| Fixed | Batch fixed with other improvements | Ongoing |

---

## Bug Status Updates

You'll get updates via:

- **Slack:** Direct message if you reported in channel
- **Email:** Summary of reported bugs (daily or weekly)
- **Dashboard:** [Link to be provided] - Real-time status

---

## Feedback Impact

Your feedback directly influences:

| Feedback | Impacts |
|----------|---------|
| **Critical Bugs** | Immediate fixes, may delay release |
| **High Bugs** | Prioritized in sprint |
| **Feature Feedback** | Product roadmap planning |
| **UX Feedback** | Design iterations |
| **Performance Feedback** | Optimization efforts |
| **Missing Features** | Phase 4 planning |

---

## FAQ on Bug Reporting

**Q: What if I'm not sure if it's a bug?**
A: Report it anyway! Better to report something that's user error than miss a real bug. We'll triage it.

**Q: Should I report UI/cosmetic bugs?**
A: Yes! Typos, misaligned buttons, color issues. These improve the overall polish.

**Q: What if I found the same bug as someone else?**
A: Report it! Multiple reports confirm it's not isolated and helps with prioritization.

**Q: Can I suggest features in bug reports?**
A: Use the Feedback Form for feature suggestions instead. But if a bug prevented using a feature, mention it!

**Q: How do I know my bug was received?**
A: Slack reports get emoji reaction. Form submissions get confirmation. You'll get status updates.

**Q: Can I report on behalf of someone else?**
A: Mention in the report: "Reported by [name]" so we can follow up.

---

## Thank You! 🙏

Every bug report helps make VentureLab better.
Every piece of feedback helps us understand what matters most.

Your contribution is valuable and appreciated.

---

**Questions?** Contact your testing coordinator.

**Ready to report bugs?** Jump to Slack `#venturelab-testing` 🚀
