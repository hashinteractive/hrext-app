define(['lodash'], function(_){
  class Store {
    constructor() {
      this.actions = {
        setItem: (key, value) => {
          window.localStorage.setItem(key, JSON.stringify(value));
        },
        addFolder: (value) => {
          //first check if there is key `folders` set, if not set empty array since this is the first folder
          if(!this.getters.getItem('folders'))
            this.actions.setItem('folders', [])

          //continue to add to the folder
          //create unique id
          let id = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
          //create folder object
          let folder = { id, name: value, images: [] }
          //get parsed folders array
          let folders = this.getters.getItem('folders')
          //push folder onto folders
          folders.push(folder)
          //set the new folders key: value
          this.actions.setItem('folders', folders)
          //return newly created folder
          return folder
        },
        saveImageToFolder: (folderId, imageId) => {
          let folders = this.getters.getItem('folders')
          let index = folders.findIndex(f => f.id == folderId)
          let folder = folders[index]
          //make sure image isn't in the folder already
          if(folder.images.find(image => image == imageId)) return

          //proceed to add
          folder.images.push(imageId)

          //splice folders array replacing folder with new folder that has image saved
          folders.splice(index, 1, folder)
          this.actions.setItem('folders', folders)
          //return updated folder
          return folder
        },
        deleteImageFromFolder: (folderId, imageId) => {
          let folders = this.getters.getItem('folders'),
              index = folders.findIndex(f => f.id == folderId),
              folder = folders[index]

          //make sure the image is in the folder
          //using findIndex to splice image from folder later
          let imageIndex = folder.images.findIndex(i => i == imageId)
          if(imageIndex === -1) return
         
          //splice the image out of folder.images
          folder.images.splice(imageIndex, 1)
          //splice folders array replacing folder with new folder that has image saved
          folders.splice(index, 1, folder)
          this.actions.setItem('folders', folders)
          //return updated folder
          return folder
        },
        deleteFolder: (id) => {
          let folders = this.getters.getItem('folders'),
              index = folders.findIndex(f => f.id === id)
          
          //make sure folder is in folders
          if(index === -1) return

          let deleted = folders.splice(index, 1)
          this.actions.setItem('folders', folders)
          return deleted
        }
      };
      this.getters = {
        getItem: (key) => {
          return JSON.parse(window.localStorage.getItem(key))
        },
        getFolder: (id) => {
          return this.getters.getItem('folders').find(f => f.id === id)
        }
      }
    }
  }

  return new Store()
})