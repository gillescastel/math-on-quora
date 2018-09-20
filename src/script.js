/* global MathJax, smoothScroll */

[...document.querySelectorAll('.example')].forEach(function(ex, i) {
    const code = ex.querySelector('pre');

    if (i == 0) {
        code.classList.add('first');
        code.onfocus = function() {
            this.classList.add('first-focus');
        };
    }

    const result = ex.querySelector('.result');

    // remove tags from pasted content
    code.addEventListener('paste', function(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    });

    code.oninput = function() {
        result.innerHTML = `[math]${this.textContent}[/math]`;
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, result]);
    };
});

MathJax.Hub.Queue(['Typeset', MathJax.Hub]);

const items = [...document.querySelectorAll('#toc a')].map(function(anchor) {
    return {
        anchor,
        target: document.getElementById(anchor.getAttribute('href').slice(1))
    };
});

function debounce(fn, delay) {
    let timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn();
        }, delay);
    };
}

function sync() {
    items.forEach(function(item) {
        const bounds = item.target.getBoundingClientRect();
        const height = window.innerHeight;
        if (bounds.top <= height / 2 && bounds.bottom >= height / 2) {
            item.anchor.classList.add('active');
        } else {
            item.anchor.classList.remove('active');
        }
    });
}

let supportsPassive = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true;
        }
    });
    window.addEventListener('test', null, opts);
} catch (e) {}

document.addEventListener(
    'scroll',
    debounce(sync, 40),
    supportsPassive ? {passive: true} : false
);

sync();

if (window.innerWidth > 900) {
    smoothScroll.init();
}

const toc = document.getElementById('toc');
document.getElementById('toc-toggle').onclick = function() {
    toc.classList.toggle('active');
};

document.querySelectorAll('#toc a').forEach(function(a) {
    a.onclick = function() {
        toc.classList.remove('active');
    };
});
