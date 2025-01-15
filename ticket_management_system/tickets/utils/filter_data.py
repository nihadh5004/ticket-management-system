

def build_query_filters(params):
    """
    Helper function to build query filters from request parameters.
    :param params: Dictionary of query parameters.
    :return: Dictionary of filter conditions.
    """
    filter_conditions = {}
    if params.get('status'):
        filter_conditions['status'] = params.get('status')
    if params.get('title'):
        filter_conditions['title__icontains'] = params.get('title')
    if params.get('description'):
        filter_conditions['description__icontains'] = params.get('description')
    if params.get('priority'):
        filter_conditions['priority'] = params.get('priority')
    if params.get('user'):
        filter_conditions['user__username'] = params.get('user')
    return filter_conditions