jQuery(document).ready(function ($) {
  "use strict";
  var previousButton, nextButton;
  var slidesContainer, slides, slideDots;
  previousButton = document.querySelector(".previous");
  nextButton = document.querySelector(".next");
  slidesContainer = document.querySelector(".slides");
  slides = slidesContainer.querySelectorAll(".slide");
  let slidesForFocus = slidesContainer.querySelectorAll(".slide a");
  let carouselHeaders = document.querySelectorAll(".carouselHeaders");

  makeDots();
  slideDots = document.querySelectorAll(".navigation li div");
  setUpDotBehavior();

  // Set up previous/next button behaviors
  previousButton.addEventListener("click", goToPreviousSlide);
  nextButton.addEventListener("click", goToNextSlide);

  hideNonVisibleSlides();

  // Allows for current slide to persit on a session basis and sets it in finishSetUp
  var currentSlideIndex = 0;
  let indexInSS;
  getUserSessionStorage();
  finishSetUp();

  /* Functions */

  // Create the correct number of dots
  function makeDots() {
    var numSlides = slides.length;
    var dots = document.getElementsByClassName("navigation")[0];
    for (var i = 0; i < numSlides; i++) {
      var li = document.createElement("li");
      var pageNum = i + 1;
      var title = carouselHeaders[i].textContent.trim();
      var titleWoQuotes = title.replace(/['"]+/g, "");
      var label = `Card ${pageNum} of ${numSlides}: ${titleWoQuotes}`;
      li.innerHTML =
        '<div class="carousel__navigation_button"> <svg class="carousel__navigation_dot" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"  aria-label="' +
        label +
        '"> <circle cx="50%" cy="48%" r="25" /> </svg> </div>';
      dots.appendChild(li);
    }
  }

  // Listener for dots to take user to slide
  function setUpDotBehavior() {
    slideDots.forEach(function (dot, index) {
      dot.addEventListener("click", function (e) {
        goToSlide(index);
      });
    });
  }

  // Getter of currentSlideIndex if it exists in userSessionStorage
  function getUserSessionStorage() {
    if ($("html").attr("lang") === "es") {
      indexInSS = sessionStorage.getItem("storedCarouselIndexSpanish");
    }
    else {
      indexInSS = sessionStorage.getItem("storedCarouselIndexEnglish");
    }
  }

  // sets currentSlideIndex to what's stored in userSessionStorage
  function finishSetUp() {
    if (indexInSS != null) {
      currentSlideIndex = indexInSS;
      goToSlide(currentSlideIndex, {"setFocus": false});
    }

    if (slideDots.length > 0) {
      slideDots[currentSlideIndex].setAttribute("aria-current", true);
    }
  }

  function goToPreviousSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
    else {
      goToSlide(slides.length - 1);
    }
  }

  function goToNextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
    else {
      goToSlide(0);
    }
  }

  function goToSlide(newCurrentSlideIndex) {
    setUserSessionStorage(newCurrentSlideIndex);
    scrollToNewSlide(newCurrentSlideIndex);
    updateAria(newCurrentSlideIndex);

    // Update the record of the left-most slide
    currentSlideIndex = Number(newCurrentSlideIndex);

    // Update each slide so that the ones that are now off-screen are fully hidden.
    hideNonVisibleSlides();

    // set focus on current slide
    if (arguments[1] && arguments[1].setFocus !== false) {
      slidesForFocus[newCurrentSlideIndex].focus();
    }
  }

  // set new currentSlide in userSessionStorage
  function setUserSessionStorage(newCurrentSlideIndex) {
    if ($("html").attr("lang") === "es") {
      sessionStorage.setItem(
        "storedCarouselIndexSpanish",
        newCurrentSlideIndex
      );
    }
    else {
      sessionStorage.setItem(
        "storedCarouselIndexEnglish",
        newCurrentSlideIndex
      );
    }
  }

  function scrollToNewSlide(newCurrentSlideIndex) {
    // Smoothly scroll to the requested slide
    if (window.innerWidth >= 1024) {
        $(slidesContainer).animate(
          {
            "scrollLeft":
              (slidesContainer.offsetWidth / 3) * newCurrentSlideIndex,
          },
          {
            "duration": 200,
          }
        );
    }
    else if (window.innerWidth > 639 && window.innerWidth < 1024) {
      $(slidesContainer).animate(
        {
          "scrollLeft":
          (slidesContainer.offsetWidth / 2) * newCurrentSlideIndex
        },
        {
          "duration": 200,
        }
      );
    }
    else {
      $(slidesContainer).animate(
        {
          "scrollLeft":
          (slidesContainer.offsetWidth) * newCurrentSlideIndex
        },
        {
          "duration": 200,
        }
      );
    }
  }

  function updateAria(newCurrentSlideIndex) {
    // Unset aria-current attribute from any slide dots that have it
    slideDots.forEach(function (dot) {
      dot.removeAttribute("aria-current");
    });

    // Set aria-current attribute on the correct slide dot
    slideDots[newCurrentSlideIndex].setAttribute("aria-current", true);
  }

  // Fully hide non-visible slides by adding aria-hidden="true" and tabindex="-1" when they go out of view
  function hideNonVisibleSlides() {
    // Start by hiding all the slides and their content
    slides.forEach(function (slide) {
    slide.setAttribute("aria-hidden", true);

    slide
    .querySelectorAll('a, button, select, input, textarea, [tabindex="0"]')
      .forEach(function (focusableElement) {
        focusableElement.setAttribute("tabindex", -1);
      });
    });

    var offset = 0;
    var rightLimit = 0;
    var numItems = 6;
    var leftLimit = 0;

    if (window.innerWidth >= 1024) {
      offset = 3;
      rightLimit = 3;
      leftLimit = 3;
    }
    else if (window.innerWidth > 480 && window.innerWidth < 1024) {
      offset = 2;
      rightLimit = 2;
      leftLimit = 4;
    }
    else {
      offset = 1;
      rightLimit = 1;
      leftLimit = 5;
    }

    if (currentSlideIndex < rightLimit) {
      for (var i = currentSlideIndex; i < currentSlideIndex + offset; i++) {
        slides[i].removeAttribute("aria-hidden");

        slides[i]
          .querySelectorAll(
            'a, button, select, input, textarea, [tabindex="0"]'
            )
          .forEach(function (focusableElement) {
            focusableElement.removeAttribute("tabindex");
          });
      }
    }
    else {
      for (var j = leftLimit; j < numItems; j++) {
        slides[j].removeAttribute("aria-hidden");

        slides[j]
          .querySelectorAll(
            'a, button, select, input, textarea, [tabindex="0"]'
          )
          .forEach(function (focusableElement) {
            focusableElement.removeAttribute("tabindex");
          });
      }
    }
  }
});
