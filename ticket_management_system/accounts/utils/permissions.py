def get_user_type(user):
    if user.is_superuser:
        return 'admin'
    else:
        return 'user'