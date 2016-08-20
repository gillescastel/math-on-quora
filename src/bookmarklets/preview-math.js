var preview = document.createElement('div');
preview.style.position = 'fixed';
preview.style.top = 0;
preview.style.right = 0;
preview.style.zIndex = 1000;
preview.style.background = 'white';
preview.style.padding = '10px';
document.body.appendChild(preview);

function update(e) {
    console.log(e.target);
    preview.innerHTML = '';
    [].slice.call(e.target.querySelectorAll('.span.math')).forEach(function(x){
        var e=document.createElement('div');
        e.textContent = '[math]' + x.textContent + '[/math]';
        preview.appendChild(e);
    });
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, preview]);
}

[].slice.call(document.querySelectorAll('[contenteditable]')).forEach(function(x) {
    x.addEventListener('input', update, false);
});
