# Download the twilio-ruby library from twilio.com/docs/libraries/ruby
require 'twilio-ruby'

account_sid = 'ACda6612ad948c2c3657a2cc4d3838b855'
auth_token = '80508cad17bed943bbaf22e5d93b67b2'
client = Twilio::REST::Client.new(account_sid, auth_token)

from = '+14088316357' # Your Twilio number
to = '+12016879114' # Your mobile phone number

client.messages.create(
from: from,
to: to,
body: "Hey friend!"
)
