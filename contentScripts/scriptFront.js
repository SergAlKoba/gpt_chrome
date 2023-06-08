var $win = $(window);
var $doc = $(document);

;(function($) {

    $doc.ready(function(){

        $('.item_nav').on('click', function(){
            // $('.promt_item').removeClass('active');
            $(this).parent('.promt_item').toggleClass('active');
        });

        $('.close').on('click', function(){
            $('.popup').removeClass('active');
        });

        $('.close_popup').on('click', function(){
            $('.popup').removeClass('active');
        });

        $('.sign_up_js').on('click', function(){
            $('.popup').removeClass('active');
            $('.sign_up_popup').addClass('active');
        });

        $('.sign_in_js').on('click', function(){
            $('.popup').removeClass('active');
            $('.sign_in_popup').addClass('active');
        });

        $('.prompt_popup_js').on('click', function(){
            $('.popup').removeClass('active');
            $('.prompt_popup').addClass('active');
        });

        $('.idea_js').on('click', function(){
            $('.idea_popup').toggleClass('active');
        });

        $('.idea_popup li').on('click', function(){
            $('.idea_popup').removeClass('active');
        });
       
    });

})(jQuery)

;(function($) {

 
  
})(jQuery)





