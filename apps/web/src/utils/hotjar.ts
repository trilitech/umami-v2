import Hotjar from "@hotjar/browser";

import { HOTJAR_SITE_ID } from "../env";

const hotjarVersion = 6;

Hotjar.init(HOTJAR_SITE_ID, hotjarVersion);
