class CoordinatesController < ApplicationController
	skip_before_action :verify_authenticity_token, only: [:create] 
	def create
    @location = Location.find(params[:location_id])
    @coordinate = Coordinate.new(latitude: params[:lat], longitude: params[:lng], location: @location)
    @coordinate.location = @location
	    if @coordinate.save
	    	LocationChannel.broadcast_to(
			  @location,
			  { lat: @coordinate.latitude, lng: @coordinate.longitude }.to_json
			)
	    else
	      render "locations/show"
	    end
    end

 	private
 	def coordinate_params
 		params.require(:coordinate).permit(:latitude, :longitude)
 	end


end
