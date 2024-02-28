from django.contrib import admin
from .models import Announcement, Attendance, EmployeeInfo, Leave, Project, TodoAdmin, TodoEmployee

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('AnnounceId', 'Title', 'Date', 'Status', 'createdAt', 'updatedAt')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('AttendanceID', 'LoginTime', 'LogoutTime', 'Date', 'Leave', 'createdAt', 'updatedAt', 'EmployeeID')

@admin.register(EmployeeInfo)
class EmployeeInfoAdmin(admin.ModelAdmin):
    list_display = ('EmployeeID', 'Name', 'Email', 'JoiningDate', 'Designation', 'createdAt', 'updatedAt')

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ('Leave_ID', 'DateApplied', 'Date', 'Type', 'Status', 'createdAt', 'updatedAt', 'EmployeeID')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('ProjectID', 'Name', 'createdAt', 'updatedAt', 'EmployeeID')

@admin.register(TodoAdmin)
class TodoAdminAdmin(admin.ModelAdmin):
    list_display = ('TodoAdminID', 'title', 'timeFrom', 'timeTo', 'Date', 'Status', 'createdAt', 'updatedAt', 'adminID')

@admin.register(TodoEmployee)
class TodoEmployeeAdmin(admin.ModelAdmin):
    list_display = ('TodoEmployeeID', 'title', 'timeFrom', 'timeTo', 'Date', 'Status', 'createdAt', 'updatedAt', 'EmployeeID')
