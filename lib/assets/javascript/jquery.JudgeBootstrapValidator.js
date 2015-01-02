/**
 * JudgeBootstrapValidator
 *
 *  JudgeBootstrapValidator is a small, compact and highly configurable plugin for jQuery,
 *  that allow the user to create client-side validation for his/her Ruby on Rails application, 
 *  using the Judge library (for the heavy work in traslating the server side validation into client-side),
 *  and the bootstrap 3 convention (for what concern the styling of the errors).
 *
 *  The plugin require the presence of the Jquery Library, the Judge Library, please add it to your journal,
 *  before utilize the plugin.
 *
 *  (+) Judge - https://github.com/joecorcoran/judge
 *
 *  @author     Massimiliano Marzo <massimiliano.marzo@gmail.com>
 *  @version    1.0.0 (last revision: November 18, 2014)
 *  @copyright  (c) 2014 Massimiliano Marzo
 *  @license    http://www.opensource.org/licenses/mit-license.php
 *  @package    JudgeBootstrapValidator
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 */

/**
 * This is were we check if the Jquery Library is present
 */
if (typeof jQuery === 'undefined') {
    throw new Error('JudgeBootstrapValidator requires jQuery');
}

/**
 * This is were we check if the Jquery Library present is at least version 1.9.1
 */
(function($, window, document, undefined) {
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((+version[0] < 2 && +version[1] < 9) || (+version[0] === 1 && +version[1] === 9 && +version[2] < 1)) {
        throw new Error('JudgeBootstrapValidator requires jQuery version 1.9.1 or higher');
    }
}(jQuery, window, document));

/**
 * This is were we check if the Judge Library is present
 */
if (typeof judge === 'undefined') {
    throw new Error('JudgeBootstrapValidator requires judge library');
}



(function($, window, document, undefined) {

    /**
     * Store the plugin name in a variable. It helps you if later decide to 
     * change the plugin's name
     * @type {String}
     */
    var pluginName = 'JudgeBootstrapValidator';
 
    /**
     * The plugin constructor
     * @param {DOM Element} element The DOM element where plugin is applied
     * @param {Object} options Options passed to the constructor
     */
    function Plugin(element, options) {

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set the instance options extending the plugin defaults and the options passed by the user
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
           
        // Initialize the plugin instance
        this.init();
    }

    /**
     * Set up your Plugin prototype with desired methods.
     * It is a good practice to implement 'init' and 'destroy' methods.
     */
    Plugin.prototype = {
        
        /**
         * Initialize the plugin instance.
         *         
         */
        init: function() {
            
            _that = this;

            this._bindEvents();   
        },
        
        /**
         * The 'destroy' method is were you free the resources used by your plugin
         *
         */
        destroy: function() {
            // Unbind any event from the plugin
            this.$el.off('.' + pluginName);

            // Remove any attached data from the plugin
            this.$el.removeData();
        },
        
        /**
         * Bind all events on the input. (i.e: blur, ...)
         *
         * @returns {*}
         */
        _bindEvents: function() { 
            // Bind - Validate the field if it contains the data-validate attribute. '[data-validate]'
            this.$el.on('blur.' + pluginName, '[data-validate]', function() {                
                return _that._validateInput(this);
            });
            
            this.$el.on('focus.' + pluginName, '[data-validate]', function() {                 
                return _that._clearMessageOnFocus(this);
            });

            // Bind - Validate the field if the element has already been checked when we change the value.
            this.$el.on('input.' + pluginName + ' ' + 'propertychange.' + pluginName, this._generateSelectorOnInput(), function() {
                // Take care of the confirmation. (password, basically)
                var id = $(this).attr('id');
                if(id.indexOf('_confirmation') !== -1){
                    // Validate the input that has the same id without the '_confirmation' part.
                    _that._validateInput(document.getElementById(id.replace('_confirmation', '')));// Don't use jQuery, Judge don't expect a jQuery instance.
                }
                // Validate also the input itself.
                return _that._validateInput(this);
            });

            // Bind - Validate the field if the value is changed, for select inputs.
            this.$el.on('change.' + pluginName, this._generateSelectorOnInput(), function() {
                return _that._validateInput(this);
            });
            
            // Bind - On form submit, validate all elements.
            return this.$el.on('submit.' + pluginName, _that._validateAll);
        },        
        
        /**
         * Validate all inputs.
         *
         * @param event
         * @returns {*}
         * @private
         */
        _validateAll: function(event) {
            // Run the validation for each field.
            $(this).find('[data-validate]').each(function() {
                return _that._validateInput(this);
            });

            // If an input exist with the error class then don't send the form.
            if ($(this).find('[data-validate].' + _that.options.InputErrorClass)[0]) {
                event.stopPropagation();
                return event.preventDefault();
            }
        },
        
        /**
         * Validate one input.
         *
         * @param element
         * @returns {*}
         * @private
         */
        _validateInput: function(element) {
            //var _result = judge.validate(element, function() {
            //    return;
            //});

            //_that._checkValidateResult(element,_result);
            
            return judge.validate(element, {
                valid: this._valid,
                invalid: this._invalid
            });
        },
        
        /**
         * Validate one input.
         *
         * @param element
         * @param result
         * @returns {*}
         * @private
         */
        _checkValidateResult: function(element,result) {
            
            var result_map = _.map(result.validations, function(obj){
                return obj.messages; 
            });
                
            var result_checker = _.find(result_map, function(msg){ 
                if(msg.length>0){
                    return msg; 
                }
            });
                
            if(!result_checker){
                _that._valid(element);
            }else{
                _that._invalid(element,result_checker);
            }
        },
        
        /**
         * Called when an element is valid.
         * Remove error class/messages and add success class.
         *
         * @param element
         * @returns {*}
         * @private
         */
        _valid: function(element) {
            var _ref = _that._getMsgItem(element);
            if (_ref !== null) {
                _ref.remove();
            }
            _that._addDefaultParentClasses(element);
            
            $(element).removeClass(_that.options.InputErrorClass).addClass(_that.options.InputSuccessClass);
            $(element).closest('.form-group').removeClass(_that.options.ParentInputErrorClass).addClass(_that.options.ParentInputSuccessClass);
            
            $(element).closest('.form-group').find('.' + _that.options.DivMessageClass + '.' + _that.options.DivHintMessageClass).addClass( _that.options.DivHintHideMessageClass);

            _that._refreshIcon(element, _that.options.IconSuccess);

            return $(element);
        },
        
        /**
         * Called when an element is not valid.
         * Add error class and remove success class/messages.
         *
         * @param element - Element where the errors appeared.
         * @param messages - Error messages to display.
         * @returns {*}
         * @private
         */
        _invalid: function(element, messages) {
            var message = messages[0];

            $(_that._findOrCreateMsgItem(element)).text(message);
            _that._addDefaultParentClasses(element);
               
            $(element).removeClass(_that.options.InputSuccessClass).addClass(_that.options.InputErrorClass);
            $(element).closest('.form-group').removeClass(_that.options.ParentInputSuccessClass).addClass(_that.options.ParentInputErrorClass);
               
            $(element).closest('.form-group').find('.' + _that.options.DivMessageClass + '.' + _that.options.DivHintMessageClass).addClass( _that.options.DivHintHideMessageClass);

            _that._refreshIcon(element, _that.options.IconError);

            return $(element);
        },
        
        /**
         * Generate the Selector for the input.
         *
         * @param element
         * @returns {*}
         * @private
         */
        _clearMessageOnFocus: function(element) {
            $(element).closest('.form-group').find('.' + _that.options.DivMessageClass + '.' + _that.options.DivHintMessageClass).removeClass( _that.options.DivHintHideMessageClass);
            $(element).removeClass(_that.options.InputErrorClass);
            $(element).removeClass(_that.options.InputSuccessClass);
            $(element).closest('.form-group').removeClass(_that.options.ParentInputErrorClass);
            $(element).closest('.form-group').removeClass(_that.options.ParentInputSuccessClass);
                
            ($(element).closest('.form-group').find('.' + _that.options.IconBaseClasses)).remove();
            ($(element).closest('.form-group').find('.' + _that.options.DivMessageClass + '.' + _that.options.DivErrorMessageClass)).remove();
        },
        
        /**
         * Generate the Selector for the input.
         *
         * @returns {*}
         * @private
         */
        _generateSelectorOnInput: function() {
            var selector = '';

            if(_that.options.live && _that.options.live.not_validated){
                selector += '[data-validate]:not(.' + _that.options.InputSuccessClass + ', .' + _that.options.InputErrorClass + ')';
            }

            if(_that.options.live && _that.options.live.valid){
                selector += (selector.length ? ', ' : '') + '[data-validate].' + _that.options.InputSuccessClass;
            }

            if(_that.options.live && _that.options.live.invalid){
                selector += (selector.length ? ', ' : '') + '[data-validate].' + _that.options.InputErrorClass;
            }

            return selector;
        },
        
        /**
         * Displays the first error message if exists or return null.
         *
         * @param element
         * @returns {*}
         */
        _findOrCreateMsgItem: function(element) {
            var $item;
            var $hint;
            var x = _that._getMsgItem(element);
            if (x) {
                return x;
            } else {
                $item = $('<span class="' + _that.options.DivMessageClass + ' ' + _that.options.DivMessageStyleClass + ' ' + _that.options.DivErrorMessageClass + '"></span>');
                $item.insertAfter($(element));
                return $item;
            }
        },
        
        /**
         * Returns the first error message if exists, or null.
         *
         * @param element
         * @returns {*}
         */
        _getMsgItem: function(element) {
            var x = ($(element).closest('.form-group').find('.' + _that.options.DivMessageClass + '.' + _that.options.DivErrorMessageClass))[0];
            if (x) {
                return x;
            } else {
                return null;
            }
        },
        
        /**
         * Refresh the displayed icon.
         * Remove the element from the DOM and recreate it.
         *
         * @param element
         * @param classToApply - Either ICON_SUCCESS or ICON_ERROR
         * @private
         */
        _refreshIcon: function(element, classToApply) {
            var $item;
            ($(element).closest('.form-group').find('.' + _that.options.IconBaseClasses)).remove();
            $item = $('<i class="' + _that.options.IconBaseClasses + ' ' + classToApply + '"></i>');
            $item.insertAfter($(element));
        },
        
        /**
         * Add the default class to the parent element if they don't exists.
         *
         * @param element
         * @private
         */
        _addDefaultParentClasses: function(element) {
            if(!$(element).parent().hasClass(_that.options.ParentInputBaseClasses)){
                $(element).parent().addClass(_that.options.ParentInputBaseClasses);
            }
        }
    };
    
    /**
     * Plugin registration withint jQuery plugins.
     *
     * @param options
     */
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each selected element.
            if (Array.prototype.slice.call(args, 1).length === 0 && $.inArray(options, $.fn[pluginName].getters) !== -1) {
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };

    /**
     * Default options
     */
    $.fn[pluginName].defaults = {
        
        // (-) Performs live validation, on value change.
        live: {
            not_validated: true,
            valid: true,
            invalid: true
        },
        
        // Parent of all inputs.
        ParentInputBaseClasses: 'has-feedback',

        ParentInputErrorClass: 'has-error',
        ParentInputSuccessClass: 'has-success',
        ParentInputValidatingClass: 'has-warning',

        // Inputs.
        InputErrorClass: 'error',
        InputSuccessClass: 'success',
        InputValidatingClass: 'warning',
        
        DivMessageClass: 'help-block',
        DivMessageStyleClass: 'small',
        // Error messages.
        DivErrorMessageClass: 'error',
        DivHintMessageClass: 'hint',
        
        DivHintHideMessageClass: 'hidden',

        // Icons.
        IconBaseClasses: 'form-control-feedback',

        IconSuccess: 'glyphicon glyphicon-ok',//'fa fa-check',
        IconError: 'glyphicon glyphicon-remove',//'fa fa-times',
        IconValidating: 'glyphicon glyphicon-warning-sign'//'fa fa-refresh'
    };

})(jQuery, window, document);