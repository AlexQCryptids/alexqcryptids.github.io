const card = document.getElementById('card');
const container = document.querySelector('.card-container');

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = -(y - centerY)/1.1 ;
  const rotateY = (x - centerX) /1.1;
  //const rotateX = 100 ;
  //const rotateY = 100;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});


