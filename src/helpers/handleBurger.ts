
const burgerLogic = (): void => {
  const burgerIcon = document.getElementById('nav-icon4') as HTMLDivElement;
  const nav = document.querySelector('.nav');
  if (burgerIcon.classList.contains('open')) {
      burgerIcon.removeAttribute('class');
      nav?.classList.remove('openMenu');
  } else {
      burgerIcon.classList.add('open');
      nav?.classList.add('openMenu');
  }
}

export default burgerLogic;