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
            $('.prompt_details_popup').addClass('active');
        });

        $('.idea_js').on('click', function(){
            $('.idea_popup').toggleClass('active');
        });

        $('.idea_popup li').on('click', function(){
            $('.idea_popup').removeClass('active');
        });

        $('.selected li').on('click', function(){
            $(this).toggleClass('active');
        });

        $('.header_global .menu').on('click', function(){
            $('.menu_content').addClass('active');
            $('.header_global').addClass('active');
            $('#global .flex.h-full.max-w-full.flex-1.flex-col').addClass('active');
        });

        $('.menu_content .menu').on('click', function(){
            $('.menu_content').removeClass('active');
            $('.header_global').removeClass('active');
            $('#global .flex.h-full.max-w-full.flex-1.flex-col').removeClass('active');
        });
       
    });

})(jQuery)

;(function($) {

 
  
})(jQuery)





