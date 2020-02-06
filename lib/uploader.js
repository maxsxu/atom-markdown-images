'use babel';

var git = require('nodegit');

var repo, index, oid, remoteURL;

export default class Uploader {
	constructor(repopath, fname, username, password, cname, cemail, cmessage) {
		this.repositoryPath = repopath
		this.fileName = fname
		this.username = username
		this.password = password
		this.committer_name = cname
		this.committer_email = cemail
		this.commit_message = cmessage
	}

	start() {
		return new Promise((resolve, reject) => {
			this.gitAdd()
			.then(() => this.gitCommit())
			.then(() => this.gitPush())
			.then(() => resolve(remoteURL))
			.catch((e) => console.error(e))
		})
	}

	gitAdd() {
		console.log("@gitAdd");
		return git.Repository.open(this.repositoryPath)
		.then((repoResult) => repo = repoResult)
		.then(() => repo.refreshIndex())
		.then((indexResult) => index = indexResult)
	  .then(() => index.addByPath(this.fileName))
		.then(() => index.write())
		.then(() => index.writeTree())
		.then((oidResult) => oid = oidResult)
	}

	gitCommit() {
		console.log("@gitCommit");
		let author = git.Signature.now(this.committer_name, this.committer_email)
		let committer = git.Signature.now(this.committer_name, this.committer_email)
		let hasLog = git.Reference.hasLog(repo, 'HEAD')

		if (hasLog == 0) {
			// First Commit
			return repo.createCommit("HEAD", author, committer, this.commit_message, oid, [])
		} else {
			// Non-First Commit
			return git.Reference.nameToId(repo, "HEAD")
			.then((head) => {
				return repo.getCommit(head)
			})
			.then((parent) => {
				return repo.createCommit("HEAD", author, committer, this.commit_message, oid, [parent])
			})
		}
	}

	gitPush() {
		console.log("@gitPush");
		return git.Remote.lookup(repo, 'origin')
	 	.then((remote) => {
			remoteURL = remote.url()
	 		return remote.push(
		    	['refs/heads/master:refs/heads/master'],
			    {
			        callbacks: {
			        	credentials : () => git.Cred.userpassPlaintextNew(this.username, this.password)
			        }
			    }
		    )
	 	})
	}
}


// GitLab:
//    https://gitlab.com/jsonbruce/NoteImage.git
//    git@gitlab.com:jsonbruce/NoteImage.git
//
// GitHub:
//     https://github.com/jsonbruce/NoteImage.git
//     git@github.com:jsonbruce/NoteImage.git
//
// Reference.nameToId(repo: Repository, name: String).then((oid) => {});   //The long name for the reference (e.g. HEAD, refs/heads/master, refs/tags/v0.1.0, …)
// repository.getCommit([String, Oid]).then((commit) => {});
// repository.createCommit(updateRef: String, author: Signature, committer: Signature, message: String, Tree: [Oid,String], parents: Array).then((oid) => {});
