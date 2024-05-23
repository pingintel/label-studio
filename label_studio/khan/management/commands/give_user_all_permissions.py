import logging

from django.core.management.base import BaseCommand


from django.contrib import auth
from organizations.models import Organization

logger = logging.getLogger(__name__)

User = auth.get_user_model()

# python manage.py give_user_all_permissions.py --email <email>


def give_user_all_permissions(email):
    """Give a user all permissions of an organization, also set them as a superuser."""

    user = User.objects.filter(email=email).first()

    if not user:
        print(f"A user with email {email} does not exist.")
        return None

    user.is_staff = True
    user.is_superuser = True

    if Organization.objects.filter(created_by=user).exists():
        org = Organization.objects.first()
    else:
        org = Organization.create_organization(created_by=user, title='Label Studio')
        org.add_user(user)
        org.save()

    user.active_organization = org
    user.save()

    from khan.rbac.models import UserRole
    from khan.rbac.roles import Role

    user_role = UserRole.objects.filter(user=user).first()

    if not user_role:
        UserRole.objects.create(user=user)

    user_role.role = Role.LABELING_INFRA
    user_role.save()

    print(f"Role of user with email {email} is set to {Role.LABELING_INFRA.name}.")

    return None


class Command(BaseCommand):
    help = 'Give a user all permissions of an organization, also set them as a superuser.'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='email', required=True)

    def handle(self, *args, **options):
        email = options['email']
        give_user_all_permissions(email)
