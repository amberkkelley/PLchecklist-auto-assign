// client.js

window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [
      {
        icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png',
        text: 'Assign Checklist Tasks',
        callback: async function(t) {
          const checklistName = "Pre Listing Checklist";

          const card = await t.card('id', 'members', 'customFieldItems');
          const board = await t.board('customFields');

          const liveDateField = board.customFields.find(f => f.name === 'Live Date');
          const liveDateItem = card.customFieldItems.find(item => item.idCustomField === liveDateField?.id);
          const liveDate = liveDateItem?.value?.date ? new Date(liveDateItem.value.date) : null;
          const assignedMembers = card.members.map(m => m.id);

          let checklistId;
          const existingChecklists = await t.checklists('all');
          const existing = existingChecklists.find(cl => cl.name === checklistName);

          if (!existing) {
            const created = await t.post(`/cards/${card.id}/checklists`, {
              name: checklistName
            });
            checklistId = created.id;
          } else {
            checklistId = existing.id;
          }

          const memberMap = {
            "Abby": "6644e3b205a89d31a0303ea2",
            "Amber": "67871bc141d0919aba6298f9"
          };

          const tasks = [
            { name: "Confirm listing is still going live in 2 days (if delayed, cancel/reschedule sign and supra install)", member: "Abby", dueOffset: -2 },
            { name: "Download/upload all photos to listing drive folder", member: "Abby", dueOffset: -2 },
            { name: "Review images: check for edits, missing rooms, or digital staging needs", member: "Agent", dueOffset: -2 },
            { name: "Upload best 42 pics to MLS draft", member: "Agent", dueOffset: -2 },
            { name: "Organize photo order to match layout of home (preferably by someone who’s been inside)", member: "Agent", dueOffset: -2 },
            { name: "Add descriptive captions under each image (disclose virtual staging if needed)", member: "Agent", dueOffset: -2 },
            { name: "Final photo approval from listing agent", member: "Agent", dueOffset: -2 },
            { name: "Create marketing and broker remarks / review with Molly or Michele", member: "Agent", dueOffset: -2 },
            { name: "Create silent talkers (if necessary)", member: "Agent", dueOffset: -2 },
            { name: "Upload marketing and broker remarks to listing", member: "Abby", dueOffset: -2 },
            { name: "Finalize all following forms, seller has signed, and uploaded in supplements", member: "Abby", dueOffset: -2 },
            { name: "- Form 22K", member: "Abby", dueOffset: -2 },
            { name: "- Form 22J  (if needed)", member: "Abby", dueOffset: -2 },
            { name: "- Form 35P (if needed)", member: "Abby", dueOffset: -2 },
            { name: "- Form 22E (FIRPTA)", member: "Abby", dueOffset: -2 },
            { name: "- Form 17", member: "Abby", dueOffset: -2 },
            { name: "- Exhibit A Legal Description", member: "Abby", dueOffset: -2 },
            { name: "Confirm open house / showing availability with seller (if owner-occupied)", member: "Abby", dueOffset: -2 },
            { name: "Coordinate OH availability / schedule agents for opening weekend", member: "Amber", dueOffset: -2 },
            { name: "Schedule open houses and send calendar invites to LA, OH Agent, Molly & Amber using the template", member: "Abby", dueOffset: -2 },
            { name: "If non HBMH agent is hosting open house, send the calendar invite AND an email using this template", member: "Abby", dueOffset: -2 },
            { name: "Post Open houses in MLS", member: "Abby", dueOffset: -2 },
            { name: "Confirm / check sign installation status", member: "Abby", dueOffset: -2 },
            { name: "Create 'Just Listed' flyer", member: "Amber", dueOffset: -2 },
            { name: "Review flyer with listing agent", member: "Amber", dueOffset: -2 },
            { name: "Send flyer to print", member: "Amber", dueOffset: -2 },
            { name: "Create 'Just Listed' graphic", member: "Amber", dueOffset: -1 },
            { name: "Create OH graphic / send to OH agents for opening weekend", member: "Amber", dueOffset: -1 },
            { name: "Coordinate flyer pick up", member: "Amber", dueOffset: -1 },
            { name: "Drop off new listing flyers, booties, silent talkers and marketing materials at listing", member: "Agent", dueOffset: -1 },
            { name: "Install white sign flag", member: "Agent", dueOffset: -1 },
            { name: "Install directionals (mark on phone location)", member: "Agent", dueOffset: -1 },
            { name: "Transfer key from contractor box to supra key box", member: "Agent", dueOffset: -1 },
            { name: "Enter listing docs in BOLT", member: "Abby", dueOffset: -1 }
          ];

          for (const task of tasks) {
            const due = liveDate ? new Date(liveDate.getTime() + task.dueOffset * 24 * 60 * 60 * 1000) : null;
            await t.api(`/checklists/${checklistId}/checkItems`, {
              method: 'post',
              body: { name: task.name, pos: 'bottom' }
            });
            // You can also apply due date/member assignment via 3rd-party integration if needed
          }

          return t.set('card', 'shared', 'checklist', { id: checklistId });
        }
      }
    ];
  }
});
