class GameSerializer
  include FastJsonapi::ObjectSerializer
  attributes :created_at, :user, :score
  belongs_to :user
end
