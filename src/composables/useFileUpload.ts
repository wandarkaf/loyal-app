import { ref } from 'vue'

const filesToUpload = ref<{ key: string; blob: File }[] | null>([])

export function useFileUpload() {
  const handleFileUpload = (e: Event, key: string, cb: (key: string, value: string) => void) => {
    const inputElement = e.target as HTMLInputElement
    const fileToUpload = inputElement.files ? inputElement.files[0] : null
    if (fileToUpload) {
      const filterFiles = filesToUpload.value?.filter(({ key: keyVal }) => keyVal !== key)
      filesToUpload.value = [...(filterFiles || []), { key, blob: fileToUpload as File }]
      const reader = new FileReader()
      reader.onload = (event) => {
        cb(key, event.target ? (event.target.result as string) : '')
      }
      reader.readAsDataURL(fileToUpload as Blob)
    }
  }

  return { filesToUpload, handleFileUpload }
}
