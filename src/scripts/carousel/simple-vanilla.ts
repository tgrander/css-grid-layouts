const track = document.querySelector(".carousel__track") as HTMLElement;
const slides = Array.from(track.children) as HTMLElement[];
const nextButton = document.querySelector(
  ".carousel__button--right"
) as HTMLElement;
const prevButton = document.querySelector(
  ".carousel__button--left"
) as HTMLElement;
const dotsNav = document.querySelector(".carousel__nav") as HTMLElement;
const dots = Array.from(dotsNav.children) as HTMLElement[];

const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange the slides next to one another
const setSlidePosition = (slide: HTMLElement, index: number) => {
  slide.style.left = index * slideWidth + "px";
};

slides.forEach(setSlidePosition);

const moveToSlide = (
  track: HTMLElement,
  currentSlide: HTMLElement,
  targetSlide: HTMLElement
) => {
  // move to the next slide
  track.style.transform = `translateX(-${targetSlide.style.left})`;
  currentSlide.classList.remove("current");
  targetSlide.classList.add("current");
};

const updateDots = (currentDot: HTMLElement, targetDot: HTMLElement) => {
  currentDot.classList.remove("current");
  targetDot.classList.add("current");
};

// On click left, move slides to the left
prevButton.addEventListener("click", () => {
  const currentSlide = track.querySelector(".current") as HTMLElement;
  const prevSlide = currentSlide.previousElementSibling as HTMLElement;
  const currentDot = dotsNav.querySelector(".current") as HTMLElement;
  const targetDot = currentDot.previousElementSibling as HTMLElement;

  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, targetDot);
});

// On click right, move slides to right
nextButton.addEventListener("click", (e) => {
  const currentSlide = track.querySelector(".current") as HTMLElement;
  const nextSlide = currentSlide.nextElementSibling as HTMLElement;
  const currentDot = dotsNav.querySelector(".current") as HTMLElement;
  const targetDot = currentDot.nextElementSibling as HTMLElement;

  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, targetDot);
});

// On click nav dot, move to that slide
dotsNav.addEventListener("click", (e) => {
  // Which dot was clicked?
  const targetDot = (e.target as HTMLElement).closest("button");
  if (!targetDot) return;

  const currentSlide = track.querySelector(".current") as HTMLElement;
  const currentDot = dotsNav.querySelector(".current") as HTMLElement;
  const targetIndex = dots.findIndex((dot) => dot === targetDot);
  const targetSlide = slides[targetIndex];

  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
});
