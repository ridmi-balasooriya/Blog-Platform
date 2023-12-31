# Generated by Django 4.2.4 on 2023-12-27 15:32

import blog.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_category_author_tag_author'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='category',
            field=models.ForeignKey(on_delete=models.SET(blog.models.get_default_category), to='blog.category'),
        ),
    ]
