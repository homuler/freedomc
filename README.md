freedomc
======

Freedom Concerto -Web Application written with Yesod Framework  

-- - - -
## Requirements

* haskell-platform (latest)

- - - -

## Install

1. Download the source code.  
2. install haskell-platform  

        yum install haskell-platform  

3. update cabal  
   
        cabal update  
        cabal install cabal-install  

* check if your cabal-install version is over 1.20  
              
        cabal --version
    
If not, edit your .bashrc etc.  
    
    PATH=$HOME/.cabal/bin:$PATH  

4. environment settings  
* edit settings.yml  
ex:

        vim config/settings.yml
        approot "http://localhost:3000"  

4. build
    
        cd ${freedomc-root-path}/freedomc  
        cabal sandbox init  
        cabal install && cabal configure && cabal build  
        ./dist/build/freedomc/freedomc Development --port 3000  

- - - -

## How to use?

* access to "http://{your domain}:3000/freedomc"
