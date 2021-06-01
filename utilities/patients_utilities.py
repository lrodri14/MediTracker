"""
    This appointments_utilities.py file contains all the async and sync functions needed for the appointments app to perform
    correctly.
"""

# Functions


def check_charges(consults):
    """
        DOCSTRING:
        This function is used to check if there are any charges inside the consults, if there are not then the
        charges section of the patient details would not be rendered. It takes a single argument: 'consults' and
        it expects a querySet.
    """
    charges = None
    for c in consults:
        if c.charge:
            charges = True
            break
    return