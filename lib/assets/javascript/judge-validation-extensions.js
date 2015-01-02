/**
 * JudgeValidationExtension
 *
 *  JudgeValidationExtension contains all the custom validations, and need to be loaded after judge in order,
 *  to exdend the judge behaviour adding new validations.
 *
 */


// (+) Validation User Existence
//
//     - This Validator is an asycronous validator, and check the existence of a specific parameter (in our case the email address),
//       in the user model. The validator returns true if the email address is already present in the user model, or false in the case
//       in which the email address is not found. The validator use a classic ajax call to the server.
//
judge.eachValidators.user_existence = function() {
  // create a 'pending' validation
  var validation = new judge.pending(); //new judge.Validation();
  $.ajax(judge.urlFor(this, 'user_existence')).done(function(messages) {
    // You can close a Validation with either an array
    // or a string that represents a JSON array
    validation.close(messages);
  });
  return validation;
};