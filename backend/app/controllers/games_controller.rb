class GamesController < ApplicationController
    def index
        # byebug
        @games = Game.all
        options = {
            include: [:user]
        }
        render json: GameSerializer.new(@games)
    end

end
