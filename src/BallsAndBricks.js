import React, { useRef, useEffect } from 'react';

const Ball = ({ x, y, radius, color }) => {
  const ballRef = useRef(null);

  useEffect(() => {
    const ball = ballRef.current;
    const context = ball.getContext('2d');

    const drawBall = () => {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    };

    drawBall();
  }, [x, y, radius, color]);

  return <canvas ref={ballRef} width={radius * 2} height={radius * 2} />;
};

const Brick = ({ x, y, width, height, color }) => {
  const brickRef = useRef(null);

  useEffect(() => {
    const brick = brickRef.current;
    const context = brick.getContext('2d');

    const drawBrick = () => {
      context.fillStyle = color;
      context.fillRect(x, y, width, height);
    };

    drawBrick();
  }, [x, y, width, height, color]);

  return <canvas ref={brickRef} width={width} height={height} />;
};

const Game = () => {
  const canvasRef = useRef(null);
  const ballRef = useRef(null);
  const bricksRef = useRef([]);

  const width = 400;
  const height = 500;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickColumns = 12;
  const brickRows = 8;
  const brickGap = 2;
  const ballRadius = 10;

  const brickX = (width - brickWidth * brickColumns - brickGap * (brickColumns - 1)) / 2;
  const brickY = 50;

  const bricks = [];

  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickColumns; j++) {
      const x = brickX + j * (brickWidth + brickGap);
      const y = brickY + i * (brickHeight + brickGap);
      const color = `hsl(${i * 360 / brickRows}, 50%, 50%)`;
      bricks.push({ x, y, width: brickWidth, height: brickHeight, color });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const ball = ballRef.current;

    const ballX = width / 2;
    const ballY = height - 50;
    const ballSpeed = 3;
    const ballDirectionX = 1;
    const ballDirectionY = -1;

    const paddleWidth = 80;
    const paddleHeight = 10;
    const paddleX = width / 2 - paddleWidth / 2;
    const paddleSpeed = 5;

    const drawBall = () => {
      context.clearRect(0, 0, width, height);
      ball.clearRect(0, 0, ballRadius * 2, ballRadius * 2);

      context.fillStyle = 'black';
      context.fillRect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);

      ball.fillStyle = 'white';
      ball.beginPath();
      ball.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
      ball.fill();
      ball.closePath();

      bricksRef.current.forEach(brick => {
        if (brick) {
          const { x, y, width, height, color } = brick;
          const brickElement = new Brick({ x, y, width, height, color });
          context.drawImage(brickElement, x, y);

          if (
            ballX + ballRadius >= x &&
            ballX - ballRadius <= x + width &&
            ballY + ballRadius >= y &&
            ballY - ballRadius <= y + height
          ) {
            ballDirectionY *= -1;
          }
        }
      });

      if (ballX + ballRadius >= paddleX && ballX - ballRadius <= paddleX + paddleWidth) {
        if (ballY + ballRadius >= height - paddleHeight) {
          ballDirectionY *= -1;
        }
      }

      if (ballY + ballRadius > height) {
        alert('Game over');
      }

      if (ballX + ballRadius > width) {
        ballDirectionX *= -1;
      }

      if (ballX - ballRadius < 0) {
        ballDirectionX *= -1;
      }

      ballX += ballDirectionX * ballSpeed;
      ballY += ballDirectionY * ballSpeed;

      requestAnimationFrame(drawBall);
    };

    const drawPaddle = () => {
      const leftArrowPressed = 37 in window && window.event.keyCode === 37;
      const rightArrowPressed = 39 in window && window.event.keyCode === 39;

      if (leftArrowPressed) {
        paddleX -= paddleSpeed;
      }

      if (rightArrowPressed) {
        paddleX += paddleSpeed;
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = 'black';
      context.fillRect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);

      requestAnimationFrame(drawPaddle);
    };

    drawBall();
    drawPaddle();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
      <canvas ref={ballRef} width={ballRadius * 2} height={ballRadius * 2} />
      {bricks.map((brick, index) => (
        <Brick
          key={index}
          x={brick.x}
          y={brick.y}
          width={brick.width}
          height={brick.height}
          color={brick.color}
          ref={ref => (bricksRef.current[index] = ref)}
        />
      ))}
    </div>
  );
};

export default Game;