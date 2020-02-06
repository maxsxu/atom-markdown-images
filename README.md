<h1 align="center"> Markdown Images </h1>


`markdown-images` uses remote git repository, like GitHub, to provide you image URL.


# Introduction
What does this plugin do?

1. Read image from clipboard and write it to git repository with name of SHA-256 value (Content-based Addressing)
2. Add, Commit and Push to remote repository
3. Return a remote image URL

Which repositories do we support?

- GitHub Repository
- GitLab Repository
- ...

You just need to create a repository in these providers, and clone to your local computer.


# Installation
This plugin can be installed via Atom's GUI or via the command line:

```
apm install markdown-images
```

# Settings
- Path of Git Repository for Images
- Username
- Password
- Committer Name
- Committer Email
- Commit Message


# Keybindings
| Shortcuts |	Functionality |
|:---:|:---:|
| `cmd-shift-v`	| Paste Image |


# Examples
- github repository
 ```
 ![](https://github.com/jsonbruce/NoteImages/raw/master/d22028cd8a75ff3c0c0c4dcdb4e03203d8f150690bc362a12fd47455dce89ba3)
 ```

- gitlab repository
 ```
 ![](https://gitlab.com/jsonbruce/NoteImages/raw/master/d22028cd8a75ff3c0c0c4dcdb4e03203d8f150690bc362a12fd47455dce89ba3)
 ```


# Changelog
See [CHANGELOG](CHANGELOG.md)


# License
[University of Illinois/NCSA Open Source License](LICENSE.md)
