from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class TokenGenerator(PasswordResetTokenGenerator):
    """
        DOCSTRING: This TokenGenerator class inherits from the PasswordResetTokenGenerator Django class used to generate
        tokens for password resetting, this class provides us tokens for email verifications, we overrode the _make_hash_value
        method to return a token based on the user's confirmed status, and we also used the six module to hash the token.
    """
    def _make_hash_value(self, user, timestamp):
        return (six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.confirmed))


generate_token = TokenGenerator()