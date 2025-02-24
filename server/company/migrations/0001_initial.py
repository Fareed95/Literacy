# Generated by Django 4.2.6 on 2025-02-18 20:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='company_logos/')),
                ('website', models.URLField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('industry', models.CharField(choices=[('Tech', 'Tech'), ('Finance', 'Finance'), ('Healthcare', 'Healthcare'), ('Education', 'Education'), ('Other', 'Other')], default='Other', max_length=100)),
                ('founded_at', models.DateField(blank=True, null=True)),
                ('contact_email', models.EmailField(max_length=254)),
                ('contact_phone', models.CharField(blank=True, max_length=15, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Internship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('stipend', models.CharField(blank=True, max_length=50, null=True)),
                ('duration', models.CharField(max_length=50)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('skills_required', models.TextField(blank=True, null=True)),
                ('openings', models.IntegerField(default=1)),
                ('application_deadline', models.DateField()),
                ('posted_at', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='internships', to='company.company')),
            ],
        ),
    ]
