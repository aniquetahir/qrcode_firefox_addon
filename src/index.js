import _ from 'lodash';
import qrcode from 'qrcode';

var canvas = null;

function component() {
    const element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}


if (window.hasRun){
    console.log('nope');
}else{
    console.log(qrcode);

    let insertQR = async (text)=>{
        if(canvas){
            canvas.parentNode.removeChild(canvas);
        }
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.bottom = '20px';
        canvas.style.left = '20px';

        document.body.appendChild(canvas);
        await qrcode.toCanvas(canvas, text, (err)=>{if(err){console.error(err);}});
        canvas.style.width = '200px';
        canvas.style.height = '200px';
    }
    window.hasRun = true;
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "dispqr") {
            insertQR(message.qrText);
        } else if (message.command === "reset") {
            removeExistingBeasts();
        }
    });
}

//document.body.appendChild(component());
console.log(component)
//document.body.style.border = "5px solid red";