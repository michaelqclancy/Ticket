from django.contrib import admin
from .models import User, Ticket, Comment, Profile, Contact, Message, Activity, Announcement

# Register your models here.
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Ticket)
admin.site.register(Comment)
admin.site.register(Contact)
admin.site.register(Message)
admin.site.register(Activity)
admin.site.register(Announcement)