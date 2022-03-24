(function () {
  
  const XHR = XMLHttpRequest.prototype
  
  const open = XHR.open
  const send = XHR.send
  const setRequestHeader = XHR.setRequestHeader
  
  XHR.open = function (method, url) {
    this._method = method
    this._url = url
    this._requestHeaders = {}
    this._startTime = (new Date()).toISOString()
    
    return open.apply(this, arguments)
  }
  
  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value
    return setRequestHeader.apply(this, arguments)
  }
  
  XHR.send = function (postData) {
    
    this.addEventListener('load', function () {
      // const endTime = (new Date()).toISOString()
  
      const myUrl = this._url ? this._url.toLowerCase() : this._url
      if (myUrl) {
        
        if (postData) {
          if (typeof postData === 'string') {
            try {
              // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
              this._requestHeaders = postData
            } catch (err) {
              console.log('Request Header JSON decode failed, transfer_encoding field could be base64')
              console.log(err)
            }
          } else if (typeof postData === 'object' || typeof postData === 'number' || typeof postData === 'boolean') {
            // do something if you need
          }
        }
        
        // here you get the RESPONSE HEADERS
        const responseHeaders = this.getAllResponseHeaders()
  
        if (this.responseType !== 'blob' && this.responseText) {
          // responseText is string or null
          try {
            
            // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
            // const arr = this.responseText
  
            // printing url, request headers, response headers, response body, to console
            
            console.log(this._url)
            // this._requestHeadersを呼ぶとindexOfが機能しなくなる
            // console.log(JSON.parse(this._requestHeaders))
            console.log(responseHeaders)
            // console.log(JSON.parse(arr))
            
            // Udemy VTT Download
            let title
            if (this._url.indexOf("https://vtt-c.udemycdn.com/") !== -1){
              title = document.querySelector('li[aria-current="true"] span[data-purpose="item-title"]').textContent
              fileDownloadFromUrl(`${title}.vtt`,this._url).then(r => r)
            }
            
          } catch (err) {
            console.log('Error in responseType try catch')
            console.log(err)
          }
        }
      }
    })
    
    return send.apply(this, arguments)
  }
  
})(XMLHttpRequest)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
async function fileDownloadFromUrl(fileName, fileUrl) {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const newBlob = new Blob([blob]);
  const objUrl = window.URL.createObjectURL(newBlob);
  const link = document.createElement("a");
  link.href = objUrl;
  link.download = fileName;
  link.click();
  // For Firefox it is necessary to delay revoking the ObjectURL.
  setTimeout(() => {
    window.URL.revokeObjectURL(objUrl);
  }, 250);
}