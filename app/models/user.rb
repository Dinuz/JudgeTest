class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable #, :validatable
         #:email_regexp =>  /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/
         #:email_regexp =>  /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
  

  validates :email, presence: true, if: :email_required?
  validates :email, format: {with: Devise.email_regexp, allow_blank: true}, if: :email_changed?
  validates :email, user_existence: true #{judge: :ignore}
  validates :email, uniqueness: {case_sensitive: false, allow_blank: true}, if: :email_changed?
  
  validates :password, presence: true, if: :password_required?
  validates :password, length: {within: Devise.password_length, allow_blank: true }
  validates :password, confirmation: true, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_required?
end
