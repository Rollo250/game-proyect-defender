import Defender from "../gameObjects/defender.js";

class Scene_play extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_play" });
    this.bola = null;
    this.dron1 = null;
  }

  create() {
    // Defender
    this.defender = new Defender(
      this,
      this.sys.game.config.width / 2,
      280,
      "defender"
    );
    //controles defender
    this.cursor = this.input.keyboard.createCursorKeys();

    this.cursor_A = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.cursor_D = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    // Shot
    this.bola = this.physics.add
      .image(this.sys.game.config.width / 2, 80, "shot")
      .setScale(0.3);
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.bola.setCollideWorldBounds(true);
    this.bola.setBounce(1);
    this.bola.setVelocityY(200);

    // Edificios
    const edificioX = [40, 120, 200, 280];
    const edificioY = 360;
    const edificioScale = 2;

    for (let i = 0; i < edificioX.length; i++) {
      const edificio = this.add
        .image(edificioX[i], edificioY, "edificio")
        .setScale(edificioScale);

      this.physics.add.existing(edificio);
      edificio.body.setImmovable(true);

      this.physics.add.collider(
        this.bola,
        edificio,
        this.boomEdificio.bind(this, edificio),
        null,
        this
      );
    }

    // Dron
    this.dron1 = new Phaser.Physics.Arcade.Sprite(
      this,
      Phaser.Math.Between(50, this.sys.game.config.width - 50),
      Phaser.Math.Between(40, 120),
      "dron"
    );
    this.physics.add.existing(this.dron1);
    this.dron1.setCollideWorldBounds(true);
    this.add.existing(this.dron1);
    this.dron1.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(50, 150)
    );

    // Físicas
    this.physics.add.collider(
      this.bola,
      this.dron1,
      this.boom.bind(this),
      null,
      this
    );
    this.physics.add.collider(
      this.bola,
      this.defender,
      () => {
        this.holdBola();
        this.chocaBola();
      },
      null,
      this
    );
  }

  boom(bola, dron1) {
    this.tweens.add({
      targets: [bola, dron1],
      duration: 50,
      repeat: 3,
      alpha: 0,
      yoyo: true,
      onComplete: () => {
        bola.destroy();
        dron1.destroy();
        this.generateDron();
      },
    });
  }

  boomEdificio(edificio) {
    this.tweens.add({
      targets: edificio,
      duration: 200,
      repeat: 3,
      alpha: 0,
      yoyo: true,
      onComplete: () => {
        edificio.destroy();
      },
    });
    this.bola.destroy();
  }

  handleCollision(bola, defender) {
    if (
      this.input.keyboard.checkDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
      )
    ) {
      this.holdBola();
    } else {
      this.chocaBola();
    }
  }

  chocaBola() {
    const angle = Phaser.Math.Between(30, 150);
  const radians = Phaser.Math.DegToRad(angle);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const velocityX = cos * this.bola.body.velocity.y;
  const velocityY = sin * this.bola.body.velocity.y;
  this.bola.setVelocity(velocityX, velocityY);
  }

  holdBola() {
    this.bola.x = this.defender.x;
  this.bola.y = this.defender.y;

  const tween = this.tweens.add({
    targets: this.bola,
    duration: 50,
    repeat: -1,
    alpha: 0,
    yoyo: true,
  });

  this.input.keyboard.on("keydown-E", () => {
    tween.stop();
    this.bola.setVelocity(0, -150);
    });

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: this.bola,
        duration: 50,
        repeat: 3,
        alpha: 0,
        yoyo: true,
        onComplete: () => {
        },
      });
    });
  }
  generateDron() {
    this.dron1 = new Phaser.Physics.Arcade.Sprite(
      this,
      Phaser.Math.Between(50, this.sys.game.config.width - 50),
      Phaser.Math.Between(40, 120),
      "dron"
    );
    this.physics.add.existing(this.dron1);
    this.dron1.setCollideWorldBounds(true);
    this.add.existing(this.dron1);
    this.dron1.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(50, 150)
    );

    this.physics.add.collider(
      this.bola,
      this.dron1,
      this.boom.bind(this),
      null,
      this
    );
  }
  update() {
    // Verificar si la bola tiene un objeto body
    if (this.bola.body) {
      // Mover el dron1 de manera aleatoria por la mitad superior del contenedor
      this.dron1.x +=
        (this.dron1.body.velocity.x * this.game.loop.delta) / 5000;
      this.dron1.y +=
        (this.dron1.body.velocity.y * this.game.loop.delta) / 5000;

      // Verificar si el dron1 se sale del contenedor y ajustar su posición
      if (this.dron1.x < 50) {
        this.dron1.x = 50;
        this.dron1.body.velocity.x = Phaser.Math.Between(50, 150);
      } else if (this.dron1.x > this.sys.game.config.width - 50) {
        this.dron1.x = this.sys.game.config.width - 50;
        this.dron1.body.velocity.x = Phaser.Math.Between(-150, -50);
      }

      if (this.dron1.y < 40) {
        this.dron1.y = 40;
        this.dron1.body.velocity.y = Phaser.Math.Between(50, 150);
      } else if (this.dron1.y > 120) {
        this.dron1.y = 120;
        this.dron1.body.velocity.y = Phaser.Math.Between(-150, -50);
      }
    }
    // control de defender
    if (this.cursor_D.isDown) {
      this.defender.body.setVelocityX(300);
    } else if (this.cursor_A.isDown) {
      this.defender.body.setVelocityX(-300);
    } else {
      this.defender.body.setVelocityX(0);
    }
  }
}
export default Scene_play;

/*import Defender from "../gameObjects/defender.js";

class Scene_play extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_play" });
    this.bola = null;
    this.dron1 = null;
    this.lastDronUpdateTime = 0;
  }

  create() {
    // Crear el defensor
    this.createDefender();

    // Crear la bola
    this.createBall();

    // Crear los edificios
    this.createBuildings();

    // Crear el dron
    this.createDron();

    // Establecer las colisiones
    this.setCollisions();
  }

  createDefender() {
    this.defender = new Defender(
      this,
      this.sys.game.config.width / 2,
      280,
      "defender"
    );
    this.cursor_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.cursor_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  createBall() {
    this.bola = this.physics.add
      .image(this.sys.game.config.width / 2, 80, "shot")
      .setScale(0.3);
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.bola.setCollideWorldBounds(true);
    this.bola.setBounce(1);
    this.bola.setVelocityY(200);
  }

  createBuildings() {
    const edificioX = [40, 120, 200, 280];
    const edificioY = 360;
    const edificioScale = 2;

    for (let i = 0; i < edificioX.length; i++) {
      const edificio = this.add
        .image(edificioX[i], edificioY, "edificio")
        .setScale(edificioScale);

      this.physics.add.existing(edificio);
      edificio.body.setImmovable(true);

      this.physics.add.collider(
        this.bola,
        edificio,
        this.boomEdificio.bind(this, edificio),
        null,
        this
      );
    }
  }

  createDron() {
    this.dron1 = new Phaser.Physics.Arcade.Sprite(
      this,
      Phaser.Math.Between(50, this.sys.game.config.width - 50),
      Phaser.Math.Between(40, 120),
      "dron"
    );
    this.physics.add.existing(this.dron1);
    this.dron1.setCollideWorldBounds(true);
    this.add.existing(this.dron1);
    this.dron1.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(50, 150)
    );
  }

  setCollisions() {
    this.physics.add.collider(
      this.bola,
      this.dron1,
      this.boom.bind(this),
      null,
      this
    );
    this.physics.add.collider(
      this.bola,
      this.defender,
      this.handleBallBehavior.bind(this),
      null,
      this
    );
  }

  boom(bola, dron1) {
    this.tweens.add({
      targets: [bola, dron1],
      duration: 50,
      repeat: 3,
      alpha: 0,
      yoyo: true,
      onComplete: () => {
        bola.destroy();
        dron1.destroy();
        this.generateDron();
      },
    });
  }

  boomEdificio(edificio) {
    this.tweens.add({
      targets: edificio,
      duration: 200,
      repeat: 3,
      alpha: 0,
      yoyo: true,
      onComplete: () => {
        edificio.destroy();
      },
    });
    this.bola.destroy();
  }

  handleBallBehavior() {
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
      this.holdBall();
    } else {
      this.physics.add.collider(
        this.bola,
        this.defender,
        () => {
          this.bounceBall();
        },
        null,
        this
      );
    }
  }

  bounceBall() {
    const angle = Phaser.Math.Between(30, 150);
    const radians = Phaser.Math.DegToRad(angle);
    const velocityX = Math.cos(radians) * this.bola.body.velocity.x;
    const velocityY = Math.sin(radians) * this.bola.body.velocity.x;
    this.bola.setVelocity(velocityX, -velocityY);
  }

  holdBall() {
    this.bola.x = this.defender.x;
    this.bola.y = this.defender.y;

    const tween = this.tweens.add({
      targets: this.bola,
      duration: 50,
      repeat: -1,
      alpha: 0,
      yoyo: true,
    });

    this.input.keyboard.on("keydown-E", () => {
      tween.stop();
      this.bola.setVelocity(0, -150);
    });

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: this.bola,
        duration: 50,
        repeat: 3,
        alpha: 0,
        yoyo: true,
        onComplete: () => {
          // Aquí puedes agregar más lógica si lo necesitas
        },
      });
    });
  }

  generateDron() {
    this.dron1 = new Phaser.Physics.Arcade.Sprite(
      this,
      Phaser.Math.Between(50, this.sys.game.config.width - 50),
      Phaser.Math.Between(40, 120),
      "dron"
    );
    this.physics.add.existing(this.dron1);
    this.dron1.setCollideWorldBounds(true);
    this.add.existing(this.dron1);
    this.dron1.body.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(50, 150)
    );

    this.physics.add.collider(
      this.bola,
      this.dron1,
      this.boom.bind(this),
      null,
      this
    );
  }

  update(time, delta) {
    this.handleBallBehavior();
    this.handleDronMovement(time, delta);
    this.handleDefenderMovement();
  }

  handleDronMovement(time, delta) {
    // Actualizar la posición del dron cada 5 segundos
    if (time - this.lastDronUpdateTime >= 5000) {
      this.lastDronUpdateTime = time;

      // Mover el dron1 de manera aleatoria por la mitad superior del contenedor
      this.dron1.x += (this.dron1.body.velocity.x * delta) / 5000;
      this.dron1.y += (this.dron1.body.velocity.y * delta) / 5000;

      // Verificar si el dron1 se sale del contenedor y ajustar su posición
      if (this.dron1.x < 50) {
        this.dron1.x = 50;
        this.dron1.body.velocity.x = Phaser.Math.Between(50, 150);
      } else if (this.dron1.x > this.sys.game.config.width - 50) {
        this.dron1.x = this.sys.game.config.width - 50;
        this.dron1.body.velocity.x = Phaser.Math.Between(-150, -50);
      }

      if (this.dron1.y < 40) {
        this.dron1.y = 40;
        this.dron1.body.velocity.y = Phaser.Math.Between(50, 150);
      } else if (this.dron1.y > 120) {
        this.dron1.y = 120;
        this.dron1.body.velocity.y = Phaser.Math.Between(-150, -50);
      }
    }
  }

  handleDefenderMovement() {
    if (this.cursor_D.isDown) {
      this.defender.body.setVelocityX(300);
    } else if (this.cursor_A.isDown) {
      this.defender.body.setVelocityX(-300);
    } else {
      this.defender.body.setVelocityX(0);
    }
  }
}

export default Scene_play;*/