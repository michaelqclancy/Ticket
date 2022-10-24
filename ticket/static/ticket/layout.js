document.addEventListener('DOMContentLoaded', function() {
    load_sidebar_dashboard();
    load_console_dashboard();
});

function load_sidebar_dashboard () {
	event.preventDefault();

	document.querySelector('#sidebar-title').innerHTML = `Dashboard`;
	
    document.querySelector('#sidebar-dashboard').style.display = "block";
    document.querySelector('#sidebar-contacts').style.display = "none";
	document.querySelector('#sidebar-tickets').style.display = "none";
	document.querySelector('#sidebar-user').style.display = "none";
	document.querySelector('#sidebar-admin').style.display = "none";
	return false;
}

function load_sidebar_contacts () {
	event.preventDefault();
	
	document.querySelector('#sidebar-title').innerHTML = `Contacts`;

	document.querySelector('#sidebar-dashboard').style.display = "none";
    document.querySelector('#sidebar-contacts').style.display = "block";
	document.querySelector('#sidebar-tickets').style.display = "none";
	document.querySelector('#sidebar-user').style.display = "none";
	document.querySelector('#sidebar-admin').style.display = "none";

	return false;
}

function load_sidebar_tickets () {
	event.preventDefault();
	
	document.querySelector('#sidebar-title').innerHTML = `Tickets`;

	document.querySelector('#sidebar-dashboard').style.display = "none";
    document.querySelector('#sidebar-contacts').style.display = "none";
	document.querySelector('#sidebar-tickets').style.display = "block";
	document.querySelector('#sidebar-user').style.display = "none";
	document.querySelector('#sidebar-admin').style.display = "none";
	
	return false;
}

function load_sidebar_user () {
	event.preventDefault();
	
	document.querySelector('#sidebar-title').innerHTML = `My Account`;

	document.querySelector('#sidebar-dashboard').style.display = "none";
    document.querySelector('#sidebar-contacts').style.display = "none";
	document.querySelector('#sidebar-tickets').style.display = "none";
	document.querySelector('#sidebar-user').style.display = "block";
	document.querySelector('#sidebar-admin').style.display = "none";

	return false;
}

function load_sidebar_admin () {
	event.preventDefault();
	
	document.querySelector('#sidebar-title').innerHTML = `Management`;

	document.querySelector('#sidebar-dashboard').style.display = "none";
    document.querySelector('#sidebar-contacts').style.display = "none";
	document.querySelector('#sidebar-tickets').style.display = "none";
	document.querySelector('#sidebar-user').style.display = "none";
	document.querySelector('#sidebar-admin').style.display = "block";

	return false;
}

function load_console_dashboard () {    
    event.preventDefault();
    const console_view = document.querySelector('#console-view');
	console_view.innerHTML = ``;
    
    fetch('/dashboard/')
	.then(response => response.json())
	.then(info => {
        console_view.innerHTML = `
            <div style="padding: 20px;">
                <h4>Dashboard</h4>
                <a href="#" onclick="load_console_ticket_create()">New Ticket</a> | <a href="#" onclick="load_console_contact_create()">New Contact</a> | <a href="#" onclick="load_console_announcement_create()">New Announcement</a> | <a href="#" onclick="load_console_dashboard()">Refresh</a>
                <hr>    
                <div class="d-flex flex-wrap">
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid cyan;">My Tickets<h2 id="d1">${info.tickets_user}</h2></div>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid aquamarine;">Unassigned Tickets<h2 id="d2">${info.tickets_unassigned}</h2></div>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid orange;">Open Tickets<h2 id="d3">${info.tickets_open}</h2></div>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid tomato;">High Priority<h2 id="d4">${info.tickets_high}</h2></div><br>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid violet;">Closed Tickets<h2 id="d4">${info.tickets_closed}</h2></div>
                </div><br><br>
                <h4>Announcements</h4>
                <hr>
                <div id="console-view-inner">
                </div>
            </div>
        `;

        const console_view_inner = document.querySelector('#console-view-inner')

        fetch('/announcements/')
	    .then(response => response.json())
	    .then(announcements => {

            announcements.forEach(announcement => {
                const div = document.createElement('div');

                //div.style.backgroundColor = "#e3f2fd"
                div.style.padding = "10px";
                div.style.width = "640px";

                div.innerHTML = `
                    <div id='dashboard_announcement_${announcement.id}'>
                        <a href="#" onclick="load_console_user_display(${announcement.creator})">${announcement.creatorName}</a> | ${announcement.timestamp}<br><br>
                        <h5><div id="headline_${announcement.id}">${announcement.headline}</div></h5>
                        <div id="message_${announcement.id}">${announcement.message}</div>
                        <div id="dashboard_announcement_edit_${announcement.id}" style="display: none;">
                            <br>
                            <a href="#" onclick="console_announcement_edit(${announcement.id})">Edit</a> | <a href="#" onclick="console_announcement_edit_delete(${announcement.id})">Delete</a>
                        </div>
                        <hr>
                    </div>
                    <div id='dashboard_announcement_text_${announcement.id}' style="display: none;">
                        <h5>Edit Announcement</h5><br>
                        <input id="headline_edit_${announcement.id}" class="form-control" style="width: 100%" value="${announcement.headline}" placeholder="Headline"><br>
                        <textarea id="message_edit_${announcement.id}" class="form-control" style="width: 100%" placeholder="Message">${announcement.message}</textarea><br>
                        <a href="#" onclick="console_announcement_edit_save(${announcement.id})">Save</a> | <a href="#" onclick="console_announcement_edit_cancel(${announcement.id})">Cancel</a>
                        <hr>
                    </div>
                `;
                
                console_view_inner.append(div);

                const edit = document.querySelector('#dashboard_announcement_edit_' + announcement.id);

                fetch('/user/get/')
                .then(response => response.json())
                .then(user => {
                    if (user.id == announcement.creator || user.id == -1) {
                        edit.style.display = "block";
                    }
                });
            });
        });

    });
    
	return false;
}

function console_announcement_edit (id) {
    event.preventDefault();

    const announcement = document.querySelector('#dashboard_announcement_' + id);
    const text = document.querySelector('#dashboard_announcement_text_' + id);

    announcement.style.display = "none";
    text.style.display = "block";
}

function console_announcement_edit_cancel (id) {
    event.preventDefault();

    const announcement = document.querySelector('#dashboard_announcement_' + id);
    const text = document.querySelector('#dashboard_announcement_text_' + id);

    announcement.style.display = "block";
    text.style.display = "none";
}

function console_announcement_edit_save (id) {
    event.preventDefault();

    const headline = document.querySelector('#headline_' + id);
    const message = document.querySelector('#message_' + id);

    const headline_edit = document.querySelector('#headline_edit_' + id).value;
    const message_edit = document.querySelector('#message_edit_' + id).value;

    fetch('/announcement/edit/' + id, {
		method: 'POST',
		body: JSON.stringify({
            headline: headline_edit,
            message: message_edit
		})
	})
	.then(response => response.json())
	.then(edit => {
        
        headline.innerHTML = `${edit.headline}`;
        message.innerHTML = `${edit.message}`;

        const announcement = document.querySelector('#dashboard_announcement_' + id);
        const text = document.querySelector('#dashboard_announcement_text_' + id);

        announcement.style.display = "block";
        text.style.display = "none";
	});
}

function console_announcement_edit_delete (id) {
    event.preventDefault();

    const announcement = document.querySelector('#dashboard_announcement_' + id);

    fetch('/announcement/delete/' + id)
    .then(response => response.json())
	.then(result => {
        announcement.innerHTML = `<i>${result.message}</i><hr>`;
    });
}

function load_console_contact_create () {
	event.preventDefault();
	document.querySelector('#console-view').innerHTML = `
	<div style="padding: 20px;  width: 50%;">
        <h4>Create A Contact</h4>
        <a href="#" onclick="load_console_contacts_search()">Cancel</a>
        <hr>
        <h6>Name</h6>
        <input id="console_contact_create_salutation" class="form-control" style="width: 100%;" placeholder="Mr., Mrs., etc."><br>
        <input id="console_contact_create_first" class="form-control" style="width: 100%;" placeholder="First"><br>
        <input id="console_contact_create_last" class="form-control" style="width: 100%;" placeholder="Last">
        <br>
        <h6>Contact Information</h6>
        <input id="console_contact_create_phone" type="tel" class="form-control" style="width: 100%;" placeholder="(555)123-1234"><br>
        <input id="console_contact_create_email" type="email" class="form-control" style="width: 100%;" placeholder="name@email.com">
        <br>
        <h6>Address</h6>
        <input id="console_contact_create_address" type="text" class="form-control" style="width: 100%;" placeholder="Street"><br>
        <input id="console_contact_create_suite" type="text" class="form-control" style="width: 100%;" placeholder="Apt/Suite/Business"><br>
        <input id="console_contact_create_city" type="text" class="form-control" style="width: 100%;" placeholder="City"><br>
        <input id="console_contact_create_state" type="text" class="form-control" style="width: 100%;" placeholder="State"><br>
        <input id="console_contact_create_zip" type="text" class="form-control" style="width: 100%;" placeholder="Zip Code"><br>
        <input id="console_contact_create_country" type="text" class="form-control" style="width: 100%;" placeholder="Country"><br>
        <button class="btn btn-primary" onclick="console_contact_create_save()">Save</button>
	</div>
	`;
	return false;
}

function load_console_contacts_search () {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;

    console_view.innerHTML = `
        <div style="padding: 20px;">
        <h4>Search Contacts</h4>
        <hr>
        <form style="width: 50%;">
            <input type="search" class="form-control" id="console-search-contacts" placeholder="Search Contacts (First Name, Phone Number, ect.)"><br>
            <button type="submit" class="btn btn-primary" onclick="console_contacts_search()">Search</button>
        </form><br>
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Created</th>
                    <th>Creator</th>
                </tr>
            </thead>
            <tbody id="console-view-inner">
            </tbody>
        </table>
        <hr>
    `;

    fetch('/contacts/recent/')
	.then(response => response.json())
	.then(contacts => {
        
        const console_view_inner = document.querySelector('#console-view-inner')

        contacts.forEach(contact => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='contact${contact.id}' href='#' onclick="load_console_contact_display(${contact.id})">${contact.id}</a></th>
                <td><a href='#' onclick="load_console_contact_display(${contact.id})">${contact.salutation} ${contact.first} ${contact.last}<a></td>
                <td>${contact.phone}<br>${contact.email}</td>
                <td>${contact.address}
                    ${contact.suite}<br>
                    ${contact.city}, ${contact.state} ${contact.zip}<br>
                    ${contact.country}</td>
                <td>${contact.timestamp}</td>
                <td><a href="#" onclick="load_console_user_display(${contact.creator})">${contact.creatorName}</a></td>
            `;
            console_view_inner.append(tr);
        });
    });
}

function load_console_contact_display (id) {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;

	fetch('/contact/' + id)
	.then(response => response.json())
	.then(contact => {
	  console.log(contact);

      console_view.innerHTML = `
            <div style="padding: 20px; width: 75%;">
                    <h4>${contact.name}</h4>
                    <a href="#" onclick="console_contact_edit(${contact.id})">Edit</a> | <a href="#" onclick="load_console_contact_display(${contact.id})">Refresh</a><br><br>
                    Created by <i><a href='#'>${contact.creatorName}</a></i> on ${contact.timestamp}<br>
                    <hr>
                    <div style="width: 120px; display:inline-block;">
                        <div id="console-contact-id-label">Contact ID:</div>
                        <div id="console-contact-address-label">Owner:</div>
                        <div id="console-contact-address-label">Phone:</div>
                        <div id="console-contact-address-label">Email:</div>
                        <div id="console-contact-address-label">Address:</div>
                        <br>
                        <br>
                        <br>
                    </div>
                    <div style="display:inline-block;">
                        <div id="console-contact-contact">${contact.id}</div>
                        <div id="console-contact-address"><a href='#' onclick="load_console_user_display (${contact.creator})">${contact.creatorName}</a></div>
                        <div id="console-contact-contact">${contact.phone}</div>
                        <div id="console-contact-contact">${contact.email}</div>
                        <div id="console-contact-suite">${contact.address}</div>
                        <div id="console-contact-suite">${contact.suite}</div>
                        <div id="console-contact-city-state-zip">${contact.city}, ${contact.state} ${contact.zip}</div>
                        <div id="console-contact-country">${contact.country}</div>
                    </div>
                    <br><br>
                    <h6>Customer Tickets</h6>
                    <div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Creator</th>
                                    <th>Owner By</th>
                                    <th>Date Created</th>
                                </tr>
                            </thead>
                            <tbody id="console-view-inner">

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    });

    fetch('/tickets/contact/' + id)
    .then(response => response.json())
    .then(tickets => {
        
        const console_view_inner = document.querySelector('#console-view-inner')

        tickets.forEach(ticket => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
                <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
                <td>${ticket.status}</td>
                <td>${ticket.priority}</td>
                <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
                <td><a href="#" onclick="load_console_user_display(${ticket.owner})">${ticket.ownerName}</a></td>
                <td>${ticket.timestamp}</td>
            `;
            console_view_inner.append(tr);
        });
    })
	
	return false;
}
//xxx
function console_comment_edit (id) {
    event.preventDefault();

    const comment = document.querySelector('#ticket_comment_' + id);
    const text = document.querySelector('#ticket_comment_text_' + id);

    comment.style.display = "none";
    text.style.display = "block";
}

function console_comment_edit_cancel (id) {
    event.preventDefault();

    const comment = document.querySelector('#ticket_comment_' + id);
    const text = document.querySelector('#ticket_comment_text_' + id);

    comment.style.display = "block";
    text.style.display = "none";
}

function console_comment_edit_save (id) {
    event.preventDefault();

    const message = document.querySelector('#message_' + id);
    const message_edit = document.querySelector('#message_edit_' + id).value;

    fetch('/comment/edit/' + id, {
		method: 'POST',
		body: JSON.stringify({
            message: message_edit
		})
	})
	.then(response => response.json())
	.then(edit => {
        
        message.innerHTML = `${edit.message}`;

        const comment = document.querySelector('#ticket_comment_' + id);
        const text = document.querySelector('#ticket_comment_text_' + id);

        comment.style.display = "block";
        text.style.display = "none";
	});
}

function console_comment_edit_delete (id) {
    event.preventDefault();

    const announcement = document.querySelector('#ticket_comment_' + id);

    fetch('/comment/delete/' + id)
    .then(response => response.json())
	.then(result => {
        announcement.innerHTML = `<i>${result.message}</i><hr>`;
    });
}

function load_console_ticket_create () {
	event.preventDefault();
	document.querySelector('#console-view').innerHTML = `
	<div style="padding: 20px;  width: 50%;">
            <h4>Create A Ticket</h4>
            <a href="#" onclick="load_console_tickets_all()">Cancel</a>
			<hr>
			<h6>Ticket Status</h6>
			<div class="form-group">
				<select class="form-control" id="console_ticket_create_status">
                    <option value="Unassigned">Unassigned</option>
                    <option value="New">New</option>
					<option value="Pending">Pending</option>
					<option value="Completed">Completed</option>
				</select>
			</div>
			<h6>Ticket Priority</h6>
			<div class="form-group">
				<select class="form-control" id="console_ticket_create_priority">
					<option value="Low">Low</option>
					<option value="Medium" selected>Medium</option>
					<option value="High">High</option>
				</select>
			</div>
			<h6>Ticket Type</h6>
			<div class="form-group">
				<select class="form-control" id="console_ticket_create_ticketType">
					<option value="General">General</option>
					<option value="Customer">Customer</option>
					<option value="Marketing">Marketing</option>
					<option value="Maintenance">Maintenance</option>
					<option value="Sales">Sales</option>
					<option value="Support">Support</option>
					<option value="Technical">Technical</option>
					<option value="Other">Other</option>
				</select>
			</div>
			<h6>Subject</h6>
			<input id="console_ticket_create_subject" class="form-control" style="width: 100%;"></input><br>
			<h6>Body<h6>
			<textarea id="console_ticket_create_body" class="form-control" style="width: 100%"></textarea><br><br>
			<button class="btn btn-primary" onclick="console_ticket_create_save()">Save</button>
		</div>
	</div>
	`;
	return false;
}

function load_console_tickets_all () {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/tickets/')
	.then(response => response.json())
	.then(tickets => {
	    // Print Tickets
	    console.log(tickets);
      
        console_view.innerHTML = `
            <div style="padding: 20px;">
                <h4>All Tickets</h4><br>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Subject</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Creator</th>
                                <th>Owner</th>
                                <th>Date Created</th>
                            </tr>
                        </thead>
                        <tbody id="console-view-inner">

                        </tbody>
                    </table>
                </div>
            </div>
        `;

        const console_view_inner = document.querySelector('#console-view-inner')

	    tickets.forEach(ticket => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
                <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
                <td><a href="#" onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></td>
                <td>${ticket.status}</td>
                <td>${ticket.priority}</td>
                <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
                <td><a href="#" onclick="load_console_user_display(${ticket.owner})">${ticket.ownerName}</a></td>
                <td>${ticket.timestamp}</td>
            `;
            console_view_inner.append(tr);
        });
	});
	return false;
}

function load_console_tickets_open () {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/tickets/open')
	.then(response => response.json())
	.then(tickets => {
	    // Print Tickets
	    console.log(tickets);
      
        console_view.innerHTML = `
            <div style="padding: 20px;">
                <h4>All Open Tickets</h4><br>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Creator</th>
                            <th>Owner</th>
                            <th>Date Created</th>
                        </tr>
                    </thead>
                    <tbody id="console-view-inner">
                    </tbody>
                </table>
            </div>
        `;

        const console_view_inner = document.querySelector('#console-view-inner')

	    tickets.forEach(ticket => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
                <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
                <td><a href="#" onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></td>
                <td>${ticket.status}</td>
                <td>${ticket.priority}</td>
                <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
                <td><a href="#" onclick="load_console_user_display(${ticket.owner})">${ticket.ownerName}</a></td>
                <td>${ticket.timestamp}</td>
            `;
            console_view_inner.append(tr);
        });
    });onclick="load_console_user_display(${.creator})"
    
	return false;
}

function load_console_tickets_unassigned () {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/tickets/unassigned')
	.then(response => response.json())
	.then(tickets => {
	  // Print Tickets
	  console.log(tickets);
      
      console_view.innerHTML = `
        <div style="padding: 20px;">
            <h4>Unassigned Tickets</h4><br>
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Subject</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Creator</th>
                        <th>Date Created</th>
                    </tr>
                </thead>
                <tbody id="console-view-inner">
                </tbody>
            </table>
        </div>
    `;

    const console_view_inner = document.querySelector('#console-view-inner')

    tickets.forEach(ticket => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
        <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
        <td><a href="#" onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></td>
        <td>${ticket.status}</td>
        <td>${ticket.priority}</td>
        <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
        <td>${ticket.timestamp}</td>
        `;
        console_view_inner.append(tr);
    });
});

return false;
}

function load_console_tickets_user () {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/tickets/user/')
	.then(response => response.json())
	.then(tickets => {
	    // Print Tickets
	    console.log(tickets);
      
        console_view.innerHTML = `
            <div style="padding: 20px;">
                <h4>My Open Tickets</h4><br>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Creator</th>
                            <th>Date Created</th>
                        </tr>
                    </thead>
                    <tbody id="console-view-inner">
                    </tbody>
                </table>
            </div>
        `;

        const console_view_inner = document.querySelector('#console-view-inner')

	    tickets.forEach(ticket => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
                <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
                <td><a href="#" onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></td>
                <td>${ticket.status}</td>
                <td>${ticket.priority}</td>
                <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
                <td>${ticket.timestamp}</td>
            `;
            console_view_inner.append(tr);
        });
    });
    
	return false;
}

function load_console_ticket_display (id) {
    event.preventDefault();
	const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;

	fetch('/ticket/' + id)
	.then(response => response.json())
	.then(ticket => {
	  // Print Tickets
      console.log(ticket);

      console_view.innerHTML = `
            <div style="padding: 20px; width: 75%;">
                    <h4>Ticket #${ticket.id}</h4>
                    <a href="#" onclick="console_ticket_edit(${ticket.id})">Edit</a> | <a href="#" onclick="console_ticket_assign(${ticket.id})">Assign</a> | <a href="#" onclick="console_ticket_contact(${ticket.id})">Contact</a> | <a href="#" onclick="console_ticket_take(${ticket.id})">Take</a> | <a href="#" onclick="console_ticket_clone(${ticket.id})">Duplicate</a> | <a href="#" onclick="console_ticket_close(${ticket.id})">Close</a> | <a href="#" onclick="load_console_ticket_display(${ticket.id})">Refresh</a><br><br>
                    Created by <i><a href='#' onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></i> on ${ticket.timestamp}<br>
                    <hr>
                    <div style="width: 120px; display:inline-block;">
                        <div id="console-ticket-contact-label">Contact:<a></div>
                        <div id="console-ticket-owner-label">Owner:</div>
                        <div id="console-ticket-priority-label">Priority:</div>
                        <div id="console-ticket-status-label">Status:</div>
                        <div id="console-ticket-type-label">Type:</div>
                    </div>
                    <div style="display:inline-block;">
                        <div id="console-ticket-contact"><a href='#' onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></div>
                        <div id="console-ticket-owner"><a href='#' onclick="load_console_user_display(${ticket.owner})">${ticket.ownerName}</a></div>
                        <div id="console-ticket-priority">${ticket.priority}</div>
                        <div id="console-ticket-status">${ticket.status}</div>
                        <div id="console-ticket-type">${ticket.ticketType}</div>
                    </div>
                    <br><br>
                    <h6>Ticket Details</h6>
                    <hr>
                    <div style="width: 120px; display:inline-block;">Subject:</div>
                    <div style="display:inline-block;" id="console-ticket-subject">${ticket.subject}</div>
                    <br><br>
                    <div id="console-ticket-body">${ticket.body}</div>
                    <br><br>
                    <h6>Ticket Comments</h6>
                    <hr>
                    <div>
                        <textarea id="console-ticket-comment-add" style="width: 100%;"></textarea><br>
                        <a href="#" onclick="console_ticket_comment(${ticket.id})">Add A Comment</a>
                    </div>
                    <hr>
                    <div id="console-view-tickets">

                    </div>
                </div>
            </div>
        `;

        fetch('/comments/' + id)
        .then(response => response.json())
        .then(comments => {
            
            comments.forEach(comment => {
                const div = document.createElement('div');
                const console_view_comments = document.querySelector('#console-view-tickets');
                div.innerHTML = `
                    <div id="ticket_comment_${comment.id}">
                        <a href='#' id="comment_${comment.id}" onclick="load_console_user_display (${comment.creator})">${comment.creatorName}</a> | ${comment.timestamp}<br>
                        <div id="message_${comment.id}">${comment.message}</div><br>
                        <div id="ticket_comment_edit_${comment.id}" style="display: none;">
                            <br>
                            <a href="#" onclick="console_comment_edit(${comment.id})">Edit</a> | <a href="#" onclick="console_comment_edit_delete(${comment.id})">Delete</a>
                        </div>
                        <hr>
                    </div>
                    <div id="ticket_comment_text_${comment.id}" style="display: none;">
                        <h5>Edit Comment</h5><br>
                        <textarea id="message_edit_${comment.id}" class="form-control" style="width: 100%" placeholder="Message">${comment.message}</textarea><br>
                        <a href="#" onclick="console_comment_edit_save(${comment.id})">Save</a> | <a href="#" onclick="console_comment_edit_cancel(${comment.id})">Cancel</a>
                        <hr>
                    </div>
                `;
                console_view_comments.append(div);

                const edit = document.querySelector('#ticket_comment_edit_' + comment.id);

                fetch('/user/get/')
                .then(response => response.json())
                .then(user => {
                    if (user.id == comment.creator || user.id == -1) {
                        edit.style.display = "block";
                    }
                });
            });
        })
    });
	
	return false;
}

function load_console_search ()
{
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;

    text = document.querySelector('#search-bar-nav').value;

    fetch('/search/' + text)
    .then(response => response.json())
    .then(tickets => {
        
        console_view.innerHTML = `
            <div style="padding: 20px;">
                <h4>Search Results</h4>
                Showing search results for <i>${text}</i>.<br>
                <br>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Creator</th>
                            <th>Owner</th>
                            <th>Date Created</th>
                        </tr>
                    </thead>
                    <tbody id="console-view-inner">
                    </tbody>
                </table>
            </div>
        `;

        const console_view_inner = document.querySelector('#console-view-inner')

	    tickets.forEach(ticket => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
                <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
                <td><a href="#" onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></td>
                <td>${ticket.status}</td>
                <td>${ticket.priority}</td>
                <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
                <td><a href="#" onclick="load_console_user_display(${ticket.owner})">${ticket.ownerName}</a></td>
                <td>${ticket.timestamp}</td>
            `;
            console_view_inner.append(tr);
        });
    });
    
	return false;
}

function load_console_users () {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/users/')
	.then(response => response.json())
	.then(profiles => {
	    // Print Tickets
	    console.log(profiles);

        console_view.innerHTML = `
            <div style="padding: 20px;">
            <h4>User Accounts</h4>
            <hr>
            <div id="console-view-inner">
            </div>
            </div>
        `;

      const console_view_inner = document.querySelector('#console-view-inner')

        profiles.forEach(profile => {
            const div = document.createElement('div');
            div.innerHTML = `<a id='user${profile.user_id}' href='#' onclick="load_console_user_display(${profile.user_id})">${profile.name}</a>`;
            console_view_inner.append(div);
        });
	});

	return false;
}

function load_console_user_display (id) {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/user/' + id)
	.then(response => response.json())
	.then(profile => {
	    console.log(profile);

        console_view.innerHTML = `
            <div style="padding: 20px;">
            <h4>${profile.name}</h4>
            <hr>
            <div id="console-view-data">
            </div>
            <br><br>
            <div>
                <h4>User Tickets</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Creator</th>
                            <th>Date Created</th>
                        </tr>
                    </thead>
                    <tbody id="console-view-tickets">
                    </tbody>
                </table>
            </div>
            <hr>
            <br><br>
            <h4>Recent Activity</h4>
            <hr>
                <div id="console-view-activity">
                </div>
            </div>
        `;

        fetch('user/data/' + id)
	    .then(response => response.json())
	    .then(data => {

            const console_view_data = document.querySelector('#console-view-data')

            console_view_data.innerHTML = `
                <div class="d-flex flex-wrap">
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid cyan;">Tickets Open<h2 id="d3">${data.tickets_open}</h2></div>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid orange;">Tickets Created<h2 id="d1">${data.tickets_created}</h2></div>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid tomato;">High Priority<h2 id="d2">${data.tickets_high}</h2></div>
                    <div class="p-2" style="width: 200px; height: 100px; margin: 10px; border-left: 5px solid violet;">Closed Tickets<h2 id="d4">${data.tickets_closed}</h2></div>
                </div>
            `;
        })

        fetch('/user/tickets/' + id)
        .then(response => response.json())
        .then(tickets => {
            
            const console_view_tickets = document.querySelector('#console-view-tickets')

            tickets.forEach(ticket => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th><a id='ticket${ticket.id}' href='#' onclick="load_console_ticket_display(${ticket.id})">${ticket.id}</a></th>
                    <td><a href="#" onclick="load_console_ticket_display(${ticket.id})">${ticket.subject}</a></td>
                    <td><a href="#" onclick="load_console_contact_display(${ticket.contact})">${ticket.contactName}</a></td>
                    <td>${ticket.status}</td>
                    <td>${ticket.priority}</td>
                    <td><a href="#" onclick="load_console_user_display(${ticket.creator})">${ticket.creatorName}</a></td>
                    <td>${ticket.timestamp}</td>
                `;
                console_view_tickets.append(tr);
            });
        })

        fetch('user/activity/' + id)
	    .then(response => response.json())
	    .then(activities => {

            const console_view_activity = document.querySelector('#console-view-activity')

            activities.forEach(activity => {
                const div = document.createElement('div');
                div.innerHTML = `${activity.creatorName} ${activity.message} ${activity.special}<br>
                <i>${activity.timestamp}</i><br><br>`;
                console_view_activity.append(div);
            });
        })
	});

	
	return false;
}

function load_console_user_create () {
    event.preventDefault();
	document.querySelector('#console-view').innerHTML = `
	<div style="padding: 20px;  width: 50%;">
            <h4>Create A User</h4>
            <a href="#" onclick="load_console_users()">Cancel</a>
			<hr>
            <h6>Name</h6>
            <input id="console_user_create_first" class="form-control" style="width: 100%;" placeholder="First"><br>
            <input id="console_user_create_last" class="form-control" style="width: 100%;" placeholder="Last">
            <br>
            <h6>Account Information</h6>
            <input id="console_user_create_username" class="form-control" style="width: 100%;" placeholder="Username"><br>
            <input id="console_user_create_password" class="form-control" style="width: 100%;" placeholder="Password"><br>
            <input id="console_user_create_email" type="email" class="form-control" style="width: 100%;" placeholder="name@email.com"><br>
            <div class="form-group">
				<select class="form-control" id="console_user_create_role">
					<option value="Agent">Agent</option>
					<option value="Management">Management</option>
				</select>
			</div>
            <button class="btn btn-primary" onclick="console_user_create_save()">Save</button>
		</div>
	</div>
	`;
	return false;
}

function load_console_user_password () {
    event.preventDefault();
    
    document.querySelector('#console-view').innerHTML = `
	<div style="padding: 20px;  width: 50%;">
            <h4>Change User Password</h4>
			<hr>
            <input id="console_user_password" type="password" class="form-control" style="width: 100%;" placeholder="Password"><br>
            <input id="console_user_password_confirm" type="password" class="form-control" style="width: 100%;" placeholder="Confirm Password"><br>
            <button class="btn btn-primary" onclick="console_user_password_save()">Save</button>
            <div id="console_view_message">
			</div>
		</div>
	</div>
    `;
    
	return false;
}

function console_user_password_save() {
    event.preventDefault();

    const password = document.querySelector('#console_user_password').value
    const confirm = document.querySelector('#console_user_password_confirm').value

    fetch('/user/password/', {
		method: 'POST',
		body: JSON.stringify({
            password: password,
            confirm: confirm
		})
	})
	.then(response => response.json())
	.then(result => {
        document.querySelector('#console_view_message').innerHTML = `
            <hr>
            <br>
            <div style="color: Tomato">${result.message}</div>
        `;
	});

    return false;
}

function load_console_announcement_create () {
    event.preventDefault();
	document.querySelector('#console-view').innerHTML = `
	<div style="padding: 20px;  width: 50%;">
            <h4>Create An Announcement</h4>
            <a href="#" onclick="load_console_dashboard()">Cancel</a>
			<hr>
            <input id="console_announcement_create_headline" class="form-control" style="width: 100%;" placeholder="Headline"><br>
            <textarea id="console_announcement_create_message" class="form-control" style="width: 100%;" placeholder="Message"></textarea><br>
            
            <button class="btn btn-primary" onclick="console_announcement_create_save()">Save</button>
		</div>
	</div>
	`;
	return false;
}

function console_ticket_create_save () {
	event.preventDefault();
	
	const priority = document.querySelector('#console_ticket_create_priority').value
	const status = document.querySelector('#console_ticket_create_status').value
	const ticketType = document.querySelector('#console_ticket_create_ticketType').value
	const subject = document.querySelector('#console_ticket_create_subject').value
	const body = document.querySelector('#console_ticket_create_body').value
	
	fetch('/ticket/create/', {
		method: 'POST',
		body: JSON.stringify({
			priority: priority,
			status: status,
			ticketType: ticketType,
			subject: subject,
			body: body
		})
	  })
	  .then(response => response.json())
	  .then(result => {
		  // Print result
		  console.log(result);
	  });

	  load_console_tickets_user();

	  return false;
}

function console_ticket_clone (id) {
    event.preventDefault();
    
    fetch('/ticket/' + id)
	.then(response => response.json())
	.then(ticket => {
        document.querySelector('#console-view').innerHTML = `
            <div style="padding: 20px;  width: 50%;">
                    <h4>Clone Ticket  #${ticket.id}</h4>
                    <hr>
                    <h6>Ticket Status</h6>
                    <div class="form-group">
                        <select class="form-control" id="console_ticket_clone_status">
                            <option value="Unassigned">Unassigned</option>
                            <option value="New">New</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <h6>Ticket Priority</h6>
                    <div class="form-group">
                        <select class="form-control" id="console_ticket_clone_priority">
                            <option value="Low">Low</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <h6>Ticket Type</h6>
                    <div class="form-group">
                        <select class="form-control" id="console_ticket_clone_ticketType">
                            <option value="General">General</option>
                            <option value="Customer">Customer</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Sales">Sales</option>
                            <option value="Support">Support</option>
                            <option value="Technical">Technical</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <h6>Subject</h6>
                    <input id="console_ticket_clone_subject" class="form-control" style="width: 100%;"></input><br>
                    <h6>Body<h6>
                    <textarea id="console_ticket_clone_body" class="form-control" style="width: 100%"></textarea><br><br>
                    <button class="btn btn-primary" onclick="console_ticket_clone_save()">Save</button>
                </div>
            </div>
        `;

        document.querySelector("#console_ticket_clone_status").value = ticket.status;
        document.querySelector("#console_ticket_clone_priority").value = ticket.priority;
        document.querySelector("#console_ticket_clone_ticketType").value = ticket.ticketType;
        document.querySelector("#console_ticket_clone_subject").value = ticket.subject;
        document.querySelector("#console_ticket_clone_body").value = ticket.body;
    })
	
    return false;
    

}

function console_ticket_clone_save () {
    const status = document.querySelector("#console_ticket_clone_status").value;
    const priority = document.querySelector("#console_ticket_clone_priority").value;
    const ticketType = document.querySelector("#console_ticket_clone_ticketType").value;
    const subject = document.querySelector("#console_ticket_clone_subject").value;
    const body = document.querySelector("#console_ticket_clone_body").value;

    fetch('/ticket/create/', {
		method: 'POST',
		body: JSON.stringify({
			priority: priority,
			status: status,
			ticketType: ticketType,
			subject: subject,
            body: body
		})
    })
    .then(response => response.json())
	.then(result => {
        console.log(result);
    })
    load_console_tickets_user();
}

function console_ticket_assign (id) {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;
    
    fetch('/users/')
	.then(response => response.json())
	.then(profiles => {
	    // Print Tickets
	    console.log(profiles);

        console_view.innerHTML = `
            <div style="padding: 20px;">
            <h4>Assign User To Ticket #${id}</h4>
            <hr>
            <div id="console-view-inner">
            </div>
            </div>
        `;

      const console_view_inner = document.querySelector('#console-view-inner')

	  profiles.forEach(profile => {
		  const div = document.createElement('div');
		  div.innerHTML = `<a id='user${profile.user_id}' href='#' onclick="console_ticket_assign_save(${id}, ${profile.user_id})">${profile.name}</a>`;
		  console_view_inner.append(div);
      });
	});
	
	return false;
}

function console_ticket_assign_save (ticket, user) {
    event.preventDefault();

    fetch('/ticket/assign/' + ticket + '/' + user)
    load_console_ticket_display(ticket)
    return false;
}

function console_ticket_edit (id) {
    event.preventDefault();
    
    fetch('/ticket/' + id)
	.then(response => response.json())
	.then(ticket => {
	    // Print Tickets
        console.log(ticket);
        document.querySelector('#console-view').innerHTML = `
            <div style="padding: 20px; width: 75%;">
                <h4>Edit Ticket #${ticket.id}</h4>
                <a href="#" onclick="load_console_ticket_display(${id})">Cancel</a>
                <hr>
                <h6>Ticket Status</h6>
                <div class="form-group">
                    <select class="form-control" id="console_ticket_edit_status">
                        <option value="Unassigned">Unassigned</option>
                        <option value="New">New</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <h6>Ticket Priority</h6>
                <div class="form-group">
                    <select class="form-control" id="console_ticket_edit_priority">
                        <option value="Low">Low</option>
                        <option value="Medium" selected>Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <h6>Ticket Type</h6>
                <div class="form-group">
                    <select class="form-control" id="console_ticket_edit_ticketType">
                        <option value="General">General</option>
                        <option value="Customer">Customer</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Sales">Sales</option>
                        <option value="Support">Support</option>
                        <option value="Technical">Technical</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <h6>Subject</h6>
                <input id="console_ticket_edit_subject" class="form-control" style="width: 100%;" value="${ticket.subject}"></input><br>
                <h6>Body<h6>
                <textarea id="console_ticket_edit_body" class="form-control" style="width: 100%" >${ticket.body}</textarea><br><br>
                    <button class="btn btn-primary" onclick="console_ticket_edit_save(${id})">Save</button>
                </div>
            </div>
        `;
    
        document.querySelector("#console_ticket_edit_status").value = ticket.status;
        document.querySelector("#console_ticket_edit_priority").value = ticket.priority;
        document.querySelector("#console_ticket_edit_ticketType").value = ticket.ticketType;
    
    });
}

function console_ticket_contact (id) {
    event.preventDefault();
    const console_view = document.querySelector('#console-view')
	console_view.innerHTML = ``;

    console_view.innerHTML = `
        <div style="padding: 20px;">
        <h4>Search & Assign Contact To Ticket #${id}</h4>
        <hr>
            <form style="width: 50%;">
                <input type="search" class="form-control" id="console-search-contacts" placeholder="Search Contacts (First Name, Phone Number, ect.)"><br>
                <button type="submit" class="btn btn-primary" onclick="console_ticket_contacts(${id})">Search</button>
            </form>
        <hr>
        <div id="console-view-inner">
        </div>
    `;

    fetch('/contacts/recent/')
	.then(response => response.json())
	.then(searches => {
        
        const console_view_inner = document.querySelector('#console-view-inner')

        searches.forEach(search => {
            const div = document.createElement('div');
            div.innerHTML = `<a id='contact${search.id}' href='#' onclick="console_ticket_contact_save(${id}, ${search.id})">${search.name}</a>`;
            console_view_inner.append(div);
        });
    });
}

function console_ticket_contacts (id) {
    event.preventDefault();
    
    text = document.querySelector('#console-search-contacts').value;
        
    fetch('/contacts/search/' + text)
	.then(response => response.json())
	.then(searches => {
        const console_view_inner = document.querySelector('#console-view-inner')
        console_view_inner.innerHTML = ``;

        searches.forEach(search => {
            const div = document.createElement('div');
            div.innerHTML = `<a id='contact${search.id}' href='#' onclick="console_ticket_contact_save(${id}, ${search.id})">${search.name}</a>`;
            console_view_inner.append(div);
        });
	});

	
	return false;
}

function console_contacts_search () {
    event.preventDefault();
    
    text = document.querySelector('#console-search-contacts').value;
        
    fetch('/contacts/search/' + text)
	.then(response => response.json())
	.then(contacts => {
        const console_view_inner = document.querySelector('#console-view-inner')
        console_view_inner.innerHTML = ``;

        contacts.forEach(contact => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th><a id='contact${contact.id}' href='#' onclick="load_console_contact_display(${contact.id})">${contact.id}</a></th>
                <td><a href='#' onclick="load_console_contact_display(${contact.id})">${contact.salutation} ${contact.first} ${contact.last}<a></td>
                <td>${contact.phone}<br>${contact.email}</td>
                <td>${contact.address}
                    ${contact.suite}<br>
                    ${contact.city}, ${contact.state} ${contact.zip}<br>
                    ${contact.country}</td>
                <td>${contact.timestamp}</td>
                <td><a href="#" onclick="load_console_user_display(${contact.creator})">${contact.creatorName}</a></td>
            `;
            console_view_inner.append(tr);
        });
	});

	
	return false;
}

function console_ticket_contact_save (ticket, contact) {
    event.preventDefault();

    fetch('/ticket/contact/' + ticket + '/' + contact)
    load_console_ticket_display(ticket)
    return false;
}

function console_contact_create_save () {
    event.preventDefault();
	
    const salutation = document.querySelector('#console_contact_create_salutation').value
    const first = document.querySelector('#console_contact_create_first').value
    const last = document.querySelector('#console_contact_create_last').value
    
    const phone = document.querySelector('#console_contact_create_phone').value
    const email = document.querySelector('#console_contact_create_email').value

    const address = document.querySelector('#console_contact_create_address').value
    const suite = document.querySelector('#console_contact_create_suite').value
    const city = document.querySelector('#console_contact_create_city').value
    const state = document.querySelector('#console_contact_create_state').value
    const zip = document.querySelector('#console_contact_create_zip').value
    const country = document.querySelector('#console_contact_create_country').value


	fetch('/contact/create/', {
		method: 'POST',
        body: JSON.stringify ({
            salutation: salutation,
            first: first,
            last: last,
            phone: phone,
            email: email,
            address: address,
            suite: suite,
            city: city,
            state: state,
            zip: zip,
            country: country
		})
	})
	.then(response => response.json())
	.then(contact => {
    });

    load_console_contacts_search();

	return false;
}



function console_ticket_edit_save (id) {
    event.preventDefault();
    const status = document.querySelector("#console_ticket_edit_status").value;
    const priority = document.querySelector("#console_ticket_edit_priority").value;
    const ticketType = document.querySelector("#console_ticket_edit_ticketType").value;
    const subject = document.querySelector("#console_ticket_edit_subject").value;
    const body = document.querySelector("#console_ticket_edit_body").value;

    fetch('/ticket/edit/' + id, {
		method: 'POST',
		body: JSON.stringify({
			priority: priority,
			status: status,
			ticketType: ticketType,
			subject: subject,
            body: body
		})
    })
    .then(response => response.json())
	.then(result => {
        console.log(result);
    })

    load_console_ticket_display(id);
}

function console_ticket_take (id) {
    event.preventDefault();
    fetch('/ticket/take/' + id)
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })

    load_console_ticket_display(id);
}

function console_ticket_close (id) {
    event.preventDefault();
    fetch('/ticket/close/' + id)
    .then(response => response.json())
	.then(result => {
	  // Print Tickets
      console.log(result);
    });

    document.querySelector("#console-ticket-status").innerHTML = "Completed";
}

function console_ticket_comment (id) {
    event.preventDefault();
    const console_ticket_comment = document.querySelector("#console-ticket-comment-add")

    fetch('/comment/' + id, {
		method: 'POST',
		body: JSON.stringify({
			message: console_ticket_comment.value
		})
    })
    .then(response => response.json())
	.then(result => {
        console.log(result);

        fetch('/comments/' + id)
        .then(response => response.json())
        .then(comments => {
            
            const console_view_comments = document.querySelector('#console-view-tickets');
            console_view_comments.innerHTML = ``;

            comments.forEach(comment => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <div id="ticket_comment_${comment.id}">
                        <a href='#' id="comment_${comment.id}" onclick="load_console_user_display (${comment.creator})">${comment.creatorName}</a> | ${comment.timestamp}<br>
                        <div id="message_${comment.id}">${comment.message}</div><br>
                        <div id="ticket_comment_edit_${comment.id}" style="display: none;">
                            <br>
                            <a href="#" onclick="console_comment_edit(${comment.id})">Edit</a> | <a href="#" onclick="console_comment_edit_delete(${comment.id})">Delete</a>
                        </div>
                        <hr>
                    </div>
                    <div id="ticket_comment_text_${comment.id}" style="display: none;">
                        <h5>Edit Comment</h5><br>
                        <textarea id="message_edit_${comment.id}" class="form-control" style="width: 100%" placeholder="Message">${comment.message}</textarea><br>
                        <a href="#" onclick="console_comment_edit_save(${comment.id})">Save</a> | <a href="#" onclick="console_comment_edit_cancel(${comment.id})">Cancel</a>
                        <hr>
                    </div>
                `;
                console_view_comments.append(div);

                const edit = document.querySelector('#ticket_comment_edit_' + comment.id);

                fetch('/user/get/')
                .then(response => response.json())
                .then(user => {
                    if (user.id == comment.creator || user.id == -1) {
                        edit.style.display = "block";
                    }
                });
            });
        })
    })
}

function console_user_create_save () {
	event.preventDefault();
	
    const first = document.querySelector('#console_user_create_first').value
    const last = document.querySelector('#console_user_create_last').value
    const username = document.querySelector('#console_user_create_username').value
    const password = document.querySelector('#console_user_create_password').value
    const email = document.querySelector('#console_user_create_email').value
    const role = document.querySelector('#console_user_create_role').value
	
	fetch('/user/create/', {
		method: 'POST',
		body: JSON.stringify({
			first: first,
			last: last,
			username: username,
			password: password,
            email: email,
			role: role
		})
	  })
	  .then(response => response.json())
	  .then(result => {
		  // Print result
		  console.log(result);
	  });

	  load_console_dashboard();

	  return false;
}

function console_announcement_create_save () {
	event.preventDefault();
	
    const headline = document.querySelector('#console_announcement_create_headline').value
    const message = document.querySelector('#console_announcement_create_message').value
	
	fetch('/announcement/create/', {
		method: 'POST',
		body: JSON.stringify({
			headline: headline,
			message: message
		})
	})
	.then(response => response.json())
	.then(result => {
		// Print result
        console.log(result);
	});

    load_console_dashboard();
	return false;
}

function console_contact_edit (id) {
    event.preventDefault();
    
    fetch('/contact/' + id)
    .then(response => response.json())
    .then(contact => {
        console.log(contact);
        document.querySelector('#console-view').innerHTML = `
            <div style="padding: 20px;  width: 50%;">
            <h4>Edit Profile For ${contact.first} ${contact.last}</h4>
            <a href="#" onclick="load_console_contact_display(${id})">Cancel</a>
            <hr>
            <h6>Name</h6>
            <input id="console_contact_edit_salutation" class="form-control" style="width: 100%;" placeholder="Mr., Mrs., etc."><br>
            <input id="console_contact_edit_first" class="form-control" style="width: 100%;" placeholder="First"><br>
            <input id="console_contact_edit_last" class="form-control" style="width: 100%;" placeholder="Last">
            <br>
            <h6>Contact Information</h6>
            <input id="console_contact_edit_phone" type="tel" class="form-control" style="width: 100%;" placeholder="(555)123-1234"><br>
            <input id="console_contact_edit_email" type="email" class="form-control" style="width: 100%;" placeholder="name@email.com">
            <br>
            <h6>Address</h6>
            <input id="console_contact_edit_address" type="text" class="form-control" style="width: 100%;" placeholder="Street"><br>
            <input id="console_contact_edit_suite" type="text" class="form-control" style="width: 100%;" placeholder="Apt/Suite/Business"><br>
            <input id="console_contact_edit_city" type="text" class="form-control" style="width: 100%;" placeholder="City"><br>
            <input id="console_contact_edit_state" type="text" class="form-control" style="width: 100%;" placeholder="State"><br>
            <input id="console_contact_edit_zip" type="text" class="form-control" style="width: 100%;" placeholder="Zip Code"><br>
            <input id="console_contact_edit_country" type="text" class="form-control" style="width: 100%;" placeholder="Country"><br>
            <button class="btn btn-primary" onclick="console_contact_edit_save(${id})">Save</button>
        `;
        
        document.querySelector("#console_contact_edit_salutation").value = contact.salutation;
        document.querySelector("#console_contact_edit_first").value = contact.first;
        document.querySelector("#console_contact_edit_last").value = contact.last;

        document.querySelector("#console_contact_edit_phone").value = contact.phone;
        document.querySelector("#console_contact_edit_email").value = contact.email;

        document.querySelector("#console_contact_edit_address").value = contact.address;
        document.querySelector("#console_contact_edit_suite").value = contact.suite;
        document.querySelector("#console_contact_edit_city").value = contact.city;
        document.querySelector("#console_contact_edit_state").value = contact.state;
        document.querySelector("#console_contact_edit_zip").value = contact.zip;
        document.querySelector("#console_contact_edit_country").value = contact.country;
        
    });

    return false;
}

function console_contact_edit_save (id) {
    event.preventDefault();
    const salutation = document.querySelector("#console_contact_edit_salutation").value;
    const first = document.querySelector("#console_contact_edit_first").value;
    const last = document.querySelector("#console_contact_edit_last").value;
    const phone = document.querySelector("#console_contact_edit_phone").value;
    const email = document.querySelector("#console_contact_edit_email").value;
    const address = document.querySelector("#console_contact_edit_address").value;
    const suite = document.querySelector("#console_contact_edit_suite").value;
    const city = document.querySelector("#console_contact_edit_city").value;
    const state = document.querySelector("#console_contact_edit_state").value;
    const zip = document.querySelector("#console_contact_edit_zip").value;
    const country = document.querySelector("#console_contact_edit_country").value;

    fetch('/contact/edit/' + id, {
		method: 'POST',
		body: JSON.stringify({
			salutation: salutation,
			first: first,
			last: last,
			phone: phone,
            email: email,
            address: address,
			suite: suite,
			city: city,
			state: state,
            zip: zip,
            country: country
		})
    })
    .then(response => response.json())
	.then(result => {
        console.log(result);
    })

    load_console_contact_display(id);
}