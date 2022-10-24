from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
	id = models.AutoField(primary_key=True)

	def __str__(self):
		return f"{self.first_name} {self.last_name}"

class Profile (models.Model):
	id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile')
	active = models.IntegerField(max_length=1, default=1)

	def __str__(self):
		return f"{self.user.first_name}" + " " + f"{self.user.last_name}"

	def serialize(self):
		return {
			"id": self.id,
			"user_id": self.user.id,
			"username": self.user.username,
			"name": self.user.first_name + " " + self.user.last_name,
			"active": self.active
		}

class Contact (models.Model):
	id = models.AutoField(primary_key=True)
	creator = models.ForeignKey(User, on_delete=models.CASCADE)
	first = models.CharField(max_length=100, default="Anonymous")
	last = models.CharField(max_length=100, default="User")
	email = models.CharField(max_length=100, blank=True, null=True)
	phone = models.CharField(max_length=20, blank=True, null=True)
	address = models.CharField(max_length=100, blank=True, null=True)
	suite = models.CharField(max_length=100, blank=True, null=True)
	city = models.CharField(max_length=100, blank=True, null=True)
	state = models.CharField(max_length=100, blank=True, null=True)
	zip = models.CharField(max_length=10, blank=True, null=True)
	country = models.CharField(max_length=100, blank=True, null=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	salutation = models.CharField(max_length=10, blank=True, null=True)

	def __str__(self):
		return f"{self.first} {self.last}"

	def serialize(self):
		return {
			"id": self.id,
			"salutation": str(self.salutation),
			"first": str(self.first),
			"last": str(self.last),
			"name": str(self.salutation) + " " + str(self.first) + " " + str(self.last),
			"email": str(self.email),
			"phone": str(self.phone),
			"address": str(self.address),
			"suite": str(self.suite),
			"city": str(self.city),
			"state": str(self.state),
			"zip": str(self.zip),
			"country": str(self.country),
			"creator": self.creator.id,
			"creatorName": self.creator.first_name + " " + self.creator.last_name,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
		}

class Ticket (models.Model):
	id = models.AutoField(primary_key=True)
	creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator')
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
	status = models.CharField(max_length=20, default="Unassigned")
	priority = models.CharField(max_length=10, default="Medium")
	ticketType = models.CharField(max_length=50, default="General")
	subject = models.CharField(max_length=300, default="Null")
	body = models.CharField(max_length=10000, default="Null")
	timestamp = models.DateTimeField(auto_now_add=True)
	contact = models.ForeignKey(Contact, on_delete=models.CASCADE, blank=True, null=True)

	def __str__(self):
		return f"{self.subject}"
	
	def serialize(self):
		return {
			"id": self.id,
			"creator": self.creator.id,
			"creatorName": self.creator.first_name + " " + self.creator.last_name,
			"owner": self.owner.id,
			"ownerName": self.owner.first_name + " " + self.owner.last_name,
			"status": self.status,
			"priority": self.priority,
			"ticketType": self.ticketType,
			"subject": self.subject,
			"body": self.body,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
			"contact": self.contact.id,
			"contactName": str(self.contact.first) + " " + str(self.contact.last)
		}

class Comment (models.Model):
	id = models.AutoField(primary_key=True)
	creator = models.ForeignKey(User, on_delete=models.CASCADE)
	ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
	message = models.CharField(max_length=10000, default="Null")
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.message}"
	
	def serialize(self):
		return {
			"id": self.id,
			"creator": self.creator.id,
			"creatorName": self.creator.first_name + " " + self.creator.last_name,
			"ticket": self.ticket.id,
			"message": self.message,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
		}

class Message (models.Model):
	id = models.AutoField(primary_key=True)
	creator = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.CharField(max_length=10000, default="Null")
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.message}"
	
	def serialize(self):
		return {
			"id": self.id,
			"creator": self.creator.id,
			"creatorName": self.creator.first_name + " " + self.creator.last_name,
			"message": self.message,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
		}

class Activity (models.Model):
	id = models.AutoField(primary_key=True)
	creator = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.CharField(max_length=10000, default="Null")
	timestamp = models.DateTimeField(auto_now_add=True)
	special = models.CharField(max_length=10000, default="Null")
	special_id = models.IntegerField(default=1)
	activityType = models.CharField(max_length=100, default="Null")

	def __str__(self):
		return f"{self.creator.first_name} {self.creator.last_name} {self.message} {self.special}"
	
	def serialize(self):
		return {
			"id": self.id,
			"creator": self.creator.id,
			"creatorName": self.creator.first_name + " " + self.creator.last_name,
			"message": self.message,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
			"special": self.special,
			"special_id": self.special_id,
			"activityType": self.activityType
		}

class Announcement (models.Model):
	id = models.AutoField(primary_key=True)
	creator = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.CharField(max_length=10000, default="Null")
	timestamp = models.DateTimeField(auto_now_add=True)
	headline = models.CharField(max_length=10000, default="Null")

	def __str__(self):
		return f"{self.headline}"
	
	def serialize(self):
		return {
			"id": self.id,
			"creator": self.creator.id,
			"creatorName": self.creator.first_name + " " + self.creator.last_name,
			"headline": self.headline,
			"message": self.message,
			"timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
		}