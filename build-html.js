const fs = require('fs');
const contents = fs.readFileSync('content.txt', 'utf8');

function titleCase(string) {
    return string[0].toUpperCase() + string.substr(1);
}

function headerCase(string) {
    return string.split(' ').map(x => ['and', 'of', 'with'].includes(x) ? x : titleCase(x)).join(' ');
}

function anchor(string) {
    return string.trim().toLowerCase().replace(/[\s,]+/g, '-');
}

const lines = contents.split(/\n\n+/).map(line => line.trim());

let tableOfContents = `<a data-scroll href='#introduction'>Introduction</a>`

let examplesHaveStarted = false;
let sectionHasStarted = false;
let parsed = lines.map(function(line, i) {
    console.log('processing', i + 1);
    if (line.startsWith('##')){
        let suffix = '';
        if (examplesHaveStarted) {
            suffix = '</div>';
            examplesHaveStarted = false;
        }
        return suffix + `<h2>${headerCase(line.replace(/^\#\#\s*/, ''))}</h2>`;
    }

    if (line.startsWith('#')){
        let text = line.replace(/^\#\s*/, '');

        let suffix = '';
        if (examplesHaveStarted) {
            suffix += '</div>';
            examplesHaveStarted = false;
        }

        if (sectionHasStarted) {
            suffix += '</section>';
            sectionHasStarted = false;
        }

        suffix += !sectionHasStarted && `<section id='${anchor(text)}'>`;
        sectionHasStarted = true;

        tableOfContents += `<a data-scroll href='#${anchor(text)}'>${headerCase(text)}</a>`

        return suffix + `<h1>${headerCase(text)}</h1>`;
    }

    // title + example block

    let title = line.split('\n')[0];
    let className='';

    if (title.startsWith('!bad')) {
        title = title.replace(/^\!bad\s+/, '');
        className = ' bad';
    }
    title = title.replace(/\.\.\./g, '&hellip;');

    title = title.replace(/`(.*?)`/g, '<code>$1</code>');

    const example = line.split('\n').slice(1).join('\n');

    let suffix = '';
    if (!examplesHaveStarted) {
        suffix = '<div class="examples">';
    }

    examplesHaveStarted = true;
    return suffix +
        `<div class="example${className}">
        <div class=title>${titleCase(title)}</div>
        <pre content-editable=true spellcheck=false>${example}</pre>
        <div class=result>[math]${example}[/math]</div>
    </div>`.split('\n').map(line => line.trim()).join('');
});

if (examplesHaveStarted) {
    parsed.push('</div>');
}

if (sectionHasStarted) {
    parsed.push('</section>');
}

const template = fs.readFileSync('./src/template.html', 'utf8').split(/\n+/).map(x=>x.trim()).join('');
const html = template
    .replace('{{toc}}', tableOfContents)
    .replace('{{content}}', parsed.join(''));

fs.writeFileSync('./dist/index.html', html);
