class Dron1 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "dron");
        this.setScale(1.1);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.immovable = true;
    }
}
export default Dron1;