class InviteRequest < ActiveRecord::Base
  
  validates :email, presence: true
  validates :email, format: {with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i}
  validates :email, user_existence: true #{judge: :ignore} #true
  validates :email, uniqueness: {case_sensitive: false} #{case_sensitive: false, judge: :ignore}

  
  before_validation :downcase_email
  before_save :downcase_email


  
    
  private

  def downcase_email
    self.email = self.email.downcase if self.email.present?
  end
  
end
