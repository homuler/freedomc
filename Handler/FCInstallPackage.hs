module Handler.FCInstallPackage where

import Import
import System.FilePath.Posix
import Text.Hamlet (shamletFile)
import qualified Data.Text as T
import qualified FC.Typing.IO as FTIO
import qualified FC.Data.Typing as FCDT

getFCInstallPackageR :: Handler TypedContent
getFCInstallPackageR = do
  configPaths <- liftIO $ FTIO.enumPackageList ""
  mapM (\x -> do
           $logInfo $ T.pack x) configPaths
  musicList <- runDB $ selectList [] []
  let registeredList =
        map (\(Entity _ music) -> fCTypingMusicConfigPath music) musicList
  packageList <- liftIO $ (zip [1..]) <$> foldr (\x acc -> do
                                    let pName = takeDirectory $ (splitPath x) !! 0
                                        title = takeBaseName x
                                    contents <- FTIO.getPackageContents $
                                                  FTIO.musicRootDirectory </> (takeDirectory x)
                                    if (T.pack $ FTIO.musicRootDirectory </> x) `elem` registeredList
                                      then acc
                                      else ((pName, title):) <$> acc)
                 (return []) configPaths
  selectRep $ do
    provideRep $ return $(shamletFile "templates/fc/fc-typing-package-list.hamlet")

postFCInstallPackageR :: Handler Html
postFCInstallPackageR = do
  configPaths <- liftIO $ FTIO.enumPackageList ""
  musicList <- runDB $ selectList [] []
  let registeredList =
        map (\(Entity _ music) -> fCTypingMusicConfigPath music) musicList
  packageList <- liftIO $ foldr (\x acc -> do
                         contents <- FTIO.getPackageContents $ FTIO.musicRootDirectory </> (takeDirectory x)
                         if (T.pack $ FTIO.musicRootDirectory </> x) `elem` registeredList
                            then acc
                            else (contents:) <$> acc) (return []) configPaths
  $logInfo $ T.pack $ show registeredList
  $logInfo $ T.pack $ show packageList
  msg <- foldr (\(w, x, y, z) acc -> do
                   case (w, x, y, z) of
                     (Just mp, mpp, Just lp, Just cp) -> do
                       $logInfo $ T.pack $ show w
                       $logInfo $ T.pack $ show x
                       $logInfo $ T.pack $ show y
                       $logInfo $ T.pack $ show z
                       let title = takeBaseName cp
                       musicInfo <- liftIO $ FTIO.parseConfigFile cp
                       case musicInfo of
                         Just mi -> do
                           let musician = FCDT.musician mi
                               genre = FCDT.genre mi
                               format = FCDT.format mi
                           _ <- runDB $ insert $
                                FCTypingMusic
                                (T.pack title)
                                (FCDT.musician mi)
                                ((map $ T.pack . show) <$> FCDT.genre mi)
                                Nothing
                                format
                                (T.pack mp)
                                (T.pack lp)
                                (T.pack <$> mpp)
                                (T.pack cp)
                           ((title ++ " is installed.\n"):) <$> acc
                         Nothing -> ((title ++ " can't be installed.\n"):) <$> acc
                     (_, _, _, Just cp) -> do
                       let title = takeBaseName cp
                       ((title ++ " can't be installed.\n"):) <$> acc
                     _ -> error "config file not found.")
         (return []) packageList
  setMessage $ toHtml . T.pack $ concat msg
  redirect FCTypingR
