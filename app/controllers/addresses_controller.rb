class AddressesController < ApplicationController
  before_action :find_address, only: %i[update destroy]

  def index
    @addresses = Address.all
  end

  def new
    @address = Address.new
  end

  def create
    @address = Address.new(address_params)
    @address.user = current_user

    redirect_to addresses_path if @address.save
  end

  def update
    @address.update(address_params)
  end

  def destroy
    @address.destroy
  end

  private

  def find_address
    @address = Address.find(params[:id])
  end

  def address_params
    params.require(:address).permit(:address, :label, :latitude, :longitude)
  end
end
