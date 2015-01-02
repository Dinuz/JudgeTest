class InviteRequestsController < ApplicationController
  
  responders :flash
  
  respond_to :html, :xml, :json, :js

  def new
    @invite_request = InviteRequest.new
  end

  def create
    @invite_request = InviteRequest.new(invite_request_params)

    # Check if @invite_request exist
    # (1) if exist save it and respond with @invite_request
    # (2) if not exist just render the index as template
    if @invite_request.save
      respond_with({}, location: root_path())
    else
      respond_with(@invite_request)
    end
  end
  
  
  private
  
  #  (C.3) PERMIT PARAMETERS (STRONG PARAMETERS)
  def invite_request_params
    params.require(:invite_request).permit(:email, :invite_sent)
  end
end
