Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :contacts, only: [:create, :index, :destroy, :update]
  resources :addresses, only: [:new, :create, :index, :destroy, :update]
  resources :alerts, only: [:create, :index, :update] do
    collection do
      post 'notify' => 'alerts#notify', :as => :notify
      post 'share_location' => 'alerts#share_location', :as => :share_location
    end
  end
end
