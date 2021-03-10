class Location < ApplicationRecord
  belongs_to :user
  has_many :coordinates
end
