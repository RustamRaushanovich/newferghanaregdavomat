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

    // --- Versioning and Update Checking ---
    const CURRENT_VERSION = 'RTR v01.00';
    const appVersionBadge = document.getElementById('appVersionBadge');
    if (appVersionBadge) appVersionBadge.textContent = CURRENT_VERSION;

    const updateModal = document.getElementById('updateModal');
    const updateVersionText = document.getElementById('updateVersionText');
    const updateChangelog = document.getElementById('updateChangelog');
    const btnDownloadUpdate = document.getElementById('btnDownloadUpdate');
    const btnCloseUpdateModal = document.getElementById('btnCloseUpdateModal');

    if (btnCloseUpdateModal) {
        btnCloseUpdateModal.addEventListener('click', () => {
            if (updateModal) updateModal.style.display = 'none';
        });
    }

    async function checkAppVersion() {
        try {
            const res = await fetch('https://newferghanaregdavomat.vercel.app/api/desktop/version', {
                cache: 'no-store'
            });
            if (!res.ok) return;
            const data = await res.json();
            
            const serverVersion = data.latest_version || 'RTR v01.00';
            if (serverVersion !== CURRENT_VERSION && updateModal) {
                if (updateVersionText) updateVersionText.textContent = `Yangi Versiya: ${serverVersion}`;
                if (updateChangelog) updateChangelog.textContent = data.changelog || '• Tizim barqarorligi oshirildi.';
                
                if (btnDownloadUpdate) {
                    btnDownloadUpdate.onclick = () => {
                        const targetUrl = data.download_url || 'https://newferghanaregdavomat.vercel.app/download/Ferghana_Davomat_Setup.exe';
                        if (window.electronAPI && window.electronAPI.openExternal) {
                            window.electronAPI.openExternal(targetUrl);
                        } else {
                            window.open(targetUrl, '_blank');
                        }
                    };
                }
                updateModal.style.display = 'flex';
            }
        } catch (e) {
            console.log("Version check skipped:", e.message);
        }
    }

    // --- Splash Intro Animation Handler ---
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 600);
        }, 2200);
    }

    // --- Keyboard Shortcuts (F5, F11, Ctrl+Tab) ---
    let currentPresetIdx = 0;
    const presetsList = ['default', 'davomat', 'telegram'];

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F5') {
            e.preventDefault();
            if (davomatWebview) davomatWebview.reload();
            if (telegramWebview) telegramWebview.reload();
        } else if (e.key === 'F11') {
            e.preventDefault();
            if (window.electronAPI && window.electronAPI.maximize) {
                window.electronAPI.maximize();
            }
        } else if (e.ctrlKey && e.key === 'Tab') {
            e.preventDefault();
            currentPresetIdx = (currentPresetIdx + 1) % presetsList.length;
            setPreset(presetsList[currentPresetIdx]);
        }
    });

    // --- Device Registration and Heartbeat Ping System ---
    let deviceId = localStorage.getItem('desktop_device_id');
    if (!deviceId) {
        deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('desktop_device_id', deviceId);
    }

    const btnRegisterDevice = document.getElementById('btnRegisterDevice');
    const regBtnText = document.getElementById('regBtnText');
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const btnCloseRegModal = document.getElementById('btnCloseRegModal');

    const regName = document.getElementById('regName');
    const regDistrict = document.getElementById('regDistrict');
    const regSchool = document.getElementById('regSchool');
    const regPhone = document.getElementById('regPhone');

    // Populate registration form if saved locally
    const savedRegData = JSON.parse(localStorage.getItem('desktop_reg_data') || '{}');
    if (savedRegData.name) {
        if (regName) regName.value = savedRegData.name;
        if (regDistrict) regDistrict.value = savedRegData.district;
        if (regSchool) regSchool.value = savedRegData.school;
        if (regPhone) regPhone.value = savedRegData.phone;
        if (regBtnText) regBtnText.textContent = savedRegData.name;
    }

    if (btnRegisterDevice) {
        btnRegisterDevice.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'flex';
        });
    }

    if (btnCloseRegModal) {
        btnCloseRegModal.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'none';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                device_id: deviceId,
                name: regName ? regName.value : '',
                district: regDistrict ? regDistrict.value : '',
                school: regSchool ? regSchool.value : '',
                phone: regPhone ? regPhone.value : '',
                app_version: CURRENT_VERSION
            };

            try {
                const res = await fetch('https://newferghanaregdavomat.vercel.app/api/desktop/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const resp = await res.json();
                if (res.ok) {
                    localStorage.setItem('desktop_reg_data', JSON.stringify(data));
                    if (regBtnText) regBtnText.textContent = data.name;
                    if (registerModal) registerModal.style.display = 'none';
                    showBanner('<i class="fas fa-check-circle"></i> Dastur ro\'yxatdan o\'tdi! Web Admin panelda ONLINE ko\'rindi.', true);
                } else {
                    alert(resp.error || 'Ro\'yxatdan o\'tishda xatolik');
                }
            } catch (err) {
                alert('Server bilan bog\'lanishda xatolik: ' + err.message);
            }
        });
    }

    // Live Heartbeat Ping to Server (Pings every 15s)
    const emergencyAlertModal = document.getElementById('emergencyAlertModal');
    const emergencyAlertText = document.getElementById('emergencyAlertText');
    const btnCloseEmergencyBtn = document.getElementById('btnCloseEmergencyBtn');

    if (btnCloseEmergencyBtn) {
        btnCloseEmergencyBtn.addEventListener('click', () => {
            if (emergencyAlertModal) emergencyAlertModal.style.display = 'none';
        });
    }

    let lastSeenAlertId = null;

    async function sendDevicePing() {
        if (!navigator.onLine) return;
        try {
            const savedData = JSON.parse(localStorage.getItem('desktop_reg_data') || '{}');
            const res = await fetch('https://newferghanaregdavomat.vercel.app/api/desktop/ping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    device_id: deviceId,
                    app_version: CURRENT_VERSION,
                    ...savedData
                })
            });
            if (!res.ok) return;
            const data = await res.json();

            // Emergency alert handler
            if (data.emergency_alert && data.emergency_alert.id !== lastSeenAlertId) {
                lastSeenAlertId = data.emergency_alert.id;
                if (emergencyAlertText) emergencyAlertText.innerHTML = data.emergency_alert.message;
                if (emergencyAlertModal) emergencyAlertModal.style.display = 'flex';
            }
        } catch (e) {}
    }

    setInterval(sendDevicePing, 15000);
    sendDevicePing();
});


