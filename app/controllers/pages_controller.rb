class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
    @alerts = Alert.all
    gon.alerts = Alert.all

    @markers = @alerts.geocoded.map do |alert|
      case alert.category
      when "robbery"
        img = "robbery.png"
      when "fire arm"
        img = "gun.png"
      when "fight"
        img = "fight.png"
      when "suspicious"
        img = "suspish.png"
      when "abuse"
        img = "abuse.png"
      when "kidnap"
        img = "kidnap.png"
      else
        img = "alert.png"
      end
      {
        lat: alert.latitude,
        lng: alert.longitude,
        infoWindow: render_to_string(partial: "info_window", locals: { alert: alert }),
        image_url: helpers.asset_url(img),
      }
    end
  end
end
