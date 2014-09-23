module Handler.FC.Typing.InstallPackage where

import Import
import System.FilePath.Posix
import Text.Hamlet (shamletFile)
import qualified Data.Text as T
import qualified FC.Form.Fields as FCField
import qualified FC.Typing.IO as FTIO
import qualified FC.Data.Typing as FCDT
import qualified FC.Data.Music as FCDM

getFCInstallPackageR :: Handler TypedContent
getFCInstallPackageR = do
  configPaths <- liftIO $ FTIO.enumPackageList ""
  mapM (\x -> do
           $logInfo $ T.pack x) configPaths
  musicList <- runDB $ selectList [] []
  let registeredList =
        map (\(Entity _ music) -> fCMusicDataConfigPath music) musicList
  packageList <- liftIO $ (zip [1..]) <$>
                   foldr (\x acc -> do
                             let pName = takeDirectory $ (splitPath x) !! 0
                                 title = takeBaseName x
                                 musicRoot = takeDirectory x
                             contents <- FTIO.getPackageContents $
                                         FTIO.musicRootDirectory </> (takeDirectory x)
                             if (T.pack $ FTIO.musicRootDirectory </> x) `elem` registeredList
                               then acc
                               else ((pName, title, musicRoot):) <$> acc)
                   (return []) configPaths
  selectRep $ do
    provideRep $ return $(shamletFile "templates/fc/fc-typing-package-list.hamlet")

postFCInstallPackageR :: Handler ()
postFCInstallPackageR = do
  mPackageListInput <- runInputPost $ iopt FCField.multiDynamicCheckBox "package-list[]"
  case mPackageListInput of
    Just packageListInput -> do
      packageList <-
        foldr (\x acc -> do
                  paths <- liftIO $ FTIO.getPackageContents $ FTIO.musicRootDirectory </> (T.unpack x)
                  acc' <- acc
                  return $ paths:acc')
        (return []) packageListInput
      $logInfo $ T.pack $ show packageList
      msg <- foldr
             (\(w, x, y, z) acc -> do
                 case (w, x, y, z) of
                   (Just mp, mpp, Just lp, Just cp) -> do
                     let title = takeBaseName cp
                     musicInfo <- liftIO $ FTIO.parseConfigFile cp
                     case musicInfo of
                       Just mi -> do
                         _ <- case mpp of
                           Just pictPath -> liftIO $ FTIO.convertPicture pictPath
                           Nothing -> return ()
                         let musician = FCDT.musician mi
                             genre = FCDT.genre mi
                             format = FCDT.format mi
                         _ <- runDB $ insert $
                              FCMusicData
                              (T.pack title)
                              (FCDT.musician mi)
                              ((map $ T.pack . show) <$> FCDT.genre mi)
                              format
                              (T.pack mp)
                              (T.pack lp)
                              (T.pack <$> mpp)
                              (T.pack cp)
                         ((title ++ " is installed."):) <$> acc
                       Nothing -> ((title ++ " can't be installed.\n"):) <$> acc
                   (_, _, _, Just cp) -> do
                     let title = takeBaseName cp
                     ((title ++ " can't be installed.\n"):) <$> acc
                   _ -> error "config file not found.")
             (return []) packageList
      setMessage $ toHtml . T.pack $ concat msg
      --redirect FCTypingR
    Nothing -> do
               setMessage "Invalid Post"
       --        redirect FCInstallPackageR
