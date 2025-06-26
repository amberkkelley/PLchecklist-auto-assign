// client.js

window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return [
      {
        icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png',
        text: 'Assign Checklist Tasks',
        callback: async function(t) {
          console.log("Assign Checklist Tasks button clicked");

          const checklistName = "Pre Listing Checklist";

          const card = await t.card('id', 'members', 'customFieldItems');
          const board = await t.board('customFields');
          console.log("Card data loaded:", card);

          const liveDateField = board.customFields.find(f => f.name === 'Live Date');
          const liveDateItem = card.customFieldItems.find(item => item.idCustomField === liveDateField?.id);
          const liveDate = liveDateItem?.value?.date ? new Date(liveDateItem.value.date) : null;
          console.log("Live date value:", liveDate);

          const assignedMembers = card.members.map(m => m.id);

          let checklistId;
          const existingChecklists = await t.checklists('all');
          const existing = existingChecklists.find(cl => cl.name === checklistName);

          if (!existing) {
            const created = await t.api(`/cards/${card.id}/checklists`, {
              method: 'post',
              body: { name: checklistName }
            });
            checklistId = created.id;
          } else {
            checklistId = existing.id;
          }

          console.log("Checklist ID:", checklistId);

          const tasks = [
            { name: "Confirm listing is still going live in 2 days (if delayed, cancel/reschedule sign and supra install)", dueOffset: -2 },
            { name: "Download/upload all photos to listing drive folder", dueOffset: -2 },
            { name: "Review images: check for edits, missing rooms, or digital staging needs", dueOffset: -2 },
            { name: "Upload best 42 pics to MLS draft", dueOffset: -2 },
            { name: "Organize photo order to match layout of home (preferably by someone who’s been inside)", dueOffset: -2 },
            { name: "Add descriptive captions under each image (disclose virtual staging if needed)", dueOffset: -2 },
            { name: "Final photo approval from listing agent", dueOffset: -2 },
            { name: "Create marketing and broker remarks / review with Molly or Michele", dueOffset: -2 },
            { name: "Create silent talkers (if necessary)", dueOffset: -2 },
            { name: "Upload marketing and broker remarks to listing", dueOffset: -2 },
            { name: "Finalize all following forms, seller has signed, and uploaded in supplements", dueOffset: -2 },
            { name: "- Form 22K", dueOffset: -2 },
            { name: "- Form 22J  (if needed)", dueOffset: -2 },
            { name: "- Form 35P (if needed)", dueOffset: -2 },
            { name: "- Form 22E (FIRPTA)", dueOffset: -2 },
            { name: "- Form 17", dueOffset: -2 },
            { name: "- Exhibit A Legal Description", dueOffset: -2 },
            { name: "Confirm open house / showing availability with seller (if owner-occupied)", dueOffset: -2 },
            { name: "Coordinate OH availability / schedule agents for opening weekend", dueOffset: -2 },
            { name: "Schedule open houses and send calendar invites to LA, OH Agent, Molly & Amber using the template", dueOffset: -2 },
            { name: "If non HBMH agent is hosting open house, send the calendar invite AND an email using this template", dueOffset: -2 },
            { name: "Post Open houses in MLS", dueOffset: -2 },
            { name: "Confirm / check sign installation status", dueOffset: -2 },
            { name: "Create 'Just Listed' flyer", dueOffset: -2 },
            { name: "Review flyer with listing agent", dueOffset: -2 },
            { name: "Send flyer to print", dueOffset: -2 },
            { name: "Create 'Just Listed' graphic", dueOffset: -1 },
            { name: "Create OH graphic / send to OH agents for opening weekend", dueOffset: -1 },
            { name: "Coordinate flyer pick up", dueOffset: -1 },
            { name: "Drop off new listing flyers, booties, silent talkers and marketing materials at listing", dueOffset: -1 },
            { name: "Install white sign flag", dueOffset: -1 },
            { name: "Install directionals (mark on phone location)", dueOffset: -1 },
            { name: "Transfer key from contractor box to supra key box", dueOffset: -1 },
            { name: "Enter listing docs in BOLT", dueOffset: -1 }
          ];

          for (const task of tasks) {
            const due = liveDate ? new Date(liveDate.getTime() + task.dueOffset * 24 * 60 * 60 * 1000) : null;
            const createdItem = await t.api(`/checklists/${checklistId}/checkItems`, {
              method: 'post',
              body: { name: task.name, pos: 'bottom' }
            });
            console.log("Created task:", task.name);
            if (due) {
              await t.api(`/cards/${card.id}/checkItem/${createdItem.id}/due`, {
                method: 'put',
                body: { value: due.toISOString() }
              });
              console.log(`Set due date for ${task.name}: ${due.toISOString()}`);
            }
          }

          return t.set('card', 'shared', 'checklist', { id: checklistId });
        }
      }
    ];
  }
});
