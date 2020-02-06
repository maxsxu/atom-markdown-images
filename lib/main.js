'use babel';

import { CompositeDisposable } from 'atom';
import { clipboard } from 'electron';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getConfig, getImageURL} from './util';
import Uploader from './uploader';

export default {

  subscriptions: null,

  activate(state) {
    console.log("@activate");

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'markdown-images:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    console.log("@deactivate");
    this.subscriptions.dispose();
  },

  serialize() {
    // console.log("@serialize");
  },

  toggle() {
    console.log('@toggle');

    // Check settings
    let repositoryPath = getConfig('repository')
    if (!repositoryPath) {
      atom.notifications.addWarning('Please specify the images repository', {dismissable: true})
      return false
    }

    let username = getConfig('username')
    if (!username) {
      atom.notifications.addWarning('Please specify the username', {dismissable: true})
      return false
    }

    let password = getConfig('password')
    if (!password) {
      atom.notifications.addWarning('Please specify the password', {dismissable: true})
      return false
    }

    let committer_name = getConfig('committer-name')
    if (!committer_name) {
      atom.notifications.addWarning('Please specify the committer name', {dismissable: true})
      return false
    }

    let committer_email = getConfig('committer-email')
    if (!committer_email) {
      atom.notifications.addWarning('Please specify the committer_email', {dismissable: true})
      return false
    }

    let commit_message = getConfig('commit-message')
    if (!commit_message) {
      commit_message = "Auto Commit"
    }

    // Check current file type
    let editor = atom.workspace.getActiveTextEditor();
    if (editor.getPath() == undefined) {
      atom.notifications.addWarning("Only Support Markdown files")
      return false
    }
    if (path.extname(editor.getPath()) !== '.md') {
      atom.notifications.addWarning("Only Support Markdown files")
      return false
    }

    try {
      // Check only images
      if (clipboard.readImage().isEmpty()) return

      // Read image from clipboard
      let buffer = clipboard.readImage().toPNG()

      // Compute SHA-256 of image
      let sha = crypto.createHash('sha256');
      sha.update(buffer);
      let sha256 = sha.digest('hex');

      // Insert placeholder
      let placeHolderText = `uploading-${sha256}`;
      editor.insertText(`![](${placeHolderText})`, editor);

      // Write image to local repository
      let imageName = sha256
      let imagePath = path.join(repositoryPath, imageName);
      fs.writeFileSync(imagePath, Buffer.from(buffer))

      // Upload image to remote repository
      let uploader = new Uploader(repositoryPath, imageName, username, password, committer_name, committer_email, commit_message)
      uploader.start().then(remoteURL => {
        let url = getImageURL(remoteURL, imageName)
        editor.scan(new RegExp(placeHolderText), place => place.replace(url))
      })

    } catch (e) {
      console.error(e);
    } finally {

    }

  }

};
