const carCanvas = document.querySelector('#carCanvas');
carCanvas.width = 200;

const networkCanvas = document.querySelector('#networkCanvas');
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const N = 100;
const cars = generateCars(N);

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2)];
let bestCar = cars[0];

if(localStorage.getItem('bestBrain')){
    bestCar.brain = JSON.parse(localStorage.getItem('bestBrain'));
}

function save(){
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function generateCars(N) {
    const cars = [];
    for(let i = 0; i < N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
    }
    return cars;
}

function discard(){
    localStorage.removeItem('bestBrain');
}

const animate = (time) => {
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.5);
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, 'green');
    }
    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, 'blue');
    }
    bestCar.draw(carCtx, 'blue', true);
    carCtx.globalAlpha = 1;
    carCtx.restore();
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

animate();
