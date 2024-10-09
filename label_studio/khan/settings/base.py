"""This is the settings file that serves as the base for all other khan run environments.
It inherits from the label-studio core base settings, and all khan's settings files should inherit from this.
"""
from core.settings.base import *
from core.utils.secret_key import generate_secret_key_if_missing

SECRET_KEY = generate_secret_key_if_missing(BASE_DATA_DIR)


# Add our Rules Permissions Class to drf permissions classes so our
# custom RBAC works
REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES'].append(
    "khan.rbac.permission.RBACPermissionClass"
)

# Default Logging to INFO level
LOGGING['root']['level'] = get_env('LOG_LEVEL', 'INFO')

# Default to PSQL
DATABASES = {'default': DATABASES_ALL[DJANGO_DB_POSTGRESQL]}

# IAP _should_ mean users never even see the login page, but on the off chance they do,
# they shouldn't be able to create their own user accounts
DISABLE_SIGNUP_WITHOUT_LINK = False

# IAP Audience used for IAP JWT validation
IAP_AUDIENCE = get_env("IAP_AUDIENCE")

# Don't send telemetry data to tele.labelstud.io
COLLECT_ANALYTICS = False

# Not sure if things below this line are needed, they came from the label-studio/settings/label-studio file
MIDDLEWARE.append('organizations.middleware.DummyGetSessionMiddleware')
MIDDLEWARE.append('core.middleware.UpdateLastActivityMiddleware')
if INACTIVITY_SESSION_TIMEOUT_ENABLED:
    MIDDLEWARE.append('core.middleware.InactivitySessionTimeoutMiddleWare')

ADD_DEFAULT_ML_BACKENDS = False

SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"

RQ_QUEUES = {}

# in Label Studio Community version, feature flags are always ON
FEATURE_FLAGS_DEFAULT_VALUE = True
# or if file is not set, default is using offline mode
FEATURE_FLAGS_OFFLINE = get_bool_env('FEATURE_FLAGS_OFFLINE', True)
FEATURE_FLAGS_FILE = get_env('FEATURE_FLAGS_FILE', 'feature_flags.json')
FEATURE_FLAGS_FROM_FILE = True
try:
    from core.utils.io import find_node

    find_node('label_studio', FEATURE_FLAGS_FILE, 'file')
except IOError:
    FEATURE_FLAGS_FROM_FILE = False

STORAGE_PERSISTENCE = get_bool_env('STORAGE_PERSISTENCE', True)
