class LocationsController < ApplicationController
	skip_before_action :verify_authenticity_token, only: [:create]
	def show
  		@location = Location.find(params[:id])

  	end

  	def create
  		puts params
  		# account_sid = ENV['TWILIO_ACCOUNT_SID']
	   #  auth_token = ENV['TWILIO_AUTH_TOKEN']
	   #  client = Twilio::REST::Client.new(account_sid, auth_token)
	   #  emergency_contacts = current_user.contacts.where(emergency_contact: true)
	   #  from = '+14088316357' # Your Twilio number
	   #  # emergency_contacts.each do |contact|
	   #        client.messages.create(
	   #          from: from,
	   #          to: '+13239015758',
	   #          body: "Hey friend! I'm on the way. My location is http://www.google.com/maps/place/#{params['myLat']},#{params['myLng']}"
	   #        )
	   #  # end
	   @location = Location.create(name: "Test", user: User.find(params[:userId]))
	   Coordinate.create(latitude: params[:lat], longitude: params[:lng], location: @location)

  	end
end
