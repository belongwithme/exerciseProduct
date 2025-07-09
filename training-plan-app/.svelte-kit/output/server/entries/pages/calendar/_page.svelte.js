import { T as sanitize_props, U as spread_props, J as slot, V as fallback, M as escape_html, O as ensure_array_like, I as attr_class, Q as stringify, R as bind_props, E as pop, A as push, G as store_get, N as head, K as unsubscribe_stores } from "../../../chunks/index.js";
import { g as goto } from "../../../chunks/client.js";
import { u as user } from "../../../chunks/auth.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Activity($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "activity" },
    $$sanitized_props,
    {
      /**
       * @component @name Activity
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTJoLTIuNDhhMiAyIDAgMCAwLTEuOTMgMS40NmwtMi4zNSA4LjM2YS4yNS4yNSAwIDAgMS0uNDggMEw5LjI0IDIuMThhLjI1LjI1IDAgMCAwLS40OCAwbC0yLjM1IDguMzZBMiAyIDAgMCAxIDQuNDkgMTJIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/activity
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Calendar($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "M3 10h18" }]
  ];
  Icon($$payload, spread_props([
    { name: "calendar" },
    $$sanitized_props,
    {
      /**
       * @component @name Calendar
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/calendar
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Clock($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M12 6v6l4 2" }],
    ["circle", { "cx": "12", "cy": "12", "r": "10" }]
  ];
  Icon($$payload, spread_props([
    { name: "clock" },
    $$sanitized_props,
    {
      /**
       * @component @name Clock
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNnY2bDQgMiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/clock
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Flame($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "flame" },
    $$sanitized_props,
    {
      /**
       * @component @name Flame
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOC41IDE0LjVBMi41IDIuNSAwIDAgMCAxMSAxMmMwLTEuMzgtLjUtMi0xLTMtMS4wNzItMi4xNDMtLjIyNC00LjA1NCAyLTYgLjUgMi41IDIgNC45IDQgNi41IDIgMS42IDMgMy41IDMgNS41YTcgNyAwIDEgMS0xNCAwYzAtMS4xNTMuNDMzLTIuMjk0IDEtM2EyLjUgMi41IDAgMCAwIDIuNSAyLjV6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/flame
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Heart($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "heart" },
    $$sanitized_props,
    {
      /**
       * @component @name Heart
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMTRjMS40OS0xLjQ2IDMtMy4yMSAzLTUuNUE1LjUgNS41IDAgMCAwIDE2LjUgM2MtMS43NiAwLTMgLjUtNC41IDItMS41LTEuNS0yLjc0LTItNC41LTJBNS41IDUuNSAwIDAgMCAyIDguNWMwIDIuMyAxLjUgNC4wNSAzIDUuNWw3IDdaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/heart
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Message_circle($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [["path", { "d": "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }]];
  Icon($$payload, spread_props([
    { name: "message-circle" },
    $$sanitized_props,
    {
      /**
       * @component @name MessageCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNy45IDIwQTkgOSAwIDEgMCA0IDE2LjFMMiAyMloiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/message-circle
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Trending_up($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M16 7h6v6" }],
    ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]
  ];
  Icon($$payload, spread_props([
    { name: "trending-up" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgN2g2djYiIC8+CiAgPHBhdGggZD0ibTIyIDctOC41IDguNS01LTVMMiAxNyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/trending-up
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Triangle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "triangle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name TriangleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEuNzMgMTgtOC0xNGEyIDIgMCAwIDAtMy40OCAwbC04IDE0QTIgMiAwIDAgMCA0IDIxaDE2YTIgMiAwIDAgMCAxLjczLTMiIC8+CiAgPHBhdGggZD0iTTEyIDl2NCIgLz4KICA8cGF0aCBkPSJNMTIgMTdoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/triangle-alert
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function X($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  Icon($$payload, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Zap($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.525.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "zap" },
    $$sanitized_props,
    {
      /**
       * @component @name Zap
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxNGExIDEgMCAwIDEtLjc4LTEuNjNsOS45LTEwLjJhLjUuNSAwIDAgMSAuODYuNDZsLTEuOTIgNi4wMkExIDEgMCAwIDAgMTMgMTBoN2ExIDEgMCAwIDEgLjc4IDEuNjNsLTkuOSAxMC4yYS41LjUgMCAwIDEtLjg2LS40NmwxLjkyLTYuMDJBMSAxIDAgMCAwIDExIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/zap
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function DayDetailModal($$payload, $$props) {
  push();
  let isOpen = fallback($$props["isOpen"], false);
  let selectedDate = fallback($$props["selectedDate"], "");
  let calendarData = fallback($$props["calendarData"], null);
  let workoutLogs = fallback($$props["workoutLogs"], () => [], true);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, "0")}月${date.getDate().toString().padStart(2, "0")}日 ${weekDays[date.getDay()]}`;
  }
  function formatDuration(minutes) {
    if (!minutes) return "未记录";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  }
  function getStatusStyle(status) {
    switch (status) {
      case "状态良好":
      case "精力充沛":
        return { color: "text-green-600", bg: "bg-green-100", emoji: "🟢" };
      case "疲劳":
        return { color: "text-yellow-600", bg: "bg-yellow-100", emoji: "🟡" };
      case "低效率":
        return { color: "text-red-600", bg: "bg-red-100", emoji: "🔴" };
      case "一般":
        return { color: "text-blue-600", bg: "bg-blue-100", emoji: "🔵" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", emoji: "⚪" };
    }
  }
  function groupSetsByExercise(sets) {
    return sets.reduce(
      (acc, set) => {
        if (!acc[set.exercise_name]) {
          acc[set.exercise_name] = [];
        }
        acc[set.exercise_name].push(set);
        return acc;
      },
      {}
    );
  }
  if (isOpen) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="modal-backdrop svelte-1m2g2l0" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-content svelte-1m2g2l0"><div class="modal-header svelte-1m2g2l0"><h2 id="modal-title" class="modal-title svelte-1m2g2l0">`;
    Activity($$payload, { class: "w-6 h-6 mr-2 text-blue-600" });
    $$payload.out += `<!----> ${escape_html(formatDate(selectedDate))}</h2> <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700" aria-label="关闭">`;
    X($$payload, { class: "w-5 h-5" });
    $$payload.out += `<!----></button></div> <div class="modal-body svelte-1m2g2l0">`;
    if (calendarData && calendarData.log_count > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(workoutLogs);
      $$payload.out += `<div class="day-summary svelte-1m2g2l0"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div class="stat-item svelte-1m2g2l0">`;
      Activity($$payload, { class: "w-5 h-5 text-blue-600" });
      $$payload.out += `<!----> <div><div class="stat-value svelte-1m2g2l0">${escape_html(calendarData.log_count)}</div> <div class="stat-label svelte-1m2g2l0">训练次数</div></div></div> `;
      if (calendarData.total_duration_minutes) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="stat-item svelte-1m2g2l0">`;
        Clock($$payload, { class: "w-5 h-5 text-green-600" });
        $$payload.out += `<!----> <div><div class="stat-value svelte-1m2g2l0">${escape_html(formatDuration(calendarData.total_duration_minutes))}</div> <div class="stat-label svelte-1m2g2l0">总时长</div></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (calendarData.status_summary) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="stat-item svelte-1m2g2l0">`;
        Heart($$payload, { class: "w-5 h-5 text-purple-600" });
        $$payload.out += `<!----> <div><div${attr_class(`stat-value status-badge ${stringify(getStatusStyle(calendarData.status_summary).bg)}`, "svelte-1m2g2l0")}><span class="status-emoji svelte-1m2g2l0">${escape_html(getStatusStyle(calendarData.status_summary).emoji)}</span> ${escape_html(calendarData.status_summary)}</div> <div class="stat-label svelte-1m2g2l0">主要状态</div></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (calendarData.mood_summary) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mood-summary svelte-1m2g2l0">`;
        Message_circle($$payload, { class: "w-4 h-4 text-orange-600" });
        $$payload.out += `<!----> <span class="mood-text svelte-1m2g2l0">心情: ${escape_html(calendarData.mood_summary)}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="workout-logs-section svelte-1m2g2l0"><h3 class="section-title svelte-1m2g2l0">训练详情</h3> <div class="workout-logs-list svelte-1m2g2l0"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let log = each_array[$$index_1];
        $$payload.out += `<div class="workout-log-item svelte-1m2g2l0"><div class="log-header svelte-1m2g2l0"><div class="log-time svelte-1m2g2l0">`;
        if (log.duration_minutes) {
          $$payload.out += "<!--[-->";
          Clock($$payload, { class: "w-4 h-4 text-gray-500" });
          $$payload.out += `<!----> <span>${escape_html(formatDuration(log.duration_minutes))}</span>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div> <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">编辑</button></div> `;
        if (log.status || log.mood) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="log-meta svelte-1m2g2l0">`;
          if (log.status) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<span${attr_class(`status-badge ${stringify(getStatusStyle(log.status).bg)} ${stringify(getStatusStyle(log.status).color)}`, "svelte-1m2g2l0")}>${escape_html(getStatusStyle(log.status).emoji)} ${escape_html(log.status)}</span>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--> `;
          if (log.mood) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<span class="mood-badge svelte-1m2g2l0">💭 ${escape_html(log.mood)}</span>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> `;
        if (log.logged_sets && log.logged_sets.length > 0) {
          $$payload.out += "<!--[-->";
          const each_array_1 = ensure_array_like(Object.entries(groupSetsByExercise(log.logged_sets)));
          $$payload.out += `<div class="exercise-summary svelte-1m2g2l0"><div class="exercise-count svelte-1m2g2l0">共 ${escape_html(new Set(log.logged_sets.map((s) => s.exercise_name)).size)} 个动作，
												${escape_html(log.logged_sets.length)} 组</div> <div class="exercise-list svelte-1m2g2l0"><!--[-->`;
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let [exerciseName, sets] = each_array_1[$$index];
            $$payload.out += `<div class="exercise-item svelte-1m2g2l0"><span class="exercise-name svelte-1m2g2l0">${escape_html(exerciseName)}</span> <span class="exercise-sets svelte-1m2g2l0">${escape_html(sets.length)}组 × ${escape_html(sets[0]?.reps || "?")}次 `;
            if (sets[0]?.weight_kg) {
              $$payload.out += "<!--[-->";
              $$payload.out += `@ ${escape_html(sets[0].weight_kg)}kg`;
            } else {
              $$payload.out += "<!--[!-->";
            }
            $$payload.out += `<!--]--></span></div>`;
          }
          $$payload.out += `<!--]--></div></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="no-data svelte-1m2g2l0"><div class="no-data-icon svelte-1m2g2l0">📊</div> <h3 class="no-data-title svelte-1m2g2l0">这一天还没有训练记录</h3> <p class="no-data-description svelte-1m2g2l0">点击下方按钮开始记录今天的训练</p></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="modal-footer svelte-1m2g2l0"><button class="create-log-button svelte-1m2g2l0">${escape_html(calendarData?.log_count ? "添加新训练" : "开始记录训练")}</button> <button class="cancel-button svelte-1m2g2l0">关闭</button></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { isOpen, selectedDate, calendarData, workoutLogs });
  pop();
}
function StreakNotification($$payload, $$props) {
  push();
  let config, randomEncouragement;
  let streakDays = fallback($$props["streakDays"], 0);
  let lastWorkoutDate = fallback($$props["lastWorkoutDate"], null);
  let showNotification = fallback($$props["showNotification"], true);
  let notificationType = null;
  let daysSinceLastWorkout = 0;
  let isVisible = false;
  function calculateDaysSinceLastWorkout() {
    if (!lastWorkoutDate) return 999;
    const today = /* @__PURE__ */ new Date();
    const lastDate = new Date(lastWorkoutDate);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
    return diffDays;
  }
  function determineNotificationType() {
    daysSinceLastWorkout = calculateDaysSinceLastWorkout();
    if (streakDays === 0 && daysSinceLastWorkout >= 2) {
      notificationType = "streak_broken";
    } else if (streakDays > 0 && daysSinceLastWorkout === 1) {
      notificationType = "at_risk";
    } else if (streakDays >= 1 && streakDays <= 6) {
      notificationType = "good_streak";
    } else if (streakDays >= 7) {
      notificationType = "long_streak";
    } else {
      notificationType = null;
    }
    isVisible = showNotification && notificationType !== null;
  }
  function getNotificationConfig() {
    switch (notificationType) {
      case "streak_broken":
        return {
          type: "warning",
          icon: Triangle_alert,
          title: "连续打卡已中断",
          message: `已经${daysSinceLastWorkout}天没有训练了，重新开始永远不晚！`,
          encouragement: ["每一次重新开始都是一个新的机会 💪", "小步前进胜过原地踏步 🚀", "今天就是重新开始的最佳时机！"],
          actionText: "开始训练",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-800",
          iconColor: "text-orange-600"
        };
      case "at_risk":
        return {
          type: "alert",
          icon: Zap,
          title: "连续记录面临中断",
          message: `您已经连续训练${streakDays}天，昨天没有训练可能会中断连续记录！`,
          encouragement: ["坚持了这么久，不要轻易放弃 🔥", "今天训练一下，保持连续记录", "习惯的力量就是持续的小行动"],
          actionText: "继续打卡",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600"
        };
      case "good_streak":
        return {
          type: "success",
          icon: Trending_up,
          title: "连续训练进行中",
          message: `太棒了！您已经连续训练${streakDays}天，习惯正在养成中！`,
          encouragement: ["持续的努力正在带来改变 🌟", "每一天的坚持都值得赞赏", "继续保持这个美好的节奏！"],
          actionText: "查看进度",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          iconColor: "text-green-600"
        };
      case "long_streak":
        return {
          type: "celebration",
          icon: Heart,
          title: "连续训练成就",
          message: `令人佩服！您已经连续训练${streakDays}天，这是真正的毅力体现！`,
          encouragement: ["您的坚持令人敬佩！🎉", "这样的毅力一定会带来惊人的成果", "您已经证明了自己的决心和毅力"],
          actionText: "分享成就",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-800",
          iconColor: "text-purple-600"
        };
      default:
        return null;
    }
  }
  function getRandomEncouragement(encouragements) {
    const randomIndex = Math.floor(Math.random() * encouragements.length);
    return encouragements[randomIndex];
  }
  {
    if (showNotification) {
      determineNotificationType();
    }
  }
  config = getNotificationConfig();
  randomEncouragement = config ? getRandomEncouragement(config.encouragement) : "";
  if (isVisible && config) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr_class(`notification-card ${stringify(config.bgColor)} ${stringify(config.borderColor)} ${stringify(config.textColor)}`, "svelte-1f9q3us")} role="alert"><div class="notification-header svelte-1f9q3us"><div class="flex items-center"><!---->`;
    config.icon?.($$payload, { class: `notification-icon ${stringify(config.iconColor)}` });
    $$payload.out += `<!----> <h3 class="notification-title svelte-1f9q3us">${escape_html(config.title)}</h3></div> <button class="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors" aria-label="关闭通知"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> <div class="notification-content svelte-1f9q3us"><p class="notification-message svelte-1f9q3us">${escape_html(config.message)}</p> <div class="encouragement-section svelte-1f9q3us"><div class="encouragement-text svelte-1f9q3us">${escape_html(randomEncouragement)}</div></div> `;
    if (notificationType === "good_streak" || notificationType === "long_streak") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="stats-section svelte-1f9q3us"><div class="stat-item svelte-1f9q3us">`;
      Calendar($$payload, { class: `w-4 h-4 ${stringify(config.iconColor)}` });
      $$payload.out += `<!----> <span>连续 ${escape_html(streakDays)} 天</span></div> `;
      if (daysSinceLastWorkout === 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="stat-item svelte-1f9q3us">`;
        Zap($$payload, { class: "w-4 h-4 text-green-600" });
        $$payload.out += `<!----> <span>今日已完成</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="action-section svelte-1f9q3us"><button${attr_class(`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${stringify(config.type)}`, "svelte-1f9q3us")}>${escape_html(config.actionText)}</button> `;
    if (notificationType === "streak_broken" || notificationType === "at_risk") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="secondary-button svelte-1f9q3us">设置提醒</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { streakDays, lastWorkoutDate, showNotification });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let monthlyStats;
  (/* @__PURE__ */ new Date()).getFullYear();
  (/* @__PURE__ */ new Date()).getMonth() + 1;
  let calendarData = [];
  let streakDays = 0;
  let showDayDetail = false;
  let selectedDate = "";
  let selectedDayData = null;
  let selectedDayLogs = [];
  let lastWorkoutDate = null;
  let showStreakNotification = true;
  function getMonthlyStats() {
    const totalWorkouts = calendarData.reduce((sum, day) => sum + day.log_count, 0);
    const totalDuration = calendarData.reduce((sum, day) => sum + (day.total_duration_minutes || 0), 0);
    const activeDays = calendarData.filter((day) => day.log_count > 0).length;
    return {
      totalWorkouts,
      totalDuration: Math.round(totalDuration / 60 * 10) / 10,
      // 转换为小时并保留一位小数
      activeDays,
      averagePerDay: activeDays > 0 ? Math.round(totalWorkouts / activeDays * 10) / 10 : 0
    };
  }
  if (store_get($$store_subs ??= {}, "$user", user) === null) {
    goto();
  }
  monthlyStats = getMonthlyStats();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>训练日历 - 训练计划系统</title>`;
    $$payload2.out += `<meta name="description" content="查看训练打卡日历，追踪训练习惯和进度"/>`;
  });
  $$payload.out += `<div class="min-h-screen bg-gray-50 py-8"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-8"><h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">`;
  Calendar($$payload, { class: "w-8 h-8 mr-3 text-blue-600" });
  $$payload.out += `<!----> 训练日历</h1> <p class="text-gray-600">追踪您的训练打卡记录，养成良好的训练习惯</p></div> `;
  StreakNotification($$payload, {
    streakDays,
    lastWorkoutDate,
    showNotification: showStreakNotification
  });
  $$payload.out += `<!----> <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">连续打卡</p> <p class="text-2xl font-bold text-orange-600">${escape_html(streakDays)}</p> <p class="text-xs text-gray-500">天</p></div> `;
  Flame($$payload, { class: "w-8 h-8 text-orange-500" });
  $$payload.out += `<!----></div></div> <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">本月训练</p> <p class="text-2xl font-bold text-blue-600">${escape_html(monthlyStats.totalWorkouts)}</p> <p class="text-xs text-gray-500">次</p></div> `;
  Trending_up($$payload, { class: "w-8 h-8 text-blue-500" });
  $$payload.out += `<!----></div></div> <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">训练时长</p> <p class="text-2xl font-bold text-green-600">${escape_html(monthlyStats.totalDuration)}</p> <p class="text-xs text-gray-500">小时</p></div> `;
  Calendar($$payload, { class: "w-8 h-8 text-green-500" });
  $$payload.out += `<!----></div></div> <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-600">活跃天数</p> <p class="text-2xl font-bold text-purple-600">${escape_html(monthlyStats.activeDays)}</p> <p class="text-xs text-gray-500">天</p></div> <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><span class="text-purple-600 font-bold">📅</span></div></div></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-20"><div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div> <span class="ml-4 text-xl text-gray-600">正在加载日历数据...</span></div>`;
  }
  $$payload.out += `<!--]--> <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"><h3 class="text-lg font-semibold text-blue-800 mb-3">📖 使用说明</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700"><div><p class="mb-2"><strong>颜色说明：</strong></p> <ul class="space-y-1"><li>• 绿色深浅代表训练强度</li> <li>• 圆点表示状态（🟢良好 🟡疲劳 🔴低效）</li> <li>• 小点数量表示训练次数</li></ul></div> <div><p class="mb-2"><strong>操作说明：</strong></p> <ul class="space-y-1"><li>• 点击日期查看详细记录</li> <li>• 点击"今天"快速回到当前月</li> <li>• 连续训练可获得打卡天数</li></ul></div></div></div> <div class="mt-8 text-center"><button class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">← 返回首页</button></div></div></div> `;
  DayDetailModal($$payload, {
    isOpen: showDayDetail,
    selectedDate,
    calendarData: selectedDayData,
    workoutLogs: selectedDayLogs
  });
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
