module FC.Typing.IO where

import Import
import System.FilePath
import System.Directory
import Control.Monad
import qualified Data.Text as T
import qualified Data.Char as C
import qualified FC.Data.Typing as FCDT
import qualified Data.ByteString.Lazy as B
import qualified Data.Text.Lazy as TL
import qualified Data.Text.Lazy.Encoding as E
import Data.Aeson

saveConfigFile :: (ToJSON a) => a -> FilePath -> IO ()
saveConfigFile x path = B.writeFile path $ encode x

readConfigFile :: FilePath -> IO Text
readConfigFile path = TL.toStrict . E.decodeUtf8 <$> B.readFile path

parseConfigFile :: FilePath -> IO (Maybe FCDT.TypingMusicInfo)
parseConfigFile path = do
  file <- B.readFile path
  return $ decode file

uploadDirectory :: FilePath
uploadDirectory = "static"

musicRootDirectory :: FilePath
musicRootDirectory = uploadDirectory </> "music"

createMusicDirectory :: FilePath -> IO ()
createMusicDirectory dir = do
  let musicDir = musicRootDirectory </> dir
  existDir <- doesDirectoryExist musicDir
  unless existDir$
    createDirectory musicDir

writeToServer' :: String -> FileInfo -> IO FilePath
writeToServer' path file = do
  let filename = T.unpack $ fileName file
      filepath = path </> filename
  liftIO $ fileMove file filepath
  return filepath

writeToServer :: String -> FileInfo -> IO FilePath
writeToServer path file = do
  let filename = T.unpack $ fileName file
      filepath = musicFilePath path filename
  liftIO $ fileMove file filepath
  return filepath

musicFilePath :: String -> String -> FilePath
musicFilePath subdir file  = musicRootDirectory </> subdir </> file

getDirName :: String -> IO FilePath
getDirName str = do
  isNotUnique <- doesDirectoryExist $ musicRootDirectory </> tmp
  if isNotUnique
    then getNextDir tmp 2
    else return tmp
    where tmp = let (x:xs) = map (map C.toLower) $ Import.words str
                in concat $ x:map capitalize xs
          getNextDir :: String -> Int -> IO FilePath
          getNextDir dir n = do
            doesExist <- doesDirectoryExist $
                         musicRootDirectory </> (dir ++ show n)
            if not doesExist
              then return (dir ++ show n)
              else getNextDir dir (n+1)

capitalize :: String -> String
capitalize (x:xs) = C.toUpper x:xs
capitalize x = x
