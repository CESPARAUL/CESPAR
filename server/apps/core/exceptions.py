from rest_framework.views import exception_handler as drf_exception_handler


def custom_exception_handler(exc, context):
    """Normalize DRF's default error shapes into `{"message": "..."}` so the
    frontend's single `err.message` extraction works for every error path,
    without losing any extra keys a view added on purpose (e.g. the
    `code`/`email` fields on the EMAIL_NOT_VERIFIED login response)."""
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    if isinstance(data, dict):
        if "message" not in data:
            if "detail" in data:
                message = str(data["detail"])
            else:
                first_key = next(iter(data), None)
                first_val = data.get(first_key) if first_key else None
                if isinstance(first_val, list) and first_val:
                    message = str(first_val[0])
                elif first_val is not None:
                    message = str(first_val)
                else:
                    message = "Something went wrong"
            data["message"] = message
    elif isinstance(data, list) and data:
        response.data = {"message": str(data[0])}

    return response
