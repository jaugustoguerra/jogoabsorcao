const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let material;
let substancias;
let pontos = 0;
let timer;
let tempoRestante = 30;

function preload() {
    this.load.image('material', 'material.png');
    this.load.image('agua', 'agua.png');
    this.load.image('oleo', 'oleo.png');
    this.load.image('alcool', 'alcool.png');
    this.load.image('areia', 'areia.png');
}

function create() {
    material = this.add.image(400, 300, 'material').setScale(0.2); // Reduzindo a escala
    material.setInteractive({ pixelPerfect: true, alphaTolerance: 1 }); // Área interativa precisa de colisão pixel-perfect

    substancias = [
        { key: 'agua', info: 'Água absorvida. A água é absorvida pelo material poroso.', pontos: 10 },
        { key: 'oleo', info: 'Óleo absorvido. O óleo é absorvido pelo material poroso.', pontos: 20 },
        { key: 'alcool', info: 'Álcool absorvido. O álcool é absorvido pelo material poroso.', pontos: 15 },
        { key: 'areia', info: 'Areia absorvida. A areia é absorvida pelo material poroso.', pontos: -5 }
    ];

    this.tweens.add({
        targets: material,
        scaleX: 0.3, // Reduzindo ainda mais a escala
        scaleY: 0.3,
        ease: 'Linear',
        yoyo: true,
        repeat: -1,
        duration: 1000
    });

    const pontosText = this.add.text(16, 16, 'Pontos: 0', { fontSize: '24px', fill: '#fff' });
    const tempoText = this.add.text(16, 48, 'Tempo: 30s', { fontSize: '24px', fill: '#fff' });

    timer = this.time.addEvent({
        delay: 1000,
        callback: function () {
            tempoRestante--;

            if (tempoRestante === 0) {
                endGame();
            } else {
                tempoText.setText(`Tempo: ${tempoRestante}s`);
            }
        },
        callbackScope: this,
        loop: true
    });

    substancias.forEach((substancia, index) => {
        const xPos = 100 + index * 150;
        const substanciaImage = this.add.image(xPos, 500, substancia.key).setScale(0.1); // Ajuste de escala
        substanciaImage.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });

        this.input.setDraggable(substanciaImage);

        substanciaImage.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff0000);
        });

        substanciaImage.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        substanciaImage.on('dragend', function (pointer, gameObject) {
            gameObject.clearTint();
            const absorbed = absorverSubstancia(material, substancia);
            if (absorbed) {
                pontos += absorbed.pontos;
                pontosText.setText(`Pontos: ${pontos}`);
                showInfo(absorbed.info);
            }
        });
    });
}

function absorverSubstancia(material, substancia) {
    const absorbed = substancias.find(s => substancia.texture.key === s.key);
    if (absorbed) {
        material.setTexture(substancia.texture.key);
    }
    return absorbed;
}

function showInfo(info) {
    const infoElement = document.createElement('div');
    infoElement.textContent = info;
    document.body.appendChild(infoElement);

    setTimeout(() => {
        document.body.removeChild(infoElement);
    }, 3000);
}

function endGame() {
    alert(`Fim do jogo! Pontuação final: ${pontos}`);
    location.reload();
}

function update() {
    // Adicione aqui qualquer lógica de atualização adicional que desejar.
}
