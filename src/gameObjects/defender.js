class defender extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "defender");
        this.setScale(0.8);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.immovable = true;
    }
}

export default defender;