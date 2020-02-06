'use babel';

const configPrefix = 'markdown-images.git-'

export const getConfig = (key) => {
  return atom.config.get(configPrefix + key)
}

export const getImageURL = (remoteURL, imageName) => {
  if (remoteURL.startsWith('https://')) {
    return remoteURL.replace('.git', `/raw/master/${imageName}`)
  } else if (remoteURL.startsWith('git@')) {
    return remoteURL.replace(':', '/').replace('git@', 'https://')
    .replace('.git', `/raw/master/${imageName}`)
  } else {
    console.error("Illegal remoteURL");
  }
}
