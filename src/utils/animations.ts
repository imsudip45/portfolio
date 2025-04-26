/**
 * Function to add animation to elements when they come into view
 * @param element - The DOM element to animate
 * @param animation - The animation class to add
 * @param threshold - The visibility threshold (0-1)
 */
export const animateOnScroll = (
  element: HTMLElement,
  animation: string,
  threshold: number = 0.2
): void => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.classList.add(animation);
          observer.unobserve(element);
        }
      });
    },
    { threshold }
  );

  observer.observe(element);
};

/**
 * Apply staggered animation to a group of elements
 * @param elements - NodeList of elements to animate
 * @param animation - The animation class to add
 * @param delay - Delay between each element animation in ms
 */
export const staggerAnimation = (
  elements: NodeListOf<Element>,
  animation: string,
  delay: number = 100
): void => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animation);
    }, index * delay);
  });
};

/**
 * Handle skill bar animations
 * @param skillBars - NodeList of skill bar elements
 */
export const animateSkillBars = (skillBars: NodeListOf<HTMLElement>): void => {
  skillBars.forEach((bar) => {
    const width = bar.dataset.width || '0%';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
};

/**
 * Text typing animation effect
 * @param element - The element to add typed text to
 * @param text - The text to type
 * @param speed - Typing speed in ms
 */
export const typeText = (
  element: HTMLElement,
  text: string,
  speed: number = 70
): void => {
  let i = 0;
  element.textContent = '';
  
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
};