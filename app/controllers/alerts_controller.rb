require 'json'

class AlertsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:share_location, :notify]
  #before_action :share_location, only: :notify

  def index
    @alerts = Alert.all
  end

  def create
    @alert = Alert.new(alert_params)
    @alert.user = current_user
  end

  def update
    @alert = Alert.find(params[:id])
    @alert.update(alert_params)
  end

  def share_location
    
    #Alert.create!(longitude: params[:myLng], latitude: params[:myLat], user_id: current_user.id)
    #send twilio message?
  end

  def notify
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    client = Twilio::REST::Client.new(account_sid, auth_token)
    emergency_contacts = current_user.contacts.where(emergency_contact: true)
    from = '+14088316357' # Your Twilio number
    emergency_contacts.each do |contact|
          client.messages.create(
            from: from,
            to: contact.phone_number,
            body: "Hey friend! I'm in trouble. My location is http://www.google.com/maps/place/#{params['myLat']},#{params['myLng']}"
          )
    end
    Alert.create!(longitude: params[:myLng], latitude: params[:myLat], user_id: current_user.id)
  end

  private

  def alert_params
    params.require(:alert).permit(:category, :longitude, :latitude, :description, :expiration_time, :status, :address)
  end

  def emergency_contacts
    current_user.contacts.where(emergency_contact: true)
  end

  def location_params
    params.permit(:myLat, :myLng)
  end
end
