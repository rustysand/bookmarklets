javascript:(function() {
  async function copyImageToClipboard() {
    if (!navigator.clipboard) {
      alert('Clipboard API not supported');
      return;
    }

    try {
      const dataUrl = localStorage.getItem('tableImage');
      if (!dataUrl) {
        alert('No image found in localStorage under \'tableImage\'');
        return;
      }

      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const clipboardItem = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([clipboardItem]);
      alert('PNG image copied to clipboard! Paste into Slack or other apps.');
    } catch (err) {
      alert('Failed to copy: ' + err.message);
    }
  }

  copyImageToClipboard();
})();






javascript:(function(){
    

function saveImage() {
  async function generateTableImage(t, e = {}) {
    const { download = false, saveToStorage = false, useCanvas = false } = e;
    return new Promise((e, r) => {
      try {
        const n = t.cloneNode(true);
        const o = document.createElement("div");
        o.style.position = "absolute";
        o.style.left = "-10000px";
        o.style.top = "0";
        o.style.visibility = "hidden";
        o.style.width = "auto";
        o.style.height = "auto";
        o.appendChild(n);
        document.body.appendChild(o);
        o.offsetHeight; 
        const a = Math.max(n.scrollWidth, n.offsetWidth);
        const i = Math.max(n.scrollHeight, n.offsetHeight);
        if (a === 0 || i === 0) {
          throw Error("Table dimensions could not be computed");
        }
        const l = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        l.setAttribute("width", a);
        l.setAttribute("height", i);
        l.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const s = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        s.setAttribute("width", "100%");
        s.setAttribute("height", "100%");
        s.setAttribute("x", "0");
        s.setAttribute("y", "0");
        s.appendChild(n);
        l.appendChild(s);
        const c = new XMLSerializer().serializeToString(l);
        const d = new Blob([c], { type: "image/svg+xml;charset=utf-8" });
        const u = URL.createObjectURL(d);
        let p = null;
        if (useCanvas) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            p = document.createElement("canvas");
            p.width = a;
            p.height = i;
            const ctx = p.getContext("2d");
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(u);
            g();
            e({ svgBlob: d, svgDataUrl: null, canvas: p });
          };
          img.onerror = (err) => {
            console.warn("Canvas rendering failed (likely taint); using SVG only:", err);
            URL.revokeObjectURL(u);
            g();
            e({ svgBlob: d, svgDataUrl: null, canvas: null });
          };
          img.src = u;
        } else {
          g();
          e({ svgBlob: d, svgDataUrl: u, canvas: null });
        }
        function g() {
          if (document.body.contains(o)) {
            document.body.removeChild(o);
          }
        }
       
        Promise.resolve().then(() => {
          if (download) {
            const a = document.createElement("a");
            a.href = svgDataUrl || (canvas ? canvas.toDataURL("image/png") : "");
            a.download = "table-image.svg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          if (saveToStorage) {
            try {
              localStorage.setItem("tableImage", c);
                console.log("setting storage to...");
                console.log(c);
            } catch (err) {
              alert("Failed to save to localStorage: " + err.message);
            }
          }
          return { svgBlob: d, svgDataUrl: u, canvas: p };
        }).catch(r);
      } catch (err) {
        if (document.body.contains(o)) {
          document.body.removeChild(o);
        }
        r(err);
      }
    });
  }
  const t = document.querySelector(".awsui-table-container table");
  if (!t) {
    return alert("No table found in .awsui-table-container");
  }
  generateTableImage(t, { saveToStorage: true })
    .then(() => {
      alert("Table image saved to localStorage as 'tableImage'");
    })
    .catch(e => alert("Error: " + e.message));
}
saveImage();
})();
