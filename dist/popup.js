

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {


        /**
         * Insert the page-hiding CSS into the active tab,
         * then get the beast URL and
         * send a "beastify" message to the content script in the active tab.
         */
        function create(tabs) {
            txt_qr = document.getElementById('qr_text');
            console.log(txt_qr.value);
            browser.tabs.sendMessage(tabs[0].id, {
                command: "dispqr",
                qrText: txt_qr.value
            });
            // browser.tabs.insertCSS({code: hidePage}).then(() => {
            //     let url = beastNameToURL(e.target.textContent);
            //     browser.tabs.sendMessage(tabs[0].id, {
            //         command: "beastify",
            //         beastURL: url
            //     });
            // });
        }

        /**
         * Remove the page-hiding CSS from the active tab,
         * send a "reset" message to the content script in the active tab.
         */
        function reset(tabs) {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "reset",
                });
        }

        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

        /**
         * Get the active tab,
         * then call "beastify()" or "reset()" as appropriate.
         */
        if (e.target.classList.contains("create")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(create)
                .catch(reportError);
        }
        else if (e.target.classList.contains("reset")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(reset)
                .catch(reportError);
        }
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute qr content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "main.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);