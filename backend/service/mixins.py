from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated


class AuthenticatedMixin:
    """Mixin that enforces session auth + login required on views."""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]


class OwnerFilterMixin(AuthenticatedMixin):
    """
    Mixin that filters querysets by an owner field.
    Set `owner_field` on the view to the lookup expression
    (e.g. "owner" or "expense__owner").
    Superusers bypass the filter.
    """

    owner_field = "owner"  # override per-view

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_superuser:
            return qs
        return qs.filter(**{self.owner_field: self.request.user})
