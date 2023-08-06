var $win = $(window);
var $doc = $(document);

(function ($) {
  $doc.ready(function () {
    $(".item_nav").on("click", function () {
      // $('.promt_item').removeClass('active');
      $(this).parent(".promt_item").toggleClass("active");
    });

    $(".close").on("click", function () {
      $(".popup").removeClass("active");
    });

    $(".close_popup").on("click", function () {
      $(".popup").removeClass("active");
    });

    $(".sign_up_js").on("click", function () {
      $(".popup").removeClass("active");
      $(".sign_up_popup").addClass("active");
    });

    $(".sign_in_js").on("click", function () {
      $(".popup").removeClass("active");
      $(".sign_in_popup").addClass("active");
    });

    $(".prompt_popup_js").on("click", function () {
      $(".popup").removeClass("active");
      $(".prompt_details_popup").addClass("active");
    });

    $(".idea_js").on("click", function () {
      console.log("idea_js____");
      // $(".idea_popup").toggleClass("active");
    });

    $(".idea_popup li").on("click", function () {
      console.log("idea_popup li____");
      $(".idea_popup").removeClass("active");
    });

    $(".selected li").on("click", function () {
      $(this).toggleClass("active");
    });

    $(".header_global .menu").on("click", function () {
      $(".menu_content").addClass("active");
      $(".header_global").addClass("active");
      $("#global .flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
      sessionStorage.setItem("menuOpened", true);
    });

    // // start click on chat
    // // let chat = "#global .flex.flex-col.gap-2.pb-2.text-gray-100.text-sm ol li";
    // console.log("ready__________");

    // // console.log("$(chat)", $(chat));

    // let nav = document.querySelector("nav");
    // console.log("nav", nav);
    // console.log(nav.querySelector(".flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto"));

    // nav
    //   .querySelector(".flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto")
    //   .addEventListener("click", function (e) {
    //     console.log("click on chat___________");
    //     // $(a)
    //     // .off("click")
    //     // .on("click", () => {
    //     let isMenuContentActive = $(".menu_content").hasClass("active");
    //     console.log("isMenuContentActive", isMenuContentActive);
    //     if (isMenuContentActive) {
    //       let intervalId = null;
    //       let count = 50;
    //       let currCount = 0;
    //       console.log("_____isMenuContentActive");

    //       intervalId = setInterval(() => {
    //         let isContentActive = $("#global .flex.h-full.max-w-full.flex-1.flex-col").hasClass("active");
    //         console.log("_____isContentActive", isContentActive);
    //         if (isContentActive && currCount >= count) {
    //           console.log("_____isMenuContentActive___ClearInterval");
    //           clearInterval(intervalId);
    //         } else {
    //           currCount++;
    //           $("#global .flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
    //         }
    //       }, 100);
    //     }
    //     // });

    //     // let isMenuContentActive = $(".menu_content").hasClass("active");
    //     // if (isMenuContentActive) {
    //     //   $("#global .flex.h-full.max-w-full.flex-1.flex-col").addClass("active");
    //     // }
    //   });
    // // end click on chat

    $(".menu_content .menu").on("click", function () {
      $(".menu_content").removeClass("active");
      $(".header_global").removeClass("active");
      $("#global .flex.h-full.max-w-full.flex-1.flex-col").removeClass("active");
      sessionStorage.setItem("menuOpened", false);
    });
  });
})(jQuery);
(function ($) {})(jQuery);
