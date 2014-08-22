freedomc
========

Freedom Concerto -Web Application written with Yesod Framework  

install
-------

1. download the source.  
2. install haskell-platform  
	`yum install haskell-platform`  
3. update cabal
	`cabal update`  
	`cabal install cabal-install`  
	check if your cabal-install version is over 1.20
		`cabal --version  `
	if not, edit your .bashrc
		`PATH=$HOME/.cabal/bin:$PATH`
4. build
	`cabal sandbox init`  
	`cabal install`
	`yesod devel`
5. install postgresql
	`yum install postgresql-server`
	`su - postgres`
	`psql`
	`CREATE USER freedomc WITH PASSWORD 'freedomc';
	CREATE DATABASE freedomc;
	GRANT ALL PRiVILEGES ON DATABASE freedomc TO freedomc;`
	`\q`


