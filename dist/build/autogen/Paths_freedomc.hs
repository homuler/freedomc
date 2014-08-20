module Paths_freedomc (
    version,
    getBinDir, getLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
catchIO = Exception.catch


version :: Version
version = Version {versionBranch = [0,0,0], versionTags = []}
bindir, libdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/home/homulerdora/Shared/Documents/src/practice/haskell/yesod/hello/.cabal-sandbox/bin"
libdir     = "/home/homulerdora/Shared/Documents/src/practice/haskell/yesod/hello/.cabal-sandbox/lib/x86_64-linux-ghc-7.6.3/freedomc-0.0.0"
datadir    = "/home/homulerdora/Shared/Documents/src/practice/haskell/yesod/hello/.cabal-sandbox/share/x86_64-linux-ghc-7.6.3/freedomc-0.0.0"
libexecdir = "/home/homulerdora/Shared/Documents/src/practice/haskell/yesod/hello/.cabal-sandbox/libexec"
sysconfdir = "/home/homulerdora/Shared/Documents/src/practice/haskell/yesod/hello/.cabal-sandbox/etc"

getBinDir, getLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "freedomc_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "freedomc_libdir") (\_ -> return libdir)
getDataDir = catchIO (getEnv "freedomc_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "freedomc_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "freedomc_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
