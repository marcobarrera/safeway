class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
    @alerts = Alert.all
    gon.alerts = Alert.all
    @markers = @alerts.geocoded.map do |alert|
      if alert.category == "robbery"
        img = "robbery.png"
      elsif alert.category == "fire arm"
        img = "gun.png"
      elsif alert.category == "fight"
        img = "fight.png"
      elsif alert.category == "suspicious"
        img = "suspish.png"
      elsif alert.category == "abuse"
        img = "abuse.png"
      elsif alert.category == "kidnap"
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
