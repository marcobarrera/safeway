class LocationChannel < ApplicationCable::Channel
  def subscribed
    location = Location.find(params[:id])
    stream_for location
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
