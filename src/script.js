/* global MathJax, smoothScroll */
smoothScroll.init();

// document.getElementById('bookmarklet').onclick = function(e) {
//     e.preventDefault();
//     alert('Don\'t click me. Drag me to your bookmarks!');
// };

[...document.querySelectorAll('.example')].forEach(function(ex, i) {
    const code = ex.querySelector('pre');
    if (i == 0) {
        code.classList.add('first');
        code.onfocus = function() {
            this.classList.add('first-focus');
        };
    }

    code.contentEditable = 'true';
    code.spellcheck = false;


    const result = document.createElement('div');
    result.className = 'result';
    // ex.insertBefore(result, code);
    ex.appendChild(result);

    result.innerHTML = getResult(code);

    // to remove tags
    code.addEventListener('paste', function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    });

    code.oninput = function() {
        const newMath = getResult(this);
        result.innerHTML = newMath;
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, result]);
    };

});

function getResult(code) {
    return `[math]${code.textContent}[/math]`;
}



// make clickable
var supportsPassive = false;
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true;
        }
    });
    window.addEventListener('test', null, opts);
} catch (e) {}

function makeToC() {
    const toc = document.getElementById('toc');
    let prevHeader = '';
    let breaks = [...document.querySelectorAll('section')].map(function(sec, i) {

        const header = sec.querySelector('h1').textContent;
        const id = sec.id;

        const link = document.createElement('a');
        link.textContent = header;
        link.classList.add('hidden');
        link.setAttribute('data-scroll', '');
        link.href = `#${id}`;

        toc.appendChild(link);

        setTimeout(() => link.classList.remove('hidden'), 100 * i);

        return {
            top: sec.offsetTop,
            header: header,
            ele: link
        };
    }).reverse();

    document.getElementById('loading').style.display = 'none';

    function updateToc() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollTopMid = scrollTop + window.innerHeight / 2;
        const br = breaks.find(function(br) {
            if (br.top < scrollTopMid) {
                return true;
            }
        });

        if (br && br.header != prevHeader) {
            prevHeader = br.header;
            breaks.forEach(x => x.ele.classList.remove('active'));
            br.ele.classList.add('active');
        }
    }

    document.addEventListener(
        'scroll',
        updateToc,
        supportsPassive ? { passive: true } : false
    );
    updateToc();
}

MathJax.Hub.Queue(['Typeset', MathJax.Hub, makeToC]);
