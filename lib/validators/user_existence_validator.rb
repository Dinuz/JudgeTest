class UserExistenceValidator < ActiveModel::EachValidator
  uses_messages :user_already_exist

  def validate_each(record, attribute, value)

    #options[:judge]

    unless !(User.exists?(email: value))
      record.errors.add(attribute, :user_already_exist, options.merge(:value => value))
    end        
  end


  



end

# This allows us to assign the validator in the model
#module ActiveModel::Validations::HelperMethods
#  def validates_user_existence(*attr_names)
#    validates_with UserExistenceValidator, _merge_attributes(attr_names)
#  end
#end
