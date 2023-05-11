<template>
  <div>
    <file-pond
      ref="pond"
      name="test"
      v-bind="ZHCN"
      :allow-multiple="true"
      accepted-file-types="image/jpeg, image/png"
      :server="filePondServer"
      :files="myFiles"
      @init="handleFilePondInit"
    />
  </div>
</template>

<script setup lang="ts">
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'

import ZHCN from 'filepond/locale/zh-cn.js'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageEdit from 'filepond-plugin-image-edit'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import vueFilePond from 'vue-filepond'

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageEdit
)
const pond = ref()
const myFiles = ref(['cat.jpeg'])

const filePondServer = {
  process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
    // fieldName is the name of the input field
    // file is the actual file object to send
    const formData = new FormData()
    formData.append(fieldName, file, file.name)

    const request = new XMLHttpRequest()
    request.open('POST', 'url-to-api')

    // Should call the progress method to update the progress to 100% before calling load
    // Setting computable to false switches the loading indicator to infinite mode
    request.upload.onprogress = e => {
      progress(e.lengthComputable, e.loaded, e.total)
    }

    // Should call the load method when done and pass the returned server file id
    // this server file id is then used later on when reverting or restoring a file
    // so your server knows which file to return without exposing that info to the client
    request.onload = function () {
      if (request.status >= 200 && request.status < 300) {
        // the load method accepts either a string (id) or an object
        load(request.responseText)
      } else {
        // Can call the error method if something is wrong, should exit after
        error('oh no')
      }
    }

    request.send(formData)

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // This function is entered if the user has tapped the cancel button
        request.abort()

        // Let FilePond know the request has been cancelled
        abort()
      }
    }
  },
  revert: (uniqueFileId, load, error) => {
    // Should remove the earlier created temp file here
    // ...

    // Can call the error method if something is wrong, should exit after
    error('oh my goodness')

    // Should call the load method when done, no parameters required
    load()
  },
  load: (source, load, error, progress, abort, headers) => {
    // Should request a file object from the server here
    // ...

    // Can call the error method if something is wrong, should exit after
    error('oh my goodness')

    // Can call the header method to supply FilePond with early response header string
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
    headers(headersString)

    // Should call the progress method to update the progress to 100% before calling load
    // (endlessMode, loadedSize, totalSize)
    progress(true, 0, 1024)

    // Should call the load method with a file object or blob when done
    load(file)

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // User tapped cancel, abort our ongoing actions here

        // Let FilePond know the request has been cancelled
        abort()
      }
    }
  },
  fetch: (url, load, error, progress, abort, headers) => {
    // Should get a file object from the URL here
    // ...

    // Can call the error method if something is wrong, should exit after
    error('oh my goodness')

    // Can call the header method to supply FilePond with early response header string
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
    headers(headersString)

    // Should call the progress method to update the progress to 100% before calling load
    // (computable, loadedSize, totalSize)
    progress(true, 0, 1024)

    // Should call the load method with a file object when done
    load(file)

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // User tapped abort, cancel our ongoing actions here

        // Let FilePond know the request has been cancelled
        abort()
      }
    }
  },
  restore: (uniqueFileId, load, error, progress, abort, headers) => {
    // Should get the temporary file object from the server
    // ...

    // Can call the error method if something is wrong, should exit after
    error('oh my goodness')

    // Can call the header method to supply FilePond with early response header string
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
    headers(headersString)

    // Should call the progress method to update the progress to 100% before calling load
    // (computable, loadedSize, totalSize)
    progress(true, 0, 1024)

    // Should call the load method with a file object when done
    load(serverFileObject)

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // User tapped abort, cancel our ongoing actions here

        // Let FilePond know the request has been cancelled
        abort()
      }
    }
  },
  remove: (source, load, error) => {
    // Should somehow send `source` to server so server can remove the file with this source

    // Can call the error method if something is wrong, should exit after
    error('oh my goodness')

    // Should call the load method when done, no parameters required
    load()
  }
}

function handleFilePondInit(a) {
  // console.log(typeof ZHCN, '中文')
  // console.log(pond.value._pond.setOptions(ZHCN), '123')
}
</script>

<style scoped></style>
