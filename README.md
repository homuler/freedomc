freedomc
======

Freedom Concerto -Web Application written with Yesod Framework  

-- - - -
## Requirements

* haskell-platform (latest)
* postgresql (>= 9.2)

- - - -

## Install

1. Download the source code.  
2. install haskell-platform  

        yum install haskell-platform  

3. install postgresql  
        
        yum install postgresql-server postgresql-devel postgresql-contrib  
        su - postgres  
        CREATE USER freedomc WITH PASSWORD 'freedomc';  
        CREATE DATABASE freedomc;  
        GRANT ALL PRiVILEGES ON DATABASE freedomc TO freedomc;      
        \q  

3. update cabal  
   
        cabal update  
        cabal install cabal-install  

* check if your cabal-install version is over 1.20  
              
        cabal --version
    
If not, edit your .bashrc etc.  
    
    PATH=$HOME/.cabal/bin:$PATH  

4. postgresql settings  
* Edit you conf file  
ex:
    
        vim /var/lib/pgsql/data/pg_hba.conf  
        local all all password  
        host all all 127.0.0.1/32 password   
        host all all ::1/128 password      

5. environment settings  
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
