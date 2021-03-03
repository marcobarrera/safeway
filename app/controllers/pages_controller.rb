class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
    @alerts = Alert.all
    @markers = @alerts.geocoded.map do |alert|
      {
        lat: alert.latitude,
        lng: alert.longitude,
        infoWindow: render_to_string(partial: "info_window", locals: { alert: alert })
      }
    end
  end
end
