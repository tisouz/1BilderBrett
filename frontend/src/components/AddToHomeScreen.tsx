import React from "react";
import { instance } from '../axios-content';
import { browserName, isDesktop, isMobile } from "react-device-detect";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import notify from "./utilities/ToastHandler";

interface Props {}

interface State {
  visible: boolean;
  notifyMessage: string;
}

class AddToHomeScreen extends React.Component<Props, State> {
  deferredPrompt: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      notifyMessage: "",
    };
  }

  //Show prompt
  onInstall() {
    if (this.deferredPrompt) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // hide button
      this.setState({ visible: false });
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then(() => {
        //Clear prompt
        this.deferredPrompt = null;
      });
    }
  }

  //Show informations about install
  getInstallInfos() {
    //Only prompt once per session and if app is not launched in standalone mode
    if (!localStorage.getItem("browserInfos") && !this.isInstalled()) {
      localStorage.setItem("browserInfos", "installPrompted");
      let msg;
      //prompt exist. User can install app using the download button
      if (browserName === "Chrome" || browserName === "Edge") {
        msg = `You can install the PWA app from the "Download" button in the top right corner. Make sure you are not in incognito mode.`;
        //Display instructions for Safari
      } else if (browserName === "Safari") {
        msg = `
        Please follow these instructions to install the application
        1.  Clear browser cache
        2.  Reload PWA Page ${instance.defaults.baseURL}
        3.  Tap the Share button
        4.  Tap "Add To Homescreen" option
        5.  Install application
        `;
      }
      //Display instructions for Firefox on Android
      else if (browserName === "Firefox" && isMobile) {
        msg = `
        Please follow these instructions to install the application
        1.  Clear browser cache
        2.  Reload PWA Page ${instance.defaults.baseURL}
        3.  Tap the menu button (three dots on top right)
        4.  Tap "Add To Homescreen" option
        5.  Install application
        `;
      }
      //Notify user that app can not be installed for Firefox on Desktop
      else if (browserName === "Firefox" && isDesktop) {
        msg = `
        Installation of PWA on Firefox Desktop not supported.`;
      }
      //Notify user that other browsers are not tested
      else {
        msg =
          "Installation of PWA App on this browser not tested. Please verify support on CanIUse (https://caniuse.com/?search=beforeinstallprompt)";
      }
      notify(msg, "info");
    }
  }

  //Check if app was launched in standalone mode
  isInstalled() {
    //cast navigator as any to pass missing TypeScript typing
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      //Hide download button
      this.setState({ visible: false });
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    //listen and save installation prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      //stash event
      this.deferredPrompt = e;
      //Show download button
      this.setState({ visible: true });
    });
    this.getInstallInfos();
  }

  render() {
    return (
      <>
        <>
          {this.state.visible && (
            <span className="navbar-item">
              <button
                className="button is-primary is-inverted"
                onClick={() => this.onInstall()}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faDownload} />
                </span>
                <span>Download</span>
              </button>
            </span>
          )}
        </>
      </>
    );
  }
}

export default AddToHomeScreen;
