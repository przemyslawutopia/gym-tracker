const KbToolbar = (() => {
  let bar, currentField, allFields;

  function init() {
    bar = document.createElement('div');
    bar.id = 'kb-toolbar';
    bar.style.display = 'none';
    bar.innerHTML = `
      <button id="kb-done">Done</button>
    `;
    document.body.appendChild(bar);

    document.getElementById('kb-done').addEventListener('mousedown', e => {
      e.preventDefault();
      if (currentField) currentField.blur();
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', reposition);
      window.visualViewport.addEventListener('scroll', reposition);
    }
  }

  function reposition() {
    if (!bar || bar.style.display === 'none') return;
    const vv = window.visualViewport;
    const bottom = window.innerHeight - vv.height - vv.offsetTop;
    bar.style.bottom = bottom + 'px';
  }

  function attach(fields) {
    allFields = fields;
    fields.forEach(inp => {
      inp.addEventListener('focus', () => {
        currentField = inp;
        bar.style.display = 'flex';
        reposition();
      });
      inp.addEventListener('blur', () => {
        // Small delay so mousedown on toolbar fires before blur hides it
        setTimeout(() => {
          if (!allFields.includes(document.activeElement)) {
            bar.style.display = 'none';
          }
        }, 150);
      });
    });
  }

  return { init, attach };
})();
