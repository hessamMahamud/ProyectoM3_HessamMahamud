import { setupLinkInterception } from "./utils/navigation.js";
import { router } from "./router.js";

setupLinkInterception();

window.addEventListener("popstate", router);

router();
