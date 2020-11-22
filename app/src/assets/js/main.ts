
function onFocus(e) {
    const parent = e.target.closest('.field');
    parent.classList.remove('fl-placeholder-state');
    parent.classList.add('fl-label-state');
}

function onBlur(e) {
    const parent = e.target.closest('.field');
    parent.classList.add('fl-placeholder-state');
    parent.classList.remove('fl-label-state');
}

export function addInputListeners() {
    document.querySelectorAll('input[type=text]').forEach((input) => {
        input.addEventListener('focus', onFocus);
        input.addEventListener('blur', onBlur);
    });
};

export function removeInputListeners() {
    document.querySelectorAll('input[type=text').forEach((input) => {
        input.removeEventListener('focus', onFocus);
        input.removeEventListener('blur', onBlur);
    });
};
