// Renderer Script for Davomat & Telegram Desktop Split View & Network Monitoring

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

    // Network Status Elements
    const netIndicator = document.getElementById('netIndicator');
    const netStatusBanner = document.getElementById('netStatusBanner');
    const netStatusText = document.getElementById('netStatusText');
    const offlineOverlay = document.getElementById('offlineOverlay');
    const btnRetryNet = document.getElementById('btnRetryNet');

    let isOnline = navigator.onLine;

    function showBanner(msg, isOnlineStatus) {
        if (!netStatusBanner || !netStatusText) return;
        netStatusText.innerHTML = msg;
        netStatusBanner.className = 'net-status-banner ' + (isOnlineStatus ? 'net-online' : 'net-offline');
        netStatusBanner.style.display = 'block';
        setTimeout(() => {
            if (isOnlineStatus) netStatusBanner.style.display = 'none';
        }, 4000);
    }

    function updateNetworkStatus(onlineState) {
        isOnline = onlineState;

        if (onlineState) {
            if (netIndicator) {
                netIndicator.className = 'net-indicator net-ind-online';
                netIndicator.innerHTML = '<i class="fas fa-signal"></i> Online';
            }
            if (offlineOverlay) offlineOverlay.style.display = 'none';

            showBanner('<i class="fas fa-wifi"></i> Internetga ulandi! Ma\'lumotlar yuborilmoqda...', true);

            // Auto reload & resync webviews when internet comes back
            try {
                if (davomatWebview) davomatWebview.reload();
                if (telegramWebview) telegramWebview.reload();
            } catch(e){}
        } else {
            if (netIndicator) {
                netIndicator.className = 'net-indicator net-ind-offline';
                netIndicator.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline (Internet Yo\'q)';
            }
            if (offlineOverlay) offlineOverlay.style.display = 'flex';

            showBanner('<i class="fas fa-exclamation-triangle"></i> Internet uzildi! Iltimos, internetga ulaning.', false);
        }
    }

    // Ping test for robust connection check
    async function checkInternetConnection() {
        try {
            const res = await fetch('https://newferghanaregdavomat.vercel.app/api/health', {
                method: 'HEAD',
                cache: 'no-store'
            });
            if (res.ok || res.status < 500) {
                if (!isOnline) updateNetworkStatus(true);
            } else {
                if (isOnline) updateNetworkStatus(false);
            }
        } catch (e) {
            if (navigator.onLine === false) {
                if (isOnline) updateNetworkStatus(false);
            }
        }
    }

    window.addEventListener('online', () => updateNetworkStatus(true));
    window.addEventListener('offline', () => updateNetworkStatus(false));

    if (btnRetryNet) {
        btnRetryNet.addEventListener('click', () => {
            btnRetryNet.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tekshirilmoqda...';
            checkInternetConnection().finally(() => {
                setTimeout(() => {
                    btnRetryNet.innerHTML = '<i class="fas fa-sync-alt"></i> Qayta Tekshirish';
                }, 800);
            });
        });
    }

    // Periodically check internet connection every 10 seconds
    setInterval(checkInternetConnection, 10000);

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
        davomatWebview.style.pointerEvents = 'none';
        telegramWebview.style.pointerEvents = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const workspaceWidth = workspace.clientWidth;
        let leftWidth = e.clientX;

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

    // Initial check
    updateNetworkStatus(navigator.onLine);
});
