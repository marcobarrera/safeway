# Download the twilio-ruby library from twilio.com/docs/libraries/ruby
require 'twilio-ruby'

account_sid = 'TWILIO_ACCOUNT_SID'
auth_token = 'TWILIO_AUTH_TOKEN'
client = Twilio::REST::Client.new(account_sid, auth_token)

from = '+14088316357' # Your Twilio number
to = '+12016879114' # Your mobile phone number

client.messages.create(
from: from,
to: to,
body: "Hey friend!"
)
