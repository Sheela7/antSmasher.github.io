class AntGame {
  constructor(antQuantity, speed, size) {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 1200;
    this.canvas.height = 600;
    this.antQuantity = antQuantity;
    this.size = size;
    this.speed = speed;
    this.ants = [];
    this.antImage = new Image();
    this.antImage.src = "images/ant.png";
    this.canvas.addEventListener("click", this.handleMouseClick.bind(this));

    //Total Score
    this.score = 0;
    this.scoreElement = document.getElementById("score-value"); // HTML element for displaying the score
    this.scoreElement.textContent = this.score;
    this.canvas.addEventListener("click", this.handleMouseClick.bind(this));

    //Blood
    this.bloodImage = new Image();
    this.bloodImage.src = "images/blood.png";
    this.bloods = [];
  }

  handleMouseClick(event) {
    const mouseX = event.clientX - this.canvas.offsetLeft;
    const mouseY = event.clientY - this.canvas.offsetTop;

    for (let i = 0; i < this.ants.length; i++) {
      const ant = this.ants[i];
      const distance = Math.sqrt((mouseX - ant.x) ** 2 + (mouseY - ant.y) ** 2);

      if (distance < this.size / 2) {
        this.ants.splice(i, 1); // Remove the clicked ant from the array
        this.score++; // Increment the score
        this.scoreElement.textContent = this.score; // Update the score display

        // Create a blood animation at the ant's position
        const blood = { x: ant.x, y: ant.y, alpha: 1.0 };
        this.bloods.push(blood);

        // Remove the blood animation after a certain duration
        setTimeout(() => {
          const index = this.bloods.indexOf(blood);
          if (index !== -1) {
            this.bloods.splice(index, 1);
          }
        }, 1000); // Adjust the duration as needed
        break; // Exit the loop since ant is destroyed
      }
    }
  }

  createAnts() {
    for (let i = 1; i <= this.antQuantity; i++) {
      let isOverlapping = true;
      let x, y;

      while (isOverlapping) {
        isOverlapping = false;
        x = Math.random() * (this.canvas.width - this.size * 2) + this.size;
        y = Math.random() * (this.canvas.height - this.size * 2) + this.size;

        for (let j = 0; j < this.ants.length; j++) {
          const existingAnt = this.ants[j];
          const distance = Math.sqrt(
            (x - existingAnt.x) ** 2 + (y - existingAnt.y) ** 2
          );
          if (distance < this.size * 2) {
            isOverlapping = true;
            break;
          }
        }
      }

      const dx = (Math.random() - 0.8) * this.speed;
      const dy = (Math.random() - 0.8) * this.speed;
      const ant = { x, y, dx, dy };
      this.ants.push(ant);
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.ants.length; i++) {
      const ant = this.ants[i];
      // Calculate the angle based on velocity components
      const angle = Math.atan2(ant.dy, ant.dx);

      // Save the current canvas state
      this.ctx.save();

      // Translate to the ant's position
      this.ctx.translate(ant.x, ant.y);

      // Rotate the canvas based on the calculated angle
      this.ctx.rotate(angle);

      this.ctx.drawImage(
        this.antImage,
        -this.size / 2,
        -this.size / 2,
        this.size,
        this.size
      );

      this.ctx.restore();

      ant.x += ant.dx;
      ant.y += ant.dy;

      if (ant.x + this.size > this.canvas.width || ant.x - this.size < 0) {
        ant.dx = -ant.dx;
      }

      if (ant.y + this.size > this.canvas.height || ant.y - this.size < 0) {
        ant.dy = -ant.dy;
      }

      for (let j = 0; j < this.ants.length; j++) {
        if (i !== j) {
          const otherAnt = this.ants[j];
          if (this.checkCollision(ant, otherAnt)) {
            ant.dx = -ant.dx;
            ant.dy = -ant.dy;
          }
        }
      }

      for (let i = 0; i < this.bloods.length; i++) {
        const blood = this.bloods[i];
        this.ctx.globalAlpha = blood.alpha;
        this.ctx.drawImage(
          this.bloodImage,
          blood.x - this.size / 2,
          blood.y - this.size / 2,
          this.size,
          this.size
        );
        this.ctx.globalAlpha = 1.0;
        blood.alpha -= 0.005; // Adjust the fade-out speed as needed

        if (blood.alpha <= 0) {
          this.bloods.splice(i, 1); // Remove faded blood animation
        }
      }
    }

    requestAnimationFrame(() => this.update());
  }

  initGame() {
    this.createAnts();
    this.update();
  }

  checkCollision(ant1, ant2) {
    const distance = Math.sqrt((ant1.x - ant2.x) ** 2 + (ant1.y - ant2.y) ** 2);
    const combinedRadius = this.size * 0.7; // Adjust the collision area by reducing the radius
    return distance < combinedRadius;
  }
}

const antQuantity = 35;
const speed = 1.5;
const size = 40;

const canvas = new AntGame(antQuantity, speed, size);
canvas.initGame();
