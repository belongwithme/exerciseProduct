import { T as sanitize_props, U as spread_props, J as slot, A as push, V as fallback, O as ensure_array_like, M as escape_html, I as attr_class, P as attr, R as bind_props, E as pop, Q as stringify, W as copy_payload, X as assign_payload, N as head } from "../../../chunks/index.js";
import { I as Icon, P as Plus } from "../../../chunks/plus.js";
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
function Chevron_left($$payload, $$props) {
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
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtNi02IDYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-left
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
function Chevron_right($$payload, $$props) {
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
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtOSAxOCA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chevron-right
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
function Pen_line($$payload, $$props) {
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
    ["path", { "d": "M12 20h9" }],
    [
      "path",
      {
        "d": "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "pen-line" },
    $$sanitized_props,
    {
      /**
       * @component @name PenLine
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjBoOSIgLz4KICA8cGF0aCBkPSJNMTYuMzc2IDMuNjIyYTEgMSAwIDAgMSAzLjAwMiAzLjAwMkw3LjM2OCAxOC42MzVhMiAyIDAgMCAxLS44NTUuNTA2bC0yLjg3Mi44MzhhLjUuNSAwIDAgMS0uNjItLjYybC44MzgtMi44NzJhMiAyIDAgMCAxIC41MDYtLjg1NHoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pen-line
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
function CalendarView($$payload, $$props) {
  push();
  let monthlyStats;
  let calendarData = fallback($$props["calendarData"], () => [], true);
  let currentYear = fallback($$props["currentYear"], () => (/* @__PURE__ */ new Date()).getFullYear(), true);
  let currentMonth = fallback($$props["currentMonth"], () => (/* @__PURE__ */ new Date()).getMonth() + 1, true);
  let calendarDays = [];
  let monthName = "";
  const monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ];
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  function generateCalendarDays() {
    const year = currentYear;
    const month = currentMonth - 1;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    const days = [];
    const today = /* @__PURE__ */ new Date();
    const todayString = today.toISOString().split("T")[0];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonthDays - i;
      const fullDate = new Date(year, month - 1, date).toISOString().split("T")[0];
      days.push({
        date,
        fullDate,
        isCurrentMonth: false,
        isToday: false,
        data: calendarData.find((d) => d.date === fullDate)
      });
    }
    const currentMonthDays = lastDay.getDate();
    for (let date = 1; date <= currentMonthDays; date++) {
      const fullDate = new Date(year, month, date).toISOString().split("T")[0];
      days.push({
        date,
        fullDate,
        isCurrentMonth: true,
        isToday: fullDate === todayString,
        data: calendarData.find((d) => d.date === fullDate)
      });
    }
    const remainingDays = 42 - days.length;
    for (let date = 1; date <= remainingDays; date++) {
      const fullDate = new Date(year, month + 1, date).toISOString().split("T")[0];
      days.push({
        date,
        fullDate,
        isCurrentMonth: false,
        isToday: false,
        data: calendarData.find((d) => d.date === fullDate)
      });
    }
    calendarDays = days;
    monthName = monthNames[month];
  }
  function getIntensityLevel(data) {
    if (!data || data.log_count === 0) return 0;
    const duration = data.total_duration_minutes || 0;
    const logCount = data.log_count;
    const intensity = duration / 60 + logCount * 0.5;
    if (intensity >= 3) return 4;
    if (intensity >= 2) return 3;
    if (intensity >= 1) return 2;
    return 1;
  }
  function getStatusEmoji(status) {
    if (!status) return "";
    switch (status) {
      case "状态良好":
        return "🟢";
      case "精力充沛":
        return "⚡";
      case "疲劳":
        return "🟡";
      case "低效率":
        return "🔴";
      case "一般":
        return "🔵";
      default:
        return "⚪";
    }
  }
  function getTooltip(day) {
    if (!day.data || day.data.log_count === 0) {
      return `${day.fullDate} - 无训练记录`;
    }
    const {
      log_count,
      total_duration_minutes,
      status_summary,
      mood_summary
    } = day.data;
    let tooltip = `${day.fullDate}
`;
    tooltip += `训练次数: ${log_count}次
`;
    if (total_duration_minutes) {
      tooltip += `训练时长: ${Math.round(total_duration_minutes / 60 * 10) / 10}小时
`;
    }
    if (status_summary) {
      tooltip += `状态: ${status_summary}
`;
    }
    if (mood_summary) {
      tooltip += `心情: ${mood_summary}`;
    }
    return tooltip.trim();
  }
  function getMonthlyStats() {
    const totalWorkouts = calendarData.reduce((sum, day) => sum + day.log_count, 0);
    const totalDuration = calendarData.reduce((sum, day) => sum + (day.total_duration_minutes || 0), 0);
    const activeDays = calendarData.filter((day) => day.log_count > 0).length;
    return {
      totalWorkouts,
      totalHours: Math.round(totalDuration / 60 * 10) / 10,
      activeDays
    };
  }
  if (currentYear && currentMonth && calendarData) {
    generateCalendarDays();
  }
  monthlyStats = getMonthlyStats();
  const each_array = ensure_array_like(weekDays);
  const each_array_1 = ensure_array_like(calendarDays);
  $$payload.out += `<div class="calendar-container svelte-11kofa0"><div class="calendar-header svelte-11kofa0"><div class="header-left svelte-11kofa0"><h1 class="calendar-title svelte-11kofa0">`;
  Calendar($$payload, { class: "w-7 h-7 text-indigo-600" });
  $$payload.out += `<!----> <div class="title-text svelte-11kofa0"><span class="year svelte-11kofa0">${escape_html(currentYear)}年</span> <span class="month svelte-11kofa0">${escape_html(monthName)}</span></div></h1> <div class="monthly-stats svelte-11kofa0"><div class="stat-item svelte-11kofa0">`;
  Activity($$payload, { class: "w-4 h-4 text-blue-500" });
  $$payload.out += `<!----> <span class="svelte-11kofa0">${escape_html(monthlyStats.totalWorkouts)}次训练</span></div> <div class="stat-item svelte-11kofa0">`;
  Clock($$payload, { class: "w-4 h-4 text-green-500" });
  $$payload.out += `<!----> <span class="svelte-11kofa0">${escape_html(monthlyStats.totalHours)}小时</span></div> <div class="stat-item svelte-11kofa0">`;
  Calendar($$payload, { class: "w-4 h-4 text-purple-500" });
  $$payload.out += `<!----> <span class="svelte-11kofa0">${escape_html(monthlyStats.activeDays)}活跃天</span></div></div></div> <div class="header-controls svelte-11kofa0"><div class="nav-buttons svelte-11kofa0"><button class="nav-btn svelte-11kofa0" aria-label="上个月">`;
  Chevron_left($$payload, { class: "w-5 h-5" });
  $$payload.out += `<!----></button> <button class="today-btn svelte-11kofa0">今天</button> <button class="nav-btn svelte-11kofa0" aria-label="下个月">`;
  Chevron_right($$payload, { class: "w-5 h-5" });
  $$payload.out += `<!----></button></div></div></div> <div class="weekdays-header svelte-11kofa0"><!--[-->`;
  for (let index = 0, $$length = each_array.length; index < $$length; index++) {
    let weekDay = each_array[index];
    $$payload.out += `<div${attr_class("weekday-cell svelte-11kofa0", void 0, { "weekend": index === 0 || index === 6 })}>${escape_html(weekDay)}</div>`;
  }
  $$payload.out += `<!--]--></div> <div class="calendar-grid svelte-11kofa0"><!--[-->`;
  for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
    let day = each_array_1[index];
    const intensityLevel = getIntensityLevel(day.data);
    const isWeekend = index % 7 === 0 || index % 7 === 6;
    $$payload.out += `<button${attr_class("calendar-day svelte-11kofa0", void 0, {
      "current-month": day.isCurrentMonth,
      "other-month": !day.isCurrentMonth,
      "today": day.isToday,
      "weekend": isWeekend && day.isCurrentMonth,
      "has-workout": day.data && day.data.log_count > 0,
      "intensity-1": intensityLevel === 1,
      "intensity-2": intensityLevel === 2,
      "intensity-3": intensityLevel === 3,
      "intensity-4": intensityLevel === 4
    })}${attr("title", getTooltip(day))}${attr("disabled", !day.isCurrentMonth, true)}><span class="day-number svelte-11kofa0">${escape_html(day.date)}</span> `;
    if (day.data && day.data.log_count > 0) {
      $$payload.out += "<!--[-->";
      const each_array_2 = ensure_array_like(Array(Math.min(day.data.log_count, 4)));
      $$payload.out += `<div class="workout-indicators svelte-11kofa0">`;
      if (day.data.status_summary) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="status-emoji svelte-11kofa0">${escape_html(getStatusEmoji(day.data.status_summary))}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="workout-dots svelte-11kofa0"><!--[-->`;
      for (let i = 0, $$length2 = each_array_2.length; i < $$length2; i++) {
        each_array_2[i];
        $$payload.out += `<div class="workout-dot svelte-11kofa0"></div>`;
      }
      $$payload.out += `<!--]--> `;
      if (day.data.log_count > 4) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="more-indicator svelte-11kofa0">+</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (day.data.total_duration_minutes && day.data.total_duration_minutes >= 60) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="duration-badge svelte-11kofa0">${escape_html(Math.round(day.data.total_duration_minutes / 60))}h</div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (day.isToday) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="today-marker svelte-11kofa0"></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></button>`;
  }
  $$payload.out += `<!--]--></div> <div class="calendar-legend svelte-11kofa0"><div class="legend-section svelte-11kofa0"><h4 class="svelte-11kofa0">训练强度</h4> <div class="intensity-legend svelte-11kofa0"><div class="legend-item svelte-11kofa0"><div class="legend-box intensity-1 svelte-11kofa0"></div> <span class="svelte-11kofa0">轻度</span></div> <div class="legend-item svelte-11kofa0"><div class="legend-box intensity-2 svelte-11kofa0"></div> <span class="svelte-11kofa0">中度</span></div> <div class="legend-item svelte-11kofa0"><div class="legend-box intensity-3 svelte-11kofa0"></div> <span class="svelte-11kofa0">高度</span></div> <div class="legend-item svelte-11kofa0"><div class="legend-box intensity-4 svelte-11kofa0"></div> <span class="svelte-11kofa0">极高</span></div></div></div> <div class="legend-section svelte-11kofa0"><h4 class="svelte-11kofa0">状态说明</h4> <div class="status-legend svelte-11kofa0"><span class="status-item svelte-11kofa0">🟢 状态良好</span> <span class="status-item svelte-11kofa0">⚡ 精力充沛</span> <span class="status-item svelte-11kofa0">🟡 疲劳</span> <span class="status-item svelte-11kofa0">🔴 低效率</span> <span class="status-item svelte-11kofa0">🔵 一般</span></div></div></div></div>`;
  bind_props($$props, { calendarData, currentYear, currentMonth });
  pop();
}
function DayDetailModal($$payload, $$props) {
  push();
  let dateStatus, hasWorkouts;
  let isOpen = fallback($$props["isOpen"], false);
  let selectedDate = fallback($$props["selectedDate"], "");
  let calendarData = fallback($$props["calendarData"], null);
  let workoutLogs = fallback($$props["workoutLogs"], () => [], true);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const months = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月"
    ];
    return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate().toString().padStart(2, "0")}日 ${weekDays[date.getDay()]}`;
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
        return {
          color: "text-green-700",
          bg: "bg-green-100",
          border: "border-green-300",
          emoji: "🟢"
        };
      case "精力充沛":
        return {
          color: "text-amber-700",
          bg: "bg-amber-100",
          border: "border-amber-300",
          emoji: "⚡"
        };
      case "疲劳":
        return {
          color: "text-yellow-700",
          bg: "bg-yellow-100",
          border: "border-yellow-300",
          emoji: "🟡"
        };
      case "低效率":
        return {
          color: "text-red-700",
          bg: "bg-red-100",
          border: "border-red-300",
          emoji: "🔴"
        };
      case "一般":
        return {
          color: "text-blue-700",
          bg: "bg-blue-100",
          border: "border-blue-300",
          emoji: "🔵"
        };
      default:
        return {
          color: "text-gray-700",
          bg: "bg-gray-100",
          border: "border-gray-300",
          emoji: "⚪"
        };
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
  function getTotalVolume(sets) {
    return sets.reduce(
      (total, set) => {
        return total + set.reps * (set.weight_kg || 0);
      },
      0
    );
  }
  function getDateStatus(dateString) {
    const date = new Date(dateString);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date < today) return "past";
    if (date > today) return "future";
    return "today";
  }
  dateStatus = getDateStatus(selectedDate);
  hasWorkouts = calendarData && calendarData.log_count > 0;
  if (isOpen) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="modal-backdrop svelte-1800zdt" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-content svelte-1800zdt"><div class="modal-header svelte-1800zdt"><div class="header-info svelte-1800zdt"><div class="date-info svelte-1800zdt">`;
    Calendar($$payload, { class: "w-6 h-6 text-indigo-600" });
    $$payload.out += `<!----> <div><h2 id="modal-title" class="modal-title svelte-1800zdt">${escape_html(formatDate(selectedDate))}</h2> <p class="date-subtitle svelte-1800zdt">`;
    if (dateStatus === "today") {
      $$payload.out += "<!--[-->";
      $$payload.out += `今天`;
    } else if (dateStatus === "future") {
      $$payload.out += "<!--[1-->";
      $$payload.out += `未来日期`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `${escape_html(Math.floor(((/* @__PURE__ */ new Date()).getTime() - new Date(selectedDate).getTime()) / (1e3 * 60 * 60 * 24)))}天前`;
    }
    $$payload.out += `<!--]--></p></div></div></div> <button class="close-btn svelte-1800zdt" aria-label="关闭">`;
    X($$payload, { class: "w-5 h-5" });
    $$payload.out += `<!----></button></div> <div class="modal-body svelte-1800zdt">`;
    if (hasWorkouts) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(workoutLogs);
      $$payload.out += `<div class="overview-card svelte-1800zdt"><h3 class="section-title svelte-1800zdt">`;
      Activity($$payload, { class: "w-5 h-5 text-indigo-600" });
      $$payload.out += `<!----> 训练概览</h3> <div class="stats-grid svelte-1800zdt"><div class="stat-card svelte-1800zdt"><div class="stat-icon bg-blue-100 svelte-1800zdt">`;
      Activity($$payload, { class: "w-5 h-5 text-blue-600" });
      $$payload.out += `<!----></div> <div class="stat-content svelte-1800zdt"><div class="stat-value svelte-1800zdt">${escape_html(calendarData?.log_count || 0)}</div> <div class="stat-label svelte-1800zdt">训练次数</div></div></div> `;
      if (calendarData?.total_duration_minutes) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="stat-card svelte-1800zdt"><div class="stat-icon bg-green-100 svelte-1800zdt">`;
        Clock($$payload, { class: "w-5 h-5 text-green-600" });
        $$payload.out += `<!----></div> <div class="stat-content svelte-1800zdt"><div class="stat-value svelte-1800zdt">${escape_html(formatDuration(calendarData.total_duration_minutes))}</div> <div class="stat-label svelte-1800zdt">总时长</div></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (calendarData?.status_summary) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="stat-card svelte-1800zdt"><div class="stat-icon bg-purple-100 svelte-1800zdt">`;
        Heart($$payload, { class: "w-5 h-5 text-purple-600" });
        $$payload.out += `<!----></div> <div class="stat-content svelte-1800zdt"><div${attr_class(`status-badge ${stringify(getStatusStyle(calendarData.status_summary).bg)} ${stringify(getStatusStyle(calendarData.status_summary).border)}`, "svelte-1800zdt")}><span class="status-emoji svelte-1800zdt">${escape_html(getStatusStyle(calendarData.status_summary).emoji)}</span> <span${attr_class(getStatusStyle(calendarData.status_summary).color, "svelte-1800zdt")}>${escape_html(calendarData.status_summary)}</span></div> <div class="stat-label svelte-1800zdt">主要状态</div></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (calendarData?.mood_summary) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mood-section svelte-1800zdt">`;
        Message_circle($$payload, { class: "w-4 h-4 text-orange-600" });
        $$payload.out += `<!----> <span class="mood-text svelte-1800zdt">心情: ${escape_html(calendarData.mood_summary)}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="workouts-section svelte-1800zdt"><h3 class="section-title svelte-1800zdt">`;
      Pen_line($$payload, { class: "w-5 h-5 text-green-600" });
      $$payload.out += `<!----> 训练详情</h3> <div class="workouts-list svelte-1800zdt"><!--[-->`;
      for (let index = 0, $$length = each_array.length; index < $$length; index++) {
        let log = each_array[index];
        $$payload.out += `<div class="workout-card svelte-1800zdt"><div class="workout-header svelte-1800zdt"><div class="workout-info svelte-1800zdt"><span class="workout-number svelte-1800zdt">训练 #${escape_html(index + 1)}</span> `;
        if (log.duration_minutes) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="duration-chip svelte-1800zdt">`;
          Clock($$payload, { class: "w-3 h-3" });
          $$payload.out += `<!----> <span>${escape_html(formatDuration(log.duration_minutes))}</span></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div> <button class="edit-btn svelte-1800zdt">`;
        Pen_line($$payload, { class: "w-4 h-4" });
        $$payload.out += `<!----> 编辑</button></div> `;
        if (log.status || log.mood) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="workout-meta svelte-1800zdt">`;
          if (log.status) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<span${attr_class(`status-chip ${stringify(getStatusStyle(log.status).bg)} ${stringify(getStatusStyle(log.status).border)}`, "svelte-1800zdt")}><span${attr_class(getStatusStyle(log.status).color, "svelte-1800zdt")}>${escape_html(getStatusStyle(log.status).emoji)} ${escape_html(log.status)}</span></span>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--> `;
          if (log.mood) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<span class="mood-chip svelte-1800zdt">💭 ${escape_html(log.mood)}</span>`;
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
          const groupedSets = groupSetsByExercise(log.logged_sets);
          const each_array_1 = ensure_array_like(Object.entries(groupedSets));
          $$payload.out += `<div class="exercises-summary svelte-1800zdt"><div class="exercises-header svelte-1800zdt"><span class="exercises-count svelte-1800zdt">${escape_html(Object.keys(groupedSets).length)} 个动作</span> <span class="sets-count svelte-1800zdt">${escape_html(log.logged_sets.length)} 组</span></div> <div class="exercises-list svelte-1800zdt"><!--[-->`;
          for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
            let [exerciseName, sets] = each_array_1[$$index_1];
            const totalVolume = getTotalVolume(sets);
            const each_array_2 = ensure_array_like(sets.slice(0, 3));
            $$payload.out += `<div class="exercise-item svelte-1800zdt"><div class="exercise-header svelte-1800zdt"><span class="exercise-name svelte-1800zdt">${escape_html(exerciseName)}</span> <span class="exercise-stats svelte-1800zdt">${escape_html(sets.length)}组 `;
            if (totalVolume > 0) {
              $$payload.out += "<!--[-->";
              $$payload.out += `· ${escape_html(totalVolume)}kg`;
            } else {
              $$payload.out += "<!--[!-->";
            }
            $$payload.out += `<!--]--></span></div> <div class="sets-preview svelte-1800zdt"><!--[-->`;
            for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
              let set = each_array_2[$$index];
              $$payload.out += `<span class="set-chip svelte-1800zdt">${escape_html(set.reps)}×${escape_html(set.weight_kg || 0)}kg</span>`;
            }
            $$payload.out += `<!--]--> `;
            if (sets.length > 3) {
              $$payload.out += "<!--[-->";
              $$payload.out += `<span class="more-sets svelte-1800zdt">+${escape_html(sets.length - 3)}</span>`;
            } else {
              $$payload.out += "<!--[!-->";
            }
            $$payload.out += `<!--]--></div></div>`;
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
      $$payload.out += `<div class="empty-state svelte-1800zdt"><div class="empty-icon svelte-1800zdt">`;
      Activity($$payload, { class: "w-12 h-12 text-gray-400" });
      $$payload.out += `<!----></div> <h3 class="empty-title svelte-1800zdt">这一天还没有训练记录</h3> <p class="empty-description svelte-1800zdt">`;
      if (dateStatus === "future") {
        $$payload.out += "<!--[-->";
        $$payload.out += `这是未来的日期，快来制定训练计划吧！`;
      } else if (dateStatus === "today") {
        $$payload.out += "<!--[1-->";
        $$payload.out += `今天还没有训练，现在开始还不晚！`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `这一天没有训练记录，创建一个回忆吧`;
      }
      $$payload.out += `<!--]--></p></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="modal-footer svelte-1800zdt">`;
    if (hasWorkouts) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="secondary-btn svelte-1800zdt">关闭</button> <button class="primary-btn svelte-1800zdt">`;
      Plus($$payload, { class: "w-4 h-4" });
      $$payload.out += `<!----> 添加训练</button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<button class="secondary-btn svelte-1800zdt">关闭</button> <button class="primary-btn svelte-1800zdt"${attr("disabled", dateStatus === "future", true)}>`;
      Plus($$payload, { class: "w-4 h-4" });
      $$payload.out += `<!----> `;
      if (dateStatus === "future") {
        $$payload.out += "<!--[-->";
        $$payload.out += `暂不可用`;
      } else if (dateStatus === "today") {
        $$payload.out += "<!--[1-->";
        $$payload.out += `开始训练`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `添加记录`;
      }
      $$payload.out += `<!--]--></button>`;
    }
    $$payload.out += `<!--]--></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { isOpen, selectedDate, calendarData, workoutLogs });
  pop();
}
function _page($$payload, $$props) {
  push();
  let calendarData = [];
  let currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  let currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
  let isModalOpen = false;
  let selectedDate = "";
  let selectedDayData = null;
  let selectedDayLogs = [];
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>训练日历 - 健身追踪应用</title>`;
      $$payload3.out += `<meta name="description" content="查看您的训练日历，追踪训练进度和连续训练天数" class="svelte-1b05x8n"/>`;
    });
    $$payload2.out += `<div class="calendar-page svelte-1b05x8n"><div class="page-header svelte-1b05x8n"><div class="header-content svelte-1b05x8n"><h1 class="page-title svelte-1b05x8n">训练日历</h1> <p class="page-subtitle svelte-1b05x8n">追踪您的训练进度，养成健康的运动习惯</p></div> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="calendar-wrapper svelte-1b05x8n">`;
      CalendarView($$payload2, { calendarData, currentYear, currentMonth });
      $$payload2.out += `<!----></div>`;
    }
    $$payload2.out += `<!--]--> <div class="tips-section svelte-1b05x8n"><h2 class="tips-title svelte-1b05x8n">使用提示</h2> <div class="tips-grid svelte-1b05x8n"><div class="tip-card svelte-1b05x8n"><div class="tip-icon svelte-1b05x8n">📅</div> <h3 class="tip-title svelte-1b05x8n">点击日期</h3> <p class="tip-description svelte-1b05x8n">点击任意日期查看详细的训练记录和状态</p></div> <div class="tip-card svelte-1b05x8n"><div class="tip-icon svelte-1b05x8n">🎯</div> <h3 class="tip-title svelte-1b05x8n">训练强度</h3> <p class="tip-description svelte-1b05x8n">颜色深浅表示训练强度，越深表示训练越充实</p></div> <div class="tip-card svelte-1b05x8n"><div class="tip-icon svelte-1b05x8n">🔥</div> <h3 class="tip-title svelte-1b05x8n">保持连续</h3> <p class="tip-description svelte-1b05x8n">坚持连续训练，培养健康的运动习惯</p></div> <div class="tip-card svelte-1b05x8n"><div class="tip-icon svelte-1b05x8n">📊</div> <h3 class="tip-title svelte-1b05x8n">数据统计</h3> <p class="tip-description svelte-1b05x8n">查看月度训练统计，了解自己的运动表现</p></div></div></div></div> `;
    DayDetailModal($$payload2, {
      selectedDate,
      calendarData: selectedDayData,
      workoutLogs: selectedDayLogs,
      get isOpen() {
        return isModalOpen;
      },
      set isOpen($$value) {
        isModalOpen = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
