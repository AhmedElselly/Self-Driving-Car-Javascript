const canvas = document.querySelector('#myCanvas');

canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext('2d');

const car = new Car(100, 100, 30, 50);
car.draw(ctx);

animate();

const animate = () => {
    car.update();
    car.draw();
    requestAnimationFrame(animate);
}