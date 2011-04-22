==Node.js Proxy for GDK3 HTML5 Backend (broadway)==

The GDK3 codebase includes a new HTML5 backend for GDK.  This provisionally allows running of GTK applications in the browser via serverside rendering, an HTML5 canvas and websockets.  This proxy can fire up child broadway processes for each connection as well as some modification to the client code to support fallbacks when websockets are not available (e.g. FF4 RTW and IE9).
