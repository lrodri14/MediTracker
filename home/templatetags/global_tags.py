from django import template
from meditracker.settings import STATIC_URL

register = template.Library()

@register.simple_tag
def display_wallpaper(wallpaper_identifier):
    return STATIC_URL + 'web-backgrounds/bg-{}.jpg'.format(wallpaper_identifier)
