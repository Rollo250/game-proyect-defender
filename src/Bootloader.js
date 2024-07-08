class Bootloader extends Phaser.Scene {
    constructor() {
        super({key: "Bootloader"});
    }
    preload() {
        this.load.on("complete", () => {
            this.scene.start("Scene_play");
        });

        this.load.image("defender", "./assets/defender.png");
        this.load.image("shot", "./assets/bola.png");
        this.load.image("edificio", "./assets/edificio.png");
        this.load.image("dron", "./assets/enemigo.png");
    }
}

export default Bootloader;