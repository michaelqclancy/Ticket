from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path("login/", views.login_view, name="login"),
	path("logout/", views.logout_view, name="logout"),

	#API Routes
	path("dashboard/", views.dashboard, name="dashboard"),
	path("announcement/create/", views.announcement_create, name="announcement_create"),
	path("announcement/edit/<int:id>", views.announcement_edit, name="announcement_edit"),
	path("announcement/delete/<int:id>", views.announcement_delete, name="announcement_delete"),
	path("announcements/", views.announcements, name="announcements"),
	path("contacts/", views.contacts, name="contacts"),
	path("contacts/search/<str:text>", views.contacts_search, name="contacts_search"),
	path("contacts/recent/", views.contacts_recent, name="contacts_recent"),
	path("contact/create/", views.contact_create, name="contact_create"),
	path("contact/edit/<int:id>", views.contact_edit, name="contact_edit"),
	path("contact/<int:id>", views.contact, name="contact"),
	path("ticket/<int:id>", views.ticket, name="ticket"),
	path("ticket/close/<int:id>", views.ticket_close, name="ticket_close"),
	path("ticket/edit/<int:id>", views.ticket_edit, name="ticket_edit"),
	path("ticket/create/", views.ticket_create, name="ticket_create"),
	path("ticket/take/<int:id>", views.ticket_take, name="ticket_take"),
	path("ticket/assign/<int:ticket>/<int:user>", views.ticket_assign, name="ticket_assign"),
	path("ticket/contact/<int:ticket>/<int:contact>", views.ticket_contact, name="ticket_contact"),
	path("tickets/", views.tickets, name="tickets"),
	path("tickets/open", views.tickets_open, name="tickets_open"),
	path("tickets/unassigned", views.tickets_unassigned, name="tickets_unassigned"),
	path("tickets/user/", views.tickets_user, name="tickets_user"),
	path("tickets/contact/<int:id>", views.tickets_contact, name="tickets_contact"),
	path("comment/<int:id>", views.comment, name="comment"),
	path("comment/edit/<int:id>", views.comment_edit, name="comment_edit"),
	path("comment/delete/<int:id>", views.comment_delete, name="comment_delete"),
	path("comments/<int:id>", views.comments, name="comments"),
	path("user/<int:id>", views.user, name="user"),
	path("user/get/", views.user_get, name="user_get"),
	path("user/create/", views.user_create, name="user_create"),
	path("user/password/", views.user_password, name="user_password"),
	path("user/tickets/<int:id>", views.user_tickets, name="user_tickets"),
	path("user/data/<int:id>", views.user_data, name="user_data"),
	path("user/activity/<int:id>", views.user_activity, name="user_activity"),
	path("users/", views.users, name="users"),
	path("users/search/<str:text>", views.users_search, name="users_search"),
	path("search/<str:text>", views.search, name="search"),
]