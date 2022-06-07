// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

const filter: any = {
    debug: document.querySelector('#filterdebug'),
    notice: document.querySelector('#filternotice'),
    info: document.querySelector('#filterinfo'),
    success: document.querySelector('#filtersuccess'),
    warning: document.querySelector('#filterwarning'),
    error: document.querySelector('#filtererror'),
    emergency: document.querySelector('#filteremergency'),
    alert: document.querySelector('#filteralert'),    
    critical: document.querySelector('#filtercritical'),
};

filter.debug.checked = true;
filter.notice.checked = true
filter.info.checked = true
filter.success.checked = true
filter.warning.checked = true
filter.error.checked = true
filter.emergency.checked = true
filter.alert.checked = true
filter.critical.checked = true