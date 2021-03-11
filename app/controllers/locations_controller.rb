class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def show
    @location = Location.find(params[:id])

    # @markers = @location.coordinates.geocoded.map do |location|
    #     # img = "robbery.png"
    #   {
    #     lat: location.latitude,
    #     lng: location.longitude,
    #     # infoWindow: render_to_string(partial: "info_window", locals: { alert: alert }),
    #     image_url: helpers.asset_url('https://cdn1.iconfinder.com/data/icons/outdoor-fun-filled-line/614/3981_-_Juggling_Balls-512.png')
    #   }
    # end

  end

  def create
    @location = Location.create(name: "Test", user: User.find(params[:userId]))
    Coordinate.create(latitude: params[:lat], longitude: params[:lng], location: @location)
    if params[:contactId].present?
      @contact = Contact.find(params[:contactId])
      account_sid = ENV["TWILIO_ACCOUNT_SID"]
      auth_token = ENV["TWILIO_AUTH_TOKEN"]
      client = Twilio::REST::Client.new(account_sid, auth_token)
      from = "+14088316357" # Your Twilio number
      # emergency_contacts.each do |contact|
      client.messages.create(
        from: from,
        to: @contact.phone_number,
        body: "Hey friend! I'm on the way. My location is https://www.safeway.link#{location_path(@location)}",
      )
    end
  end
end
