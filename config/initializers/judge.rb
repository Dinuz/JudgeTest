# Judge Global Configuration
#
# In order to validate uniqueness Judge sends requests to the mounted Judge::Engine path, 
# which responds with a JSON representation of an error message array. The array is empty if the value is valid.
# 
# Since this effectively means adding an open, queryable endpoint to your application, Judge is cautious and requires 
# you to be explicit about which attributes from which models you would like to expose for validation via XHR. 
# Allowed attributes are configurable as in the following example. Note that you are only required to do this for uniqueness 
# and any other validators you write that make requests to the server.

Judge.configure do
  expose InviteRequest, :email
  expose User, :email
end

#Judge.config.exposed[InviteRequest] = [:email]
#Judge.config.exposed[User] = [:email]