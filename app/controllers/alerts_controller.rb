class AlertsController < ApplicationController
  def index
    @alerts = Alerts.all
  end

  def create
    @alert = Alert.new(alert_params)
    @alert.user = current_user
  end

  def update
    @alert = Alert.find(params[:id])
    @alert.update(alert_params)
  end

  def notify
    @alert =
  end

  def share_location
  end

  private

  def alert_params
    params.require(:alert).permit(:category, :longitude, :latitude; :description, :expiration_time, :status, :address)
  end
end
