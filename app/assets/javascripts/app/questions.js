App.Questions = {
  Index: Backbone.View.extend({
    el: 'body',
    events: {
      'focus form textarea' : 'expandTextarea',
      'click button.reset' : 'returnTextarea',
      'click h4.discover' : 'toggleInfographic'
    },

    isLoggedIn: function(){
      return this.$('.logged').length();
    },

    toggleInfographic: function(event){
      var obj = $(event.target);
      obj.siblings('.infographic').slideToggle('slow');
      obj.toggleClass('active');
    },

    expandTextarea: function(event){
      var obj = $(event.target);
      var klass = obj.data('form-type');
      var hiddens = $('.' + klass + ' .hidden');
      $('.' + klass + ' textarea').animate({ height: "200px" })
      hiddens.slideDown("fast");
    },

    returnTextarea: function(event){
      var obj = $(event.target);
      var klass = obj.data('form-type');
      var hiddens = $('.' + klass + ' .hidden');
      $('.' + klass + ' textarea').animate({ height: "60px" });
      hiddens.slideUp("fast");
    },

    initialize: function(){
      this.forms = this.$('form');

      this.$('.chosen-select').chosen({
        no_results_text: "Nenhum assunto encontrado com "
      });

      if ( this.$('.message').text() !== '' ){
        this.$('.message').slideDown('fast');
        window.setTimeout("$('.message').slideUp()", 4000);
      }

      this.forms.bind('ajax:error', function(evt, xhr, settings){
        var response = $.parseJSON(xhr.responseText);
        var errors = response.errors;
        $('*', $(this)).removeClass('error_field');
        $('.error_message', $(this)).remove();
        for (name in errors) {
          var field = $('*[name="question['+name+']"]', $(this));
          field.addClass('error_field');
          field.after('<span class="error_message">'+errors[name][0]+'</span>');
        }
      });

      $('input[type=submit]').click(function(e){
        e.preventDefault();
        var parent_element = $(this).parent('form');
        parent_element.validate();

        var child = parent_element.children('input.provider_field');
        if (child.length) { child.remove(); }

        var provider = $(this).data('provider');
        var element = $('<input type="hidden" name="provider['+provider+']" value="'+provider+'" class ="provider_field">');

        parent_element.append(element);
        parent_element.trigger('submit');
      });
    },
  })
};
