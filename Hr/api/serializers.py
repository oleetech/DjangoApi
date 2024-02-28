from rest_framework import serializers
from Hr.models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['Title', 'Description', 'Date', 'Month', 'Year', 'Status', 'createdAt', 'updatedAt']
        read_only_fields = ['AnnounceId']

from Hr.models import EmployeeInfo

class EmployeeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeInfo
        fields = '__all__'  # Include all fields of the EmployeeInfo model
