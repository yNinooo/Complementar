
const body = document.querySelector('body');
const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, li, blockquote, code, pre, input, button, label, select, option, textarea');
const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const logo = document.getElementById('logo');
const navbarFontSelector = document.getElementById('navbar-family__selector');
const navbarFontSelectorOptions = document.getElementById('font-family__selector');
const themeSelector = document.getElementById('switch__value'); 
const lightMoonIcon = document.getElementById('light-mode-moon');
const darkMoonIcon = document.getElementById('dark-mode-moon');

const searchBar = document.getElementById('search__bar');
const emptyText = document.getElementById('empty__text');

const wordInfo = document.getElementById('word-info');
const wordHeadingText = document.getElementById('word__heading');
const wordPhoneticText = document.getElementById('phonetic');
const wordAudioButton = document.getElementById('word__audio');

const wordDefinition = document.getElementById('word-definitions');

const wordNotFound = document.getElementById('word-not-found');

let currentWordData = {};

navbarFontSelector.addEventListener('click', function() {
    navbarFontSelectorOptions.classList.toggle('hidden');
})

const handleFontChange = (fontFamily) => {
    console.log(fontFamily);
    if (fontFamily === 'Inter') {
        navbarFontSelector.innerHTML = "Sans Serif";
        let downArrowImage = document.createElement('img');
        downArrowImage.src = './assets/images/icon-arrow-down.svg';
        downArrowImage.alt = 'Arrow Down';
        navbarFontSelector.appendChild(downArrowImage);
        for (const element of textElements) {
            element.style.fontFamily = 'Inter, sans-serif';
        }
    } else if (fontFamily === 'Lora') {
        navbarFontSelector.innerHTML = "Serif";
        let downArrowImage = document.createElement('img');
        downArrowImage.src = './assets/images/icon-arrow-down.svg';
        downArrowImage.alt = 'Arrow Down';
        navbarFontSelector.appendChild(downArrowImage);
        for (const element of textElements) {
            element.style.fontFamily = 'Lora, serif';
        }
    }
    else if (fontFamily === 'Inconsolata') {
        navbarFontSelector.innerHTML = "Monospace";
        let downArrowImage = document.createElement('img');
        downArrowImage.src = './assets/images/icon-arrow-down.svg';
        downArrowImage.alt = 'Arrow Down';
        navbarFontSelector.appendChild(downArrowImage);
        for (const element of textElements) {
            element.style.fontFamily = 'Inconsolata, monospace';
        }
    }

    navbarFontSelectorOptions.classList.toggle('hidden');
}

const changeColorTheme = theme => {
    switch(theme) {
        case 'dark': {
        
            document.documentElement.style.colorScheme = 'dark';
            body.style.backgroundColor = '#050505';
            localStorage.setItem('theme', 'dark');
 
            lightMoonIcon.classList.add('hidden');
            darkMoonIcon.classList.remove('hidden');
 
            searchBar.style.backgroundColor = '#1F1F1F';
            
            themeSelector.checked = true;

        
            let sourceURL = document.querySelector('.source a');
            sourceURL.style.color = '#FFFFFF';
            break;
        };
        case 'light': {
          
            document.documentElement.style.colorScheme = 'light';
            body.style.backgroundColor = '#FFFFFF';
            localStorage.setItem('theme', 'light');
           
            lightMoonIcon.classList.remove('hidden');
            darkMoonIcon.classList.add('hidden');
  
            searchBar.style.backgroundColor = '#F4F4F4';

    
            let sourceURL = document.querySelector('.source a');
            sourceURL.style.color = '#2D2D2D';
            break;
        };
    }

}

themeSelector.addEventListener('change', function() {
    if (themeSelector.checked) {
        changeColorTheme('dark')
    } else {
        changeColorTheme('light')
    }
});

const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (searchBar.value === '') {
        handleEmptySearch();
        return;
    }

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + searchBar.value)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let wordData = () => {
            phoneticsArray = data[0].phonetics;
            for (const phonetic of phoneticsArray) {
                if (phonetic.text && phonetic.audio) {
                    return {
                        word: data[0].word,
                        phonetic: phonetic.text,
                        audio: phonetic.audio,
                        meaning: data[0].meanings,
                        sourceURLs: data[0].sourceUrls
                    }
                }
            }
        }

        currentWordData = wordData();
    
        handleWordInfo();
    })
    .catch(error => {
        wordInfo.classList.add('hidden');
        wordDefinition.classList.add('hidden');
        wordNotFound.classList.remove('hidden');
    });
});

searchBar.addEventListener('search', function(event) {
    if (searchBar.value === '') {
        handleEmptySearch();
        return;
    }

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + searchBar.value)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let wordData = () => {
            phoneticsArray = data[0].phonetics;
            for (const phonetic of phoneticsArray) {
                if (phonetic.text && phonetic.audio) {
                    return {
                        word: data[0].word,
                        phonetic: phonetic.text,
                        audio: phonetic.audio,
                        meaning: data[0].meanings,
                        sourceURLs: data[0].sourceUrls
                    }
                }
            }
        }

        currentWordData = wordData();
    
        handleWordInfo();
    })
    .catch(error => {
        wordInfo.classList.add('hidden');
        wordDefinition.classList.add('hidden');
        wordNotFound.classList.remove('hidden');
    });
});


searchBar.addEventListener('input', () => {
    searchBar.classList.remove('search__bar--empty');
    emptyText.classList.add('hidden');
})

const handleEmptySearch = () => {
    searchBar.classList.add('search__bar--empty');
    searchBar.value = '';
    emptyText.classList.remove('hidden');
}

const handleWordInfo = () => {
    wordHeadingText.innerText = currentWordData.word;
    wordPhoneticText.innerText = currentWordData.phonetic;

    if (currentWordData.audio) {
        wordAudioButton.href = currentWordData.audio;
        wordAudioButton.classList.remove('hidden');
    } else {
        wordAudioButton.classList.add('hidden');
    }

    wordDefinition.innerHTML = '';

    for (const meaning of currentWordData.meaning) {

        let currentWordMeaning = document.createElement('div');
        currentWordMeaning.classList.add('word-meaning');
        wordDefinition.appendChild(currentWordMeaning);


        let wordMeaningInfo = document.createElement('div');
        wordMeaningInfo.classList.add('word-meaning-info');
        currentWordMeaning.appendChild(wordMeaningInfo);

   
        let wordPartOfSpeech = document.createElement('h2');
        wordPartOfSpeech.classList.add('partOfSpeech');
        wordPartOfSpeech.innerText = meaning.partOfSpeech;
        wordMeaningInfo.appendChild(wordPartOfSpeech);

    
        let horizontalBar = document.createElement('div');
        horizontalBar.classList.add('horizontalBar');
        wordMeaningInfo.appendChild(horizontalBar);

 
        let wordMeaning = document.createElement('div');
        wordMeaning.classList.add('meaning');
        currentWordMeaning.appendChild(wordMeaning);

    
        let meaningHeading = document.createElement('h3');
        meaningHeading.innerText = 'Meaning';
        wordMeaning.appendChild(meaningHeading);

  
        let meaningList = document.createElement('ul');
        wordMeaning.appendChild(meaningList);

        for (const definition of meaning.definitions) {
            let meaningListItem = document.createElement('li');
            meaningListItem.classList.add('definition')
            meaningListItem.innerText = definition.definition;
            meaningList.appendChild(meaningListItem);

            if (definition.example) {
                meaningListItem.appendChild(document.createElement('br'));
                let meaningExample = document.createElement('span');
                meaningExample.classList.add('example');
                meaningExample.innerText = '"' + definition.example + '"';
                meaningListItem.appendChild(meaningExample);
            }
        }


        if (meaning.synonyms.length > 0) {

      
            let synonymsHeading = document.createElement('h4');
            synonymsHeading.innerText = 'Synonyms: ';
            synonymsHeading.classList.add("synonyms");
            wordMeaning.appendChild(synonymsHeading);

      
            for (const synonym of meaning.synonyms) {
                let synonymSpan = document.createElement('span');
                synonymSpan.innerText = synonym;
                synonymSpan.classList.add('synonym');
                synonymsHeading.appendChild(synonymSpan);

                synonymSpan.addEventListener('click', () => {
                    searchBar.value = synonymSpan.innerText;
                    searchBar.dispatchEvent(new Event('search'));
                })

        
                if (meaning.synonyms.indexOf(synonym) !== meaning.synonyms.length - 1) {
                    synonymsHeading.appendChild(document.createTextNode(', '));
                }
            }
        }

        wordInfo.classList.remove('hidden');
        wordDefinition.classList.remove('hidden');
        wordNotFound.classList.add('hidden');
    }

    let horizontalBar = document.createElement('div');
    horizontalBar.classList.add('horizontalBar');
    wordDefinition.appendChild(horizontalBar);

    if (currentWordData.sourceURLs) {
        let sourceText = document.createElement('p');
        sourceText.innerText = 'Source: ';
        sourceText.classList.add('source');
        wordDefinition.appendChild(sourceText);

        let sourceURL = document.createElement('a');
        sourceURL.href = currentWordData.sourceURLs[0];
        sourceURL.innerText = currentWordData.sourceURLs[0];
        sourceURL.target = '_blank';
        sourceURL.rel = 'noopener noreferrer';
        sourceText.appendChild(sourceURL);

        if (!themeSelector.checked) {
            sourceURL.style.color = '#2D2D2D';
        }

        let newWindow = document.createElement('img');
        newWindow.src = './assets/images/icon-new-window.svg';
        newWindow.alt = 'New Window';
        newWindow.classList.add('newWindow');
        sourceURL.appendChild(newWindow);
    }
}

wordAudioButton.addEventListener('click', () => {
    const audio = new Audio(wordAudioButton.href);
    audio.play();
});

const setUpFontFamily = () => {
    const navbarFontSelector = document.getElementById('font-family__selector');
    
    const fontFamily = localStorage.getItem('font-family');

    if (fontFamily === 'sans-serif') {
        navbarFontSelector.value = 'sans-serif';
        for (const element of textElements) {
            element.style.fontFamily = 'Inter, sans-serif';
        }
        navbarFontSelector.style.fontFamily = 'Inter';
        navbarFontSelector.style.paddingRight = '1.875rem';
    } else if (fontFamily === 'serif') {
        navbarFontSelector.value = 'serif';
        for (const element of textElements) {
            element.style.fontFamily = 'Lora, serif';
        }
        navbarFontSelector.style.fontFamily = 'Lora';
        navbarFontSelector.style.paddingRight = '0.07rem';
    } else if (fontFamily === 'monospace') {
        navbarFontSelector.value = 'monospace';
        for (const element of textElements) {
            element.style.fontFamily = 'Inconsolata, monospace';
        }
        navbarFontSelector.style.fontFamily = 'Inconsolata';
        navbarFontSelector.style.paddingRight = '2.75rem';
    }
}

const setUpTheme = () => {
    const themeSelector = document.getElementById('switch__value');
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
        themeSelector.checked = true;
        changeColorTheme('dark');
    } else {
        themeSelector.checked = false;
        changeColorTheme('light');
    }
}

const setUpPrefersColorScheme = () => {
    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersColorScheme) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }

    setUpTheme();
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('font-family') !== null) setTimeout(setUpFontFamily, 100); // Delay of 100ms to ensure fonts are loaded
    if (localStorage.getItem('theme') !== null) setUpTheme();

    if (localStorage.getItem('theme') === null) {
        if (prefersDarkColorScheme()) {
            changeColorTheme('dark');
            return;
        }
        changeColorTheme('light');
    }

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/keyboard')
    .then(response => response.json())
    .then(data => {
        let wordData = () => {
            phoneticsArray = data[0].phonetics;
            for (const phonetic of phoneticsArray) {
                if (phonetic.text && phonetic.audio) {
                    return {
                        word: data[0].word,
                        phonetic: phonetic.text,
                        audio: phonetic.audio,
                        meaning: data[0].meanings,
                        sourceURLs: data[0].sourceUrls
                    }
                }
            }
        }

        currentWordData = wordData();
    
        handleWordInfo();
    })
});
