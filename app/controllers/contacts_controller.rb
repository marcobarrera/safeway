class ContactsController < ApplicationController
  
  before_action :find_contact, only: [:update, :destroy]

  def index
    @contacts = Contact.all
  end

  def new
    @contact = Contact.new
  end
  

  def create
    @contact = Contact.new(contact_params)
    @contact.user = current_user
    
    if @contact.save
      redirect_to contacts_path
    else 
    end
  end

  def update
    @contact.update (contact_params)
  end

  def destroy
    @contact.destroy
  end

  private

  def find_contact
    @contact = Contact.find(params[:id])
  end

  def contact_params
    params.require(:contact).permit(:first_name, :last_name, :phone_number, :email, :emergency_contact)
  end

end
