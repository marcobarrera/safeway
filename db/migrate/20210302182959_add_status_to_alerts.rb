class AddStatusToAlerts < ActiveRecord::Migration[6.0]
  def change
    add_column :alerts, :status, :string
  end
end
