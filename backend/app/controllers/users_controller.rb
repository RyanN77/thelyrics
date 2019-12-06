class UsersController < ApplicationController
    def index  
        @users = User.all
        render json: @users
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create 
        user = User.find_or_create_by(user_params)
        game = Game.new(score: params[:score])
        game.user = user
        game.save 
        render json: user
    end

    private

    def user_params
        params.require(:user).permit(:name, :score)
    end

end
