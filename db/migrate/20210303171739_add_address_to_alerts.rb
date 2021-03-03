class AddAddressToAlerts < ActiveRecord::Migration[6.0]
  def change
    add_column :alerts, :address, :string
  end
end
