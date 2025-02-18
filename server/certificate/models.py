from django.db import models
from api.models import User

# Create your models here.
class Certificate(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    additionol_testseries_attempted = models.IntegerField(null=True, blank=True)
    competition_battled = models.IntegerField(null=True, blank=True)
    competition_won = models.IntegerField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificate')


