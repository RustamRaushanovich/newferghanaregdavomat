// Renderer Script for Davomat & Telegram Desktop Split View

document.addEventListener('DOMContentLoaded', () => {
    // Window control buttons
    const minBtn = document.getElementById('winMinBtn');
    const maxBtn = document.getElementById('winMaxBtn');
    const closeBtn = document.getElementById('winCloseBtn');

    if (window.electronAPI) {
        if (minBtn) minBtn.addEventListener('click', () => window.electronAPI.minimize());
        if (maxBtn) maxBtn.addEventListener('click', () => window.electronAPI.maximize());
        if (closeBtn) closeBtn.addEventListener('click', () => window.electronAPI.close());
    }

    // Webviews and Panels
    const davomatWebview = document.getElementById('davomatWebview');
    const telegramWebview = document.getElementById('telegramWebview');

    const panelDavomat = document.getElementById('panelDavomat');
    const panelTelegram = document.getElementById('panelTelegram');
    const splitter = document.getElementById('splitterHandle');
    const workspace = document.getElementById('workspaceContainer');

    // Control Buttons
    const btnPresetDefault = document.getElementById('btnPresetDefault');
    const btnPresetDavomat = document.getElementById('btnPresetDavomat');
    const btnPresetTelegram = document.getElementById('btnPresetTelegram');

    const btnReloadAll = document.getElementById('btnReloadAll');
    const reloadDavomatBtn = document.getElementById('reloadDavomatBtn');
    const homeDavomatBtn = document.getElementById('homeDavomatBtn');
    const reloadTgBtn = document.getElementById('reloadTgBtn');
    const switchTgVersionBtn = document.getElementById('switchTgVersionBtn');

    // Layout presets
    function setPreset(preset) {
        btnPresetDefault.classList.remove('active');
        btnPresetDavomat.classList.remove('active');
        btnPresetTelegram.classList.remove('active');

        if (preset === 'default') {
            btnPresetDefault.classList.add('active');
            panelDavomat.style.display = 'flex';
            panelDavomat.style.flex = '75';
            panelTelegram.style.display = 'flex';
            panelTelegram.style.flex = '25';
            splitter.style.display = 'flex';
        } else if (preset === 'davomat') {
            btnPresetDavomat.classList.add('active');
            panelDavomat.style.display = 'flex';
            panelDavomat.style.flex = '100';
            panelTelegram.style.display = 'none';
            splitter.style.display = 'none';
        } else if (preset === 'telegram') {
            btnPresetTelegram.classList.add('active');
            panelDavomat.style.display = 'none';
            panelTelegram.style.display = 'flex';
            panelTelegram.style.flex = '100';
            splitter.style.display = 'none';
        }
    }

    btnPresetDefault.addEventListener('click', () => setPreset('default'));
    btnPresetDavomat.addEventListener('click', () => setPreset('davomat'));
    btnPresetTelegram.addEventListener('click', () => setPreset('telegram'));

    // Reload actions
    btnReloadAll.addEventListener('click', () => {
        if (davomatWebview) davomatWebview.reload();
        if (telegramWebview) telegramWebview.reload();
    });

    if (reloadDavomatBtn) reloadDavomatBtn.addEventListener('click', () => davomatWebview.reload());
    if (homeDavomatBtn) homeDavomatBtn.addEventListener('click', () => davomatWebview.src = 'https://newferghanaregdavomat.vercel.app');
    if (reloadTgBtn) reloadTgBtn.addEventListener('click', () => telegramWebview.reload());

    // Toggle Telegram Web K vs Web A
    let isTgK = true;
    if (switchTgVersionBtn) {
        switchTgVersionBtn.addEventListener('click', () => {
            isTgK = !isTgK;
            telegramWebview.src = isTgK ? 'https://web.telegram.org/k/' : 'https://web.telegram.org/a/';
        });
    }

    // Draggable Resizable Splitter Logic
    let isDragging = false;

    splitter.addEventListener('mousedown', (e) => {
        isDragging = true;
        splitter.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        // Prevent webview overlay from capturing mouse while dragging
        davomatWebview.style.pointerEvents = 'none';
        telegramWebview.style.pointerEvents = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const workspaceWidth = workspace.clientWidth;
        let leftWidth = e.clientX;

        // Enforce minimum width constraints
        if (leftWidth < 300) leftWidth = 300;
        if (workspaceWidth - leftWidth < 260) leftWidth = workspaceWidth - 260;

        const leftPercent = (leftWidth / workspaceWidth) * 100;
        const rightPercent = 100 - leftPercent;

        panelDavomat.style.flex = leftPercent;
        panelTelegram.style.flex = rightPercent;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            splitter.classList.remove('dragging');
            document.body.style.cursor = 'default';
            davomatWebview.style.pointerEvents = 'auto';
            telegramWebview.style.pointerEvents = 'auto';
        }
    });
});
