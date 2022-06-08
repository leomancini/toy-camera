window.onload = function() {
    initialize();
};

window.onresize = () => {
    if (window.innerWidth < 890) {
        cameraSize = window.innerWidth - 80; 
    } else {
        cameraSize = 296;
    }

    window.params = {
        size: cameraSize,
        frameRate: 60
    };

    let canvas = document.querySelector('canvas#camera');
    canvas.width = window.params.size;
    canvas.height = window.params.size;
}

function initialize() {
    window.selectedListItemIndex = 0;
    let cameraSize;

    if (window.innerWidth < 890) {
        cameraSize = window.innerWidth - 80; 
    } else {
        cameraSize = 296;
    }

    window.params = {
        size: cameraSize,
        frameRate: 60
    };

    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: {
                width: window.params.size,
                height: window.params.size,
                audio: false,
                facingMode: 'environment'
            }
        }).then(function(stream) {
            let video = document.querySelector('video');

            video.srcObject = stream;
            video.onloadedmetadata = function() { video.play(); };

            let canvas = document.querySelector('canvas#camera');
            canvas.width = window.params.size;
            canvas.height = window.params.size;

            let context = canvas.getContext('2d');

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            video.addEventListener('play', function() {
                context.drawImage(this, 0, 0, canvas.width, canvas.height);

                drawPixelatedImage(video, canvas, context);
            }, false);
        }).catch(function(error) {
            alert(error);
        });

        let buttons = document.querySelector('#buttons');

        buttons.querySelector('button#down').onclick = (e) => {
            e.preventDefault();
            selectListItem('down');
        }

        buttons.querySelector('button#down').ontouchstart = (e) => {
            e.preventDefault();
            selectListItem('down');
        }
        
        buttons.querySelector('button#up').onclick = (e) => {
            e.preventDefault();
            selectListItem('up');
        }

        buttons.querySelector('button#up').ontouchstart = (e) => {
            e.preventDefault();
            selectListItem('up');
        }
    }
}

document.onkeydown = checkKey;

function selectListItem(direction) {
    let list = document.querySelector('#options ul');
    let listItems = list.querySelectorAll('li');

    listItems.forEach((listItem, listItemIndex) => {
        if (listItem.classList.contains('selected')) {
            window.selectedListItemIndex = listItemIndex;
        }
    });

    if (direction === 'up') {
        listItems[window.selectedListItemIndex].classList.remove('selected');

        if (window.selectedListItemIndex === 0) {
            listItems[listItems.length - 1].classList.add('selected');
        } else {
            listItems[window.selectedListItemIndex - 1].classList.add('selected');
        }
    } else if (direction === 'down') {
        listItems[window.selectedListItemIndex].classList.remove('selected');

        if (window.selectedListItemIndex + 1 >= listItems.length) {
            listItems[0].classList.add('selected');
        } else {
            listItems[window.selectedListItemIndex+1].classList.add('selected');
        }
    }

    listItems.forEach((listItem, listItemIndex) => {
        if (listItem.classList.contains('selected')) {
            window.selectedListItemIndex = listItemIndex;
        }
    });

    document.querySelector('#camera-overlay-0').classList = `type-${window.selectedListItemIndex}`;
    document.querySelector('#camera-overlay-1').classList = `type-${window.selectedListItemIndex}`;
}

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode >= 37 && e.keyCode <= 40) {
        let list = document.querySelector('#options ul');
        let listItems = list.querySelectorAll('li');

        if (e.keyCode == '38') { // Up
            selectListItem('up');
        } else if (e.keyCode == '40') { // Down
            selectListItem('down');
        } else if (e.keyCode == '37') { // Left
        } else if (e.keyCode == '39') { // Right
        }
    }
}

function drawPixelatedImage(video, canvas, context) {
    // Inspired & based on https://nathanwillson.com/blog/posts/conway/
    let defaultResolution = 30;
    let resolution = defaultResolution;

    if (window.selectedListItemIndex) {
        switch (window.selectedListItemIndex) {
            case 0:
                resolution = defaultResolution;
            break;
            case 1:
                resolution = 100;
            break;
            case 2:
                resolution = window.params.size;
            break;
        }
    }

    context.drawImage(video, 0, 0, resolution, resolution);
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.drawImage(canvas, 0, 0, resolution, resolution, 0, 0, canvas.width, canvas.height);

    setTimeout(drawPixelatedImage, window.params.frameRate * 1, video, canvas, context);
}