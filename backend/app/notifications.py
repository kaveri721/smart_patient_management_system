from twilio.rest import Client
from .config import *

client = Client(
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
)


def send_sms(phone, message):

    client.messages.create(
        body=message,
        from_=TWILIO_PHONE_NUMBER,
        to=phone
    )