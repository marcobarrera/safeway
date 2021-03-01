class CreateAlerts < ActiveRecord::Migration[6.0]
  def change
    create_table :alerts do |t|
      t.string :category
      t.float :longitude
      t.float :latitude
      t.text :description
      t.time :expiration_time
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
