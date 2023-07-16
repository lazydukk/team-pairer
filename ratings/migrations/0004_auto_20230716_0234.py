# Generated by Django 4.2 on 2023-07-16 02:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ratings', '0003_nationalrating_games'),
    ]

    operations = [
        # This migration was created manually. I have not added a reverse op 
        # for create extension because django fails on it saying you must be
        # owner of the extension. AFAIK, extensions don't have owners. So a
        # blank text is provided as the reverse for the create extension op
        migrations.RunSQL("CREATE EXTENSION IF NOT EXISTS pg_trgm", ""),
        migrations.RunSQL("CREATE INDEX idx_wespa_name_trgm ON ratings_wesparating USING gist (name gist_trgm_ops);",
                          "DROP INDEX IF EXISTS idx_wespa_name_trgm;"),
        migrations.RunSQL("CREATE INDEX idx_national_name_trgm ON ratings_nationalrating USING gist (name gist_trgm_ops);",
                          "DROP INDEX IF EXISTS idx_national_name_trgm;"),
    ]
