from django.urls import path
from .views import AnnouncementList, AnnouncementDetail,EmployeeInfoList, EmployeeInfoDetail

urlpatterns = [
    path('announcements/', AnnouncementList.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', AnnouncementDetail.as_view(), name='announcement-detail'),
    path('employees/', EmployeeInfoList.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeInfoDetail.as_view(), name='employee-detail'),
]
