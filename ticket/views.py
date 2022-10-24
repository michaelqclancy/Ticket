import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import User, Ticket, Comment, Profile, Contact, Message, Activity, Announcement

# Create your views here.
def index(request):
	if request.user.is_authenticated:
		return render(request, "ticket/console.html")
	else:
		return HttpResponseRedirect(reverse("login"))

@login_required
def dashboard (request):
	tickets_unassigned = Ticket.objects.filter(status="Unassigned").count()
	tickets_open = Ticket.objects.filter(Q(status="New") | Q(status="Pending")).count()
	tickets_user = Ticket.objects.filter(owner=request.user).exclude(Q(status="Completed") | Q(status="Unassigned")).count()
	tickets_high = Ticket.objects.filter(Q(status="New") | Q(status="Pending")).filter(priority="High").count()
	tickets_closed = Ticket.objects.filter(status="Completed").count()
	
	return JsonResponse({'tickets_open': tickets_open, 'tickets_unassigned': tickets_unassigned, 'tickets_user': tickets_user, 'tickets_high': tickets_high, 'tickets_closed': tickets_closed})

@login_required
def announcements (request):
	announcements = Announcement.objects.all().order_by('-id')[:20]
	return JsonResponse([announcement.serialize() for announcement in announcements], safe=False)

@login_required
@csrf_exempt
def announcement_create (request):
	data = json.loads(request.body)
	user = request.user

	announcement = Announcement()
	announcement.creator = user
	announcement.headline = data.get("headline", "")
	announcement.message = data.get("message", "")
	announcement.save()

	activity = Activity()
	activity.creator = user
	activity.message = "announced "
	activity.special = announcement.message
	activity.special_id = announcement.id
	activity.activityType = "Announcement"
	activity.save()

	return JsonResponse(announcement.serialize(), safe=False)

@login_required
@csrf_exempt
def announcement_delete (request, id):
	Announcement.objects.filter(id=id).delete()
	return JsonResponse({"message": "This announcement has been deleted."}, status=201)

@login_required
@csrf_exempt
def announcement_edit (request, id):
	data = json.loads(request.body)
	announcement = Announcement.objects.get(id=id)

	announcement.headline = data.get("headline", "")
	announcement.message = data.get("message", "")

	announcement.save()

	return JsonResponse(announcement.serialize())

@login_required
def contacts(request):
	contacts = Contact.objects.all()
	return JsonResponse([contact.serialize() for contact in contacts], safe=False)

@login_required
def contacts_search (request, text):
	if text.isdigit():
		num = str(text)
		searches = Contact.objects.filter(Q(phone__contains=text) | Q(id=num) | Q(zip__contains=text))
	else:
		searches = Contact.objects.filter(Q(first__contains=text) | Q(last__contains=text) | Q(email__contains=text)| Q(phone__contains=text) | Q(address__contains=text) | Q(suite__contains=text) | Q(city__contains=text) | Q(state__contains=text) | Q(country__contains=text))

	return JsonResponse([search.serialize() for search in searches], safe=False)

@login_required
def contacts_recent(request):
	searches = Contact.objects.all().order_by('-id')[:10]
	return JsonResponse([search.serialize() for search in searches], safe=False)

@login_required
def contact(reqiest, id):
	contact = Contact.objects.get(id=id)
	return JsonResponse(contact.serialize(), safe=False)

@login_required
@csrf_exempt
def contact_create(request):
	data = json.loads(request.body)
	user = request.user
	contact = Contact()
	contact.creator = user
	contact.salutation = data.get("salutation", "")
	contact.first = data.get("first", "")
	contact.last = data.get("last", "")
	contact.email = data.get("email", "")
	contact.phone = data.get("phone", "")
	contact.address = data.get("address", "")
	contact.suite = data.get("suite", "")
	contact.city = data.get("city", "")
	contact.state = data.get("state", "")
	contact.zip = data.get("zip", "")
	contact.country = data.get("country", "")
	contact.save()

	activity = Activity()
	activity.creator = user
	activity.message = "created contact"
	activity.special = contact.first + " " + contact.last
	activity.special_id = contact.id
	activity.activityType = "Contact"
	activity.save()
	
	return JsonResponse(contact.serialize())

@csrf_exempt
@login_required
def contact_edit (request, id):
	data = json.loads(request.body)
	user = request.user
	contact = Contact.objects.get(id=id)
	contact.salutation = data.get("salutation", "")
	contact.first = data.get("first", "")
	contact.last = data.get("last", "")
	contact.email = data.get("email", "")
	contact.phone = data.get("phone", "")
	contact.address = data.get("address", "")
	contact.suite = data.get("suite", "")
	contact.city = data.get("city", "")
	contact.state = data.get("state", "")
	contact.zip = data.get("zip", "")
	contact.country = data.get("country", "")
	contact.save()

	activity = Activity()
	activity.creator = user
	activity.message = "edited contact"
	activity.special = contact.first + " " + contact.last
	activity.special_id = contact.id
	activity.activityType = "Contact"
	activity.save()

	return JsonResponse(contact.serialize(), safe=False)

@login_required
def ticket(request, id):
	ticket = Ticket.objects.get(id=id)
	return JsonResponse(ticket.serialize())

@login_required
def tickets (request):
	tickets = Ticket.objects.order_by("-timestamp").all()[:20]
	return JsonResponse([ticket.serialize() for ticket in tickets], safe=False)

@login_required
def tickets_user (request):
	tickets = Ticket.objects.filter(owner=request.user).exclude(Q(status="Completed") | Q(status="Unassigned"))
	tickets = tickets.order_by("-timestamp").all()
	return JsonResponse([ticket.serialize() for ticket in tickets], safe=False)

@login_required
def tickets_open (request):
	tickets = Ticket.objects.all().exclude(Q(status="Completed") | Q(status="Unassigned"))
	tickets = tickets.order_by("-timestamp").all()
	return JsonResponse([ticket.serialize() for ticket in tickets], safe=False)

@login_required
def tickets_unassigned (request):
	tickets = Ticket.objects.filter(status="Unassigned")
	tickets = tickets.all()
	return JsonResponse([ticket.serialize() for ticket in tickets], safe=False)

@login_required
def tickets_contact (request, id):
	tickets = Ticket.objects.filter(contact=id)
	tickets = tickets.order_by("-timestamp").all()
	return JsonResponse([ticket.serialize() for ticket in tickets], safe=False)

@csrf_exempt
@login_required
def ticket_create (request):
	data = json.loads(request.body)
	user = request.user
	ticket = Ticket()
	ticket.creator = user
	ticket.owner = user
	ticket.status = data.get("status", "")
	ticket.priority = data.get("priority", "")
	ticket.ticketType = data.get("ticketType", "")
	ticket.subject = data.get("subject", "")
	ticket.body = data.get("body", "")
	ticket.contact = Contact.objects.get(id=1)

	if ticket.status == 'Unassigned':
		ticket.owner = User.objects.get(id=1)

	ticket.save()

	activity = Activity()
	activity.creator = user
	activity.message = "created ticket"
	activity.special = "#" + str(ticket.id)
	activity.special_id = ticket.id
	activity.activityType = "Ticket"
	activity.save()

	return JsonResponse(ticket.serialize(), safe=False)

@csrf_exempt
@login_required
def ticket_edit (request, id):
	data = json.loads(request.body)
	user = request.user
	ticket = Ticket.objects.get(id=id)
	ticket.priority = data.get("priority", "")
	ticket.status = data.get("status", "")
	ticket.ticketType = data.get("ticketType", "")
	ticket.subject = data.get("subject", "")
	ticket.body = data.get("body", "")

	if ticket.status == 'Unassigned':
		ticket.owner = User.objects.get(id=1)

	ticket.save()

	activity = Activity()
	activity.creator = user
	activity.message = "edited ticket"
	activity.special = "#" + str(ticket.id)
	activity.special_id = ticket.id
	activity.activityType = "Ticket"
	activity.save()

	return JsonResponse(ticket.serialize(), safe=False)

@login_required
def ticket_close (request, id):
	ticket = Ticket.objects.get(id=id)
	ticket.status = "Completed"

	ticket.save()
	
	activity = Activity()
	activity.creator = request.user
	activity.message = "closed ticket"
	activity.special = "#" + str(ticket.id)
	activity.special_id = ticket.id
	activity.activityType = "Ticket"
	activity.save()

	return JsonResponse(ticket.serialize(), safe=False)

@login_required	
def ticket_take (request, id):
	ticket = Ticket.objects.get(id=id)
	user = request.user
	
	if ticket.status == 'Unassigned':
		ticket.status = "New"

	ticket.owner = user
	ticket.save()

	activity = Activity()
	activity.creator = user
	activity.message = "took ticket"
	activity.special = "#" + str(ticket.id)
	activity.special_id = ticket.id
	activity.activityType = "Ticket"
	activity.save()

	return JsonResponse(ticket.serialize(), safe=False)

@login_required
def ticket_assign (request, ticket, user):
	userA = request.user
	ticketA = Ticket.objects.get(id=ticket)
	ticketA.owner = User.objects.get(id=user)
	ticketA.save()

	activityA = Activity()
	activityA.creator = userA
	activityA.message = "reassigned ticket"
	activityA.special = "#" + str(ticketA.id)
	activityA.special_id = ticketA.id
	activityA.activityType = "Ticket"
	activityA.save()

	activityB = Activity()
	activityB.creator = userA
	activityB.message = "reassigned a ticket to"
	activityB.special = userA.first_name + " " + userA.owner.last_name
	activityB.special_id = user
	activityB.activityType = "User"
	activityB.save()

	return JsonResponse({"message": "Ticket edited successfully."}, status=201)

@login_required
def ticket_contact (request, ticket, contact):
	user = request.user
	ticketA = Ticket.objects.get(id=ticket)
	ticketA.contact = Contact.objects.get(id=contact)
	ticketA.save()

	activityA = Activity()
	activityA.creator = user
	activityA.message = "changed customer of ticket"
	activityA.special = "#" + str(ticketA.id)
	activityA.special_id = ticketA.id
	activityA.activityType = "Ticket"
	activityA.save()

	activityB = Activity()
	activityB.creator = user
	activityB.message = "reassigned a ticket to customer"
	activityB.special =  ticketA.contact.first + " " + ticketA.contact.last
	activityB.special_id = contact
	activityB.activityType = "Contact"
	activityB.save()

	return JsonResponse({"message": "Ticket edited successfully."}, status=201)

@login_required
def user (request, id):
	profile = Profile.objects.get(id=id)
	return JsonResponse(profile.serialize())

def user_get (request):
	user = request.user
	

	if user.is_staff is True:
		user_id = -1
	else:
		user_id = user.id

	return JsonResponse({"id": user_id})

@login_required
@csrf_exempt
def user_create (request):
	data = json.loads(request.body)
	
	user = User.objects.create_user(data.get("username", ""), data.get("email", ""), data.get("password", ""))
	
	if data.get("role", "") == "Management":
		user.is_staff = True
	else:
		user.is_staff = False
	
	user.first_name=data.get("first", "")
	user.last_name=data.get("last", "")
	user.save()

	profile = Profile()
	profile.active = 1
	profile.user = user
	profile.save()

	return JsonResponse({"message": "Ticket edited successfully."}, status=201)

@login_required
def user_tickets (request, id):
	tickets = Ticket.objects.filter(owner_id=id).exclude(Q(status="Completed") | Q(status="Unassigned"))
	tickets = tickets.order_by("-timestamp").all()
	return JsonResponse([ticket.serialize() for ticket in tickets], safe=False)

@login_required
def user_activity (request, id):
	activities = Activity.objects.filter(creator__id=id).order_by("-timestamp").all()[:50]
	return JsonResponse([activity.serialize() for activity in activities], safe=False)

@login_required
def user_data (request, id):
	tickets_created = Ticket.objects.filter(creator__id=id).count()
	tickets_open = Ticket.objects.filter(owner__id=id).filter(Q(status="New") | Q(status="Pending")).count()
	tickets_high = Ticket.objects.filter(owner__id=id).filter(Q(status="New") | Q(status="Pending")).filter(priority="High").count()
	tickets_closed = Ticket.objects.filter(creator__id=id).filter(status="Completed").count()

	return JsonResponse({'tickets_open': tickets_open, 'tickets_closed': tickets_closed, 'tickets_created': tickets_created, 'tickets_high': tickets_high})

@login_required
@csrf_exempt
def user_password (request):
	user = request.user
	data = json.loads(request.body)
	password = data.get("password", "")
	confirm = data.get("confirm", "")

	if password == confirm:
		user.set_password(password)
		user.save()
		login(request, user)
		message = "Password has been reset successfully."
	else:
		message = "Passwords do not match."

	return JsonResponse({"message": message}, safe=False)

@login_required
def users (request):
	profiles = Profile.objects.filter(active=1)
	return JsonResponse([profile.serialize() for profile in profiles], safe=False)

@login_required
def users_search (request, text):
	return None

@csrf_exempt
@login_required
def comment (request, id):
	data = json.loads(request.body)
	user = request.user
	comment = Comment()
	comment.creator = user
	comment.message = data.get("message", "")
	comment.ticket = Ticket.objects.get(id=id)
	comment.save()

	comments = Comment.objects.filter(ticket__id=id)
	comments = comments.order_by("-timestamp").all()

	activity = Activity()
	activity.creator = user
	activity.message = "commented on ticket"
	activity.special = "#" + str(id)
	activity.special_id = id
	activity.activityType = "Comment"
	activity.save()

	return JsonResponse([comment.serialize() for comment in comments], safe=False)


@login_required
@csrf_exempt
def comment_delete (request, id):
	Comment.objects.filter(id=id).delete()
	return JsonResponse({"message": "This comment has been deleted."}, status=201)

@login_required
@csrf_exempt
def comment_edit (request, id):
	data = json.loads(request.body)
	comment = Comment.objects.get(id=id)

	comment.message = data.get("message", "")

	comment.save()

	return JsonResponse(comment.serialize())

@login_required
def comments (request, id):
	comments = Comment.objects.filter(ticket__id=id)
	comments = comments.order_by("-timestamp").all()
	return JsonResponse([comment.serialize() for comment in comments], safe=False)

@login_required
def search (request, text):
	if text.isdigit():
		num = str(text)
		searches = Ticket.objects.filter(Q(subject__contains=text) | Q(body__contains=text) | Q(id=num))
	else:
		searches = Ticket.objects.filter(Q(subject__contains=text) | Q(body__contains=text))

	return JsonResponse([search.serialize() for search in searches], safe=False)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "ticket/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "ticket/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))